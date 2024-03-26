import * as vscode from "vscode";
import { FileData } from "./set-blamed-file-decorations";

export const getBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string
): Promise<FileData | undefined> => {
  const fileData: FileData | undefined = await context.workspaceState.get(
    storageKey
  );

  return fileData;
};
