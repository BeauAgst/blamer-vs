import * as vscode from "vscode";
import { showBlame } from "./show-blame";
import { clearBlame } from "./clear-blame";

export function activate(context: vscode.ExtensionContext) {
  let decorations: vscode.TextEditorDecorationType[] = [];

  let show = vscode.commands.registerCommand(
    "blamer-vs.showBlame",
    async () => {
      decorations = await showBlame(decorations);
    }
  );

  let clear = vscode.commands.registerCommand("blamer-vs.clearBlame", () => {
    decorations = clearBlame(decorations);
  });

  context.subscriptions.push(show);
  context.subscriptions.push(clear);
}

export function deactivate() {}
