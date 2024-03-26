import * as vscode from "vscode";
import { DecorationData } from "../decoration/map-revision-log-to-decoration-data";

type FileDecorations = {
  decorationData: DecorationData;
  decoration: vscode.TextEditorDecorationType;
};

export const getBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string
): Promise<FileDecorations[]> => {
  const decorations: FileDecorations[] | undefined =
    await context.workspaceState.get(storageKey);

  return decorations || [];
};
