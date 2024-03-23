import * as vscode from "vscode";

export const setBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string,
  decorations?: vscode.TextEditorDecorationType[]
) => context.workspaceState.update(storageKey, decorations);
