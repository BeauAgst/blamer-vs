import {
  LogOutputChannel,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TextEditor,
  TextEditorDecorationType,
  TextEditorSelectionChangeEvent,
  window,
  workspace,
} from "vscode";
import { Storage } from "./storage";
import { SVN } from "./svn";
import { getFileNameFromTextEditor } from "./util/get-file-name-from-text-editor";
import { EXTENSION_CONFIGURATION, EXTENSION_NAME } from "./const/extension";
import { DecorationManager } from "./decoration-manager";
import { DecorationRecord } from "./types/decoration-record.model";

export class Blamer {
  private activeTextEditor: TextEditor | undefined;
  private activeFileName: string | undefined;
  private activeLine: string | undefined;
  private activeLineDecoration: TextEditorDecorationType | undefined;
  private statusBarItem: StatusBarItem;

  constructor(
    private logger: LogOutputChannel,
    private storage: Storage,
    private svn: SVN,
    private decorationManager: DecorationManager
  ) {
    this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 0);
  }

  setStatusBarText(message: string, icon?: string) {
    const text = [icon ? `$(${icon})` : "", `${EXTENSION_NAME}:`, message];
    this.statusBarItem.text = text.filter(Boolean).join(" ");
  }

  clearRecordsForFile(fileName: string) {
    return this.storage.delete(fileName);
  }

  clearRecordsForAllFiles() {
    return this.storage.clear();
  }

  async getRecordsForFile(fileName?: string) {
    if (!fileName) {
      return undefined;
    }
    const result = await this.storage.get<DecorationRecord>(fileName);
    return result;
  }

  setRecordsForFile(fileName: string, record: DecorationRecord) {
    return this.storage.set<DecorationRecord>(fileName, record);
  }

  async getActiveTextEditorAndFileName() {
    const textEditor = window.activeTextEditor;
    const fileName = await getFileNameFromTextEditor(textEditor);

    return { fileName, textEditor };
  }

  handleClosedDocument(textDocument: TextDocument) {
    const { fileName } = textDocument;
    this.logger.debug("Document closed, clearing blame", { fileName });
    return this.clearRecordsForFile(fileName);
  }

  async clearBlameForFile(fileName?: string) {
    if (!fileName) {
      this.logger.debug("No file found, aborting...");
      return;
    }

    const records = await this.getRecordsForFile(fileName);
    this.activeLineDecoration?.dispose();

    if (!records) {
      return;
    }

    this.logger.info("Clearing blame for file", { fileName });

    Object.values(records)?.map(({ decoration }) => decoration?.dispose?.());

    await this.clearRecordsForFile(fileName);
  }

  async clearBlameForActiveTextEditor() {
    const { fileName } = await this.getActiveTextEditorAndFileName();

    return this.clearBlameForFile(fileName);
  }

  async getLogsForFile(fileName: string, revisions: string[]) {
    const { enableLogs } = workspace.getConfiguration(EXTENSION_CONFIGURATION);

    if (!enableLogs) {
      this.logger.debug("Logging disabled, will run not log child process");
      return [];
    }

    this.logger.info("Fetching logs for revisions", {
      fileName,
      revisions: revisions.length,
    });

    this.statusBarItem.show();
    this.setStatusBarText("Fetching logs...", "loading~spin");

    const result = await this.svn.getLogsForRevisions(fileName, revisions);

    return result;
  }

  async showBlameForFile(textEditor?: TextEditor, fileName?: string) {
    if (!textEditor || !fileName) {
      this.logger.debug("No editor or file found, aborting...");
      return;
    }

    this.logger.info("Blaming file", { fileName });

    try {
      this.statusBarItem.show();
      this.setStatusBarText("Blaming file...", "loading~spin");

      await this.clearBlameForFile(fileName);

      const blame = await this.svn.blameFile(fileName);

      if (!blame.length) {
        return;
      }

      const uniqueRevisions = [
        ...new Set(blame.map(({ revision }) => revision)),
      ];

      const logs = await this.getLogsForFile(fileName, uniqueRevisions);

      const decorationRecords =
        await this.decorationManager.createAndSetDecorationsForBlame(
          textEditor,
          blame,
          uniqueRevisions,
          logs
        );

      this.statusBarItem.hide();
      await this.setRecordsForFile(fileName, decorationRecords);

      this.logger.info("Blame successful", { fileName });
    } catch (err: any) {
      this.logger.error("Blame action failed", { err: err?.message });
      window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
      this.statusBarItem.hide();
    }
  }

  async showBlameForActiveTextEditor() {
    const { fileName, textEditor } =
      await this.getActiveTextEditorAndFileName();
    return this.showBlameForFile(textEditor, fileName);
  }

  async toggleBlameForFile(textEditor?: TextEditor, fileName?: string) {
    const fileData = await this.getRecordsForFile(fileName);
    return fileData
      ? this.clearBlameForFile(fileName)
      : this.showBlameForFile(textEditor, fileName);
  }

  async toggleBlameForActiveTextEditor() {
    const { fileName, textEditor } =
      await this.getActiveTextEditorAndFileName();
    return this.toggleBlameForFile(textEditor, fileName);
  }

  async autoBlame(textEditor?: TextEditor) {
    try {
      if (!textEditor) {
        return;
      }

      const fileName = await getFileNameFromTextEditor(textEditor);
      const existingRecord = await this.getRecordsForFile(fileName);

      if (existingRecord) {
        this.decorationManager.reApplyDecorations(textEditor, existingRecord);
        return;
      }

      const { autoBlame } = workspace.getConfiguration(EXTENSION_CONFIGURATION);

      if (!autoBlame) {
        return;
      }

      return this.showBlameForFile(textEditor, fileName);
    } catch (err: any) {
      this.logger.error("Failed to auto-blame file", { err: err?.message });
      window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
      this.statusBarItem.hide();
    }
  }

  async trackLine(selectionChangeEvent: TextEditorSelectionChangeEvent) {
    const { textEditor } = selectionChangeEvent;
    const fileName = await getFileNameFromTextEditor(textEditor);

    if (!textEditor || !fileName) {
      this.logger.debug("No file found to track line");
      return;
    }

    const line = (textEditor.selection.active.line + 1).toString();

    this.activeLineDecoration?.dispose();
    await this.restorePreviousDecoration();
    await this.setUpdatedDecoration(textEditor, fileName, line);
  }

  async restorePreviousDecoration() {
    if (!this.activeTextEditor || !this.activeFileName || !this.activeLine) {
      return;
    }

    const records = await this.getRecordsForFile(this.activeFileName);
    const existingDecoration = records?.[this.activeLine];

    if (!existingDecoration) {
      return;
    }

    this.logger.debug("Reverting line-end decoration", {
      fileName: this.activeFileName,
      line: this.activeLine,
    });
    existingDecoration.decoration.dispose();
    const decoration = this.decorationManager.createAndSetLineDecoration(
      this.activeTextEditor,
      existingDecoration.metadata,
      "blame"
    );

    this.setRecordsForFile(this.activeFileName, {
      ...records,
      [this.activeLine]: { decoration, metadata: existingDecoration.metadata },
    });

    this.activeTextEditor = undefined;
    this.activeFileName = undefined;
    this.activeLine = undefined;
  }

  async setUpdatedDecoration(
    textEditor: TextEditor,
    fileName: string,
    line: string
  ) {
    const records = await this.getRecordsForFile(fileName);
    const existingDecoration = records?.[line];

    if (!existingDecoration) {
      return;
    }

    this.logger.debug("Setting new line decoration", {
      fileName,
      line,
    });

    existingDecoration.decoration.dispose();
    this.activeLineDecoration =
      this.decorationManager.createAndSetLineDecoration(
        textEditor,
        existingDecoration.metadata,
        "active_line"
      );
    this.activeTextEditor = textEditor;
    this.activeFileName = fileName;
    this.activeLine = line;
  }
}
