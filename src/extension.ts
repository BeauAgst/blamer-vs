import * as vscode from "vscode";
import { showBlame } from "./blame/show-blame";
import { clearBlame } from "./blame/clear-blame";
import { toggleBlame } from "./blame/toggle-blame";
import { setBlamedFileDecorations } from "./storage/set-blamed-file-decorations";
import { clearBlamedFileDecorations } from "./storage/clear-blamed-file-decorations";
import { debounce } from "./util/debounce";
import { autoBlame } from "./blame/auto-blame";

export async function activate(context: vscode.ExtensionContext) {
  await clearBlamedFileDecorations(context);

  let clear = vscode.commands.registerCommand("blamer-vs.clearBlame", () =>
    clearBlame(context)
  );

  let show = vscode.commands.registerCommand("blamer-vs.showBlame", () =>
    showBlame(context)
  );

  let toggle = vscode.commands.registerCommand("blamer-vs.toggleBlame", () =>
    toggleBlame(context)
  );

  let onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(
    (e) => autoBlame(context, e)
  );

  context.subscriptions.push(clear);
  context.subscriptions.push(show);
  context.subscriptions.push(toggle);
  context.subscriptions.push(onDidChangeActiveTextEditor);

  vscode.workspace.onDidCloseTextDocument(({ fileName }) =>
    setBlamedFileDecorations(context, fileName)
  );
}

export function deactivate() {}
