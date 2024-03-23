import * as vscode from "vscode";

export const clearBlame = (decorations: vscode.TextEditorDecorationType[]) => {
  decorations.map((decoration) => decoration.dispose());
  return [];
};
