import * as vscode from "vscode";
import { blameFile } from "./svn/blame-file";
import { getRevisionsFromLines } from "./blamer/get-revisions-from-lines";
import { getLogForRevision } from "./svn/get-log-for-revision";
import { mapRevisionLogToDecorationData } from "./decoration/map-revision-log-to-decoration-data";
import { gutterImageGenerator } from "./util/gutter-image-generator";
import { setDecorationForLines } from "./decoration/set-decoration-for-lines";
import { clearBlame } from "./clear-blame";
import { setStatusBarText } from "./util/set-status-bar-text";
import { EXTENSION_CONFIGURATION, EXTENSION_NAME } from "./const/extension";

export const showBlame = async (
  existingDecorations: vscode.TextEditorDecorationType[]
): Promise<vscode.TextEditorDecorationType[]> => {
  const { enableLogs, enablePips } = vscode.workspace.getConfiguration(
    `${EXTENSION_CONFIGURATION}.blame`
  );
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  try {
    clearBlame(existingDecorations);

    const editor = vscode.window.activeTextEditor;

    if (!editor?.document.fileName || editor?.document.isUntitled) {
      vscode.window.showInformationMessage(
        "SVN Gutter: Cannot blame this file"
      );

      return [];
    }

    const generator = enablePips ? await gutterImageGenerator() : undefined;

    const filePath = editor?.document.fileName;

    statusBarItem.show();
    setStatusBarText(statusBarItem, "Blaming file...", "loading~spin");
    const fileLines = await blameFile(filePath);
    const revisions = getRevisionsFromLines(fileLines);

    const logs = await Promise.all(
      Object.entries(revisions).map(
        async ([revisionNumber, linesWithRevision]) => {
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
            linesWithRevision,
            generator?.next().value,
            revisionLog
          );
        }
      )
    );

    const decorations = logs.map((decorationData) =>
      setDecorationForLines(editor, decorationData)
    );

    statusBarItem.dispose();

    return decorations;
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
    statusBarItem.dispose();
    return [];
  }
};
