import * as vscode from "vscode";
import { debounce } from "./util/debounce";
import { Storage } from "./storage";
import { SVN } from "./svn/svn";
import { Blamer } from "./blamer";
import { StatusBarItem } from "./status-bar-item";
import { DecorationManager } from "./decoration/decoration-manager";

export async function activate(context: vscode.ExtensionContext) {
  const statusBarItem = new StatusBarItem();
  const decorationManager = new DecorationManager();
  const storage = new Storage(context);
  const svn = new SVN(statusBarItem);
  const blamer = new Blamer(storage, svn, statusBarItem, decorationManager);

  await blamer.clearRecordsForAllFiles();

  let clear = vscode.commands.registerCommand("blamer-vs.clearBlame", () =>
    blamer.clearBlameForActiveTextEditor()
  );

  let show = vscode.commands.registerCommand("blamer-vs.showBlame", () =>
    blamer.showBlameForActiveTextEditor()
  );

  let toggle = vscode.commands.registerCommand("blamer-vs.toggleBlame", () =>
    blamer.toggleBlameForActiveTextEditor()
  );

  let autoBlame = vscode.window.onDidChangeActiveTextEditor((textEditor) =>
    blamer.autoBlame(textEditor)
  );

  let clearOnClose = vscode.workspace.onDidCloseTextDocument(({ fileName }) =>
    blamer.clearRecordsForFile(fileName)
  );

  let trackLine = vscode.window.onDidChangeTextEditorSelection(
    debounce((event) => blamer.trackLine(event))
  );

  context.subscriptions.push(clear);
  context.subscriptions.push(show);
  context.subscriptions.push(toggle);
  context.subscriptions.push(trackLine);
  context.subscriptions.push(clearOnClose);
  context.subscriptions.push(autoBlame);
}

export function deactivate() {}
