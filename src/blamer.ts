import * as vscode from "vscode";
import { Storage } from "./storage";
import { SVN } from "./svn/svn";
import { getActiveTextEditor } from "./util/get-active-text-editor";
import { getFileNameFromTextEditor } from "./util/get-file-name-from-text-editor";
import { StatusBarItem } from "./status-bar-item";
import { EXTENSION_CONFIGURATION, EXTENSION_NAME } from "./const/extension";
import { DecorationManager } from "./decoration/decoration-manager";
import { DecorationRecord } from "./types/decoration-record.model";

export class Blamer {
  private activeDecoration: vscode.TextEditorDecorationType | undefined;
  private activeTextEditor: vscode.TextEditor | undefined;
  private activefileName: string | undefined;
  private activeLine: string | undefined;

  constructor(
    private storage: Storage,
    private svn: SVN,
    private statusBarItem: StatusBarItem,
    private decorationManager: DecorationManager
  ) {}

  clearRecordsForFile(fileName: string) {
    return this.storage.delete(fileName);
  }

  clearRecordsForAllFiles() {
    return this.storage.clear();
  }

  async getRecordsForFile(fileName: string) {
    const result = await this.storage.get<DecorationRecord>(fileName);
    return result;
  }

  setRecordsForFile(fileName: string, record: DecorationRecord) {
    return this.storage.set<DecorationRecord>(fileName, record);
  }

  getActiveTextEditorAndFileName() {
    const textEditor = getActiveTextEditor();
    const fileName = getFileNameFromTextEditor(textEditor);

    return { fileName, textEditor };
  }

  async clearBlameForFile(fileName: string) {
    const records = await this.getRecordsForFile(fileName);
    this.activeDecoration?.dispose();

    if (!records) {
      return;
    }
    Object.values(records)?.map(({ decoration }) => decoration?.dispose?.());

    await this.clearRecordsForFile(fileName);
  }

  async clearBlameForActiveTextEditor() {
    const { fileName } = this.getActiveTextEditorAndFileName();

    return this.clearBlameForFile(fileName);
  }

  async showBlameForFile(textEditor: vscode.TextEditor, fileName: string) {
    try {
      this.statusBarItem.show();
      this.statusBarItem.setText("Blaming file...", "loading~spin");

      this.clearBlameForFile(fileName);

      const blame = await this.svn.blameFile(fileName);

      const uniqueRevisions = [
        ...new Set(blame.map(({ revision }) => revision)),
      ];

      const logs = await this.svn.getLogsForRevisions(
        fileName,
        uniqueRevisions
      );

      const decorationRecords =
        await this.decorationManager.createAndSetDecorationsForBlame(
          textEditor,
          blame,
          uniqueRevisions,
          logs
        );

      this.statusBarItem.hide();
      await this.setRecordsForFile(fileName, decorationRecords);
    } catch (err) {
      console.error("Failed to blame file", err);
      vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
      this.statusBarItem.hide();
    }
  }

  async showBlameForActiveTextEditor() {
    const { fileName, textEditor } = this.getActiveTextEditorAndFileName();
    return this.showBlameForFile(textEditor, fileName);
  }

  async toggleBlameForFile(textEditor: vscode.TextEditor, fileName: string) {
    const fileData = await this.getRecordsForFile(fileName);
    return fileData
      ? this.clearBlameForFile(fileName)
      : this.showBlameForFile(textEditor, fileName);
  }

  async toggleBlameForActiveTextEditor() {
    const { fileName, textEditor } = this.getActiveTextEditorAndFileName();
    return this.toggleBlameForFile(textEditor, fileName);
  }

  async autoBlame(textEditor?: vscode.TextEditor) {
    try {
      if (!textEditor) {
        return;
      }

      const fileName = getFileNameFromTextEditor(textEditor);
      const existingRecord = await this.getRecordsForFile(fileName);

      if (existingRecord) {
        this.decorationManager.reApplyDecorations(textEditor, existingRecord);
        return;
      }

      const { autoBlame } = vscode.workspace.getConfiguration(
        EXTENSION_CONFIGURATION
      );

      if (!autoBlame) {
        console.debug("Auto-blame configuration is disabled, skipping...");
        return;
      }

      return this.showBlameForFile(textEditor, fileName);
    } catch (err) {
      console.error("Failed to auto-blame file", err);
      vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
      this.statusBarItem.hide();
    }
  }

  async trackLine(selectionChangeEvent: vscode.TextEditorSelectionChangeEvent) {
    const { textEditor } = selectionChangeEvent;

    if (!textEditor) {
      return;
    }

    const fileName = getFileNameFromTextEditor(textEditor);
    const line = (textEditor.selection.active.line + 1).toString();

    this.activeDecoration?.dispose();
    await this.restorePreviousDecoration();
    await this.setUpdatedDecoration(textEditor, fileName, line);
  }

  async restorePreviousDecoration() {
    if (!this.activeTextEditor || !this.activefileName || !this.activeLine) {
      console.debug("no previous line to restore");
      return;
    }

    const records = await this.getRecordsForFile(this.activefileName);
    const existingDecoration = records?.[this.activeLine];

    if (!existingDecoration) {
      console.debug("No decoration found for previous line");
      return;
    }

    console.debug("Setting previous decoration on line", this.activeLine);
    const decoration = this.decorationManager.createAndSetLineDecoration(
      this.activeTextEditor,
      existingDecoration.metadata,
      "blame"
    );

    console.debug("Storing decoration for previous line");
    this.setRecordsForFile(this.activefileName, {
      ...records,
      [this.activeLine]: { decoration, metadata: existingDecoration.metadata },
    });

    this.activeTextEditor = undefined;
    this.activefileName = undefined;
    this.activeLine = undefined;
  }

  async setUpdatedDecoration(
    textEditor: vscode.TextEditor,
    fileName: string,
    line: string
  ) {
    const records = await this.getRecordsForFile(fileName);
    const existingDecoration = records?.[line];

    if (!existingDecoration) {
      console.debug("No blame on current line, skipping...");
      return;
    }

    console.debug("Clearing decoration on line", line);
    existingDecoration.decoration.dispose();
    console.debug("Setting new decoration on line", line);
    this.activeDecoration = this.decorationManager.createAndSetLineDecoration(
      textEditor,
      existingDecoration.metadata,
      "active_line"
    );
    this.activeTextEditor = textEditor;
    this.activefileName = fileName;
    this.activeLine = line;
  }
}
