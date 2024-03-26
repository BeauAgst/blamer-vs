import * as vscode from "vscode";
import { blameFile } from "../svn/blame-file";
import { mapBlameToDecorationData } from "../decoration/map-blame-to-decoration-data";
import { setStatusBarText } from "../util/set-status-bar-text";
import { EXTENSION_NAME } from "../const/extension";
import { getFileNameFromEditor } from "../util/get-file-name-from-editor";
import { getActiveTextEditor } from "../util/get-active-text-editor";
import { getUniqueLogs } from "../svn/get-unique-logs";
import { createGutterImagePathHashMap } from "../decoration/create-gutter-image-path-hashmap";
import { setDecorationForLine } from "../decoration/set-decoration-for-line";
import { setBlamedFileDecorations } from "../storage/set-blamed-file-decorations";

export const showBlame = async (
  context: vscode.ExtensionContext,
  existingEditor?: vscode.TextEditor,
  existingFilePath?: string
) => {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  try {
    const editor = existingEditor || getActiveTextEditor();
    const filePath = existingFilePath || getFileNameFromEditor(editor);

    statusBarItem.show();
    setStatusBarText(statusBarItem, "Blaming file...", "loading~spin");
    const blameData = await blameFile(filePath);

    const uniqueRevisions = [
      ...new Set(blameData.map(({ revision }) => revision)),
    ];

    const gutterImagePathHashMap = await createGutterImagePathHashMap(
      uniqueRevisions
    );
    const logs = await getUniqueLogs(filePath, uniqueRevisions, statusBarItem);

    const lineData = blameData.map((blame) => {
      const metadata = mapBlameToDecorationData(
        blame,
        gutterImagePathHashMap[blame.revision],
        logs.find(({ revisionNumber }) => blame.revision === revisionNumber)
          ?.log
      );

      const decoration = setDecorationForLine(editor, metadata, "blame");

      return {
        decoration,
        metadata,
      };
    });

    statusBarItem.dispose();

    await setBlamedFileDecorations(context, filePath, {
      lines: lineData,
      logs,
    });
  } catch (err) {
    console.error("Failed to blame file", err);
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: Something went wrong`);
    statusBarItem.dispose();
  }
};
