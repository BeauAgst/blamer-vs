import * as vscode from "vscode";

export const clearBlamedFileDecorations = async (
  context: vscode.ExtensionContext
) => {
  const keys = await context.workspaceState.keys();

  await Promise.all(
    keys.map((key) => context.workspaceState.update(key, undefined))
  );
};
