import * as vscode from "vscode";
import { DecorationData } from "../decoration/map-blame-to-decoration-data";
import { UniqueLog } from "../svn/get-unique-logs";

export type FileData = {
  lines: {
    decoration: vscode.TextEditorDecorationType;
    metadata: DecorationData;
  }[];
  logs: UniqueLog[];
};

export const setBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string,
  fileData?: FileData
) => context.workspaceState.update(storageKey, fileData);
