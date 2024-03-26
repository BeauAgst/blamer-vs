import * as vscode from "vscode";
import { blameFile } from "../svn/blame-file";
import { getLogForRevision } from "../svn/get-log-for-revision";
import { mapRevisionLogToDecorationData } from "../decoration/map-revision-log-to-decoration-data";
import { gutterImageGenerator } from "../util/gutter-image-generator";
import { setDecorationForLines } from "../decoration/set-decoration-for-lines";
import { setStatusBarText } from "../util/set-status-bar-text";
import { EXTENSION_CONFIGURATION, EXTENSION_NAME } from "../const/extension";
import { setBlamedFileDecorations } from "../storage/set-blamed-file-decorations";
import { getFileNameFromEditor } from "../util/get-file-name-from-editor";
import { getActiveTextEditor } from "../util/get-active-text-editor";

export const showBlame = async (
  context: vscode.ExtensionContext,
  existingEditor?: vscode.TextEditor,
  existingFilePath?: string
) => {
  const { enableLogs, enableVisualIndicators } =
    vscode.workspace.getConfiguration(`${EXTENSION_CONFIGURATION}.blame`);
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  try {
    const editor = existingEditor || getActiveTextEditor();
    const filePath = existingFilePath || getFileNameFromEditor(editor);

    const generator = enableVisualIndicators
      ? await gutterImageGenerator()
      : undefined;

    statusBarItem.show();
    setStatusBarText(statusBarItem, "Blaming file...", "loading~spin");
    const groupedBlameData = await blameFile(filePath);

    const logs = await Promise.all(
      Object.entries(groupedBlameData).map(
        async ([revisionNumber, blameData]) => {
          let revisionLog;

          if (enableLogs) {
            setStatusBarText(
              statusBarItem,
              "Fetching log data...",
              "loading~spin"
            );
            revisionLog = await getLogForRevision(filePath, revisionNumber);
          }

          return mapRevisionLogToDecorationData(
            blameData,
            generator?.next().value,
            revisionLog
          );
        }
      )
    );

    const decorations = logs.map((decorationData) => ({
      decorationData,
      decoration: setDecorationForLines(editor, decorationData, "blame"),
    }));

    statusBarItem.dispose();

    await setBlamedFileDecorations(context, filePath, decorations);
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
    statusBarItem.dispose();
  }
};
