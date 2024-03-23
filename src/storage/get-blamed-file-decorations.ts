import * as vscode from "vscode";

export const getBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string
): Promise<vscode.TextEditorDecorationType[]> => {
  const decorations: vscode.TextEditorDecorationType[] | undefined =
    await context.workspaceState.get(storageKey);

  return decorations || [];
};
