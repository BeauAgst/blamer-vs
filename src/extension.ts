import { ExtensionContext, commands, window, workspace } from "vscode";
import { debounce } from "./util/debounce";
import { Storage } from "./storage";
import { SVN } from "./svn";
import { Blamer } from "./blamer";
import { DecorationManager } from "./decoration-manager";
import { EXTENSION_NAME } from "./const/extension";

export async function activate(context: ExtensionContext) {
  const logger = window.createOutputChannel(EXTENSION_NAME, {
    log: true,
  });
  const decorationManager = new DecorationManager();
  const storage = new Storage(context);
  const svn = new SVN(logger);
  const blamer = new Blamer(logger, storage, svn, decorationManager);

  logger.clear();
  await blamer.clearRecordsForAllFiles();

  logger.info("Blamer initialised");

  let clear = commands.registerCommand("blamer-vs.clearBlame", () =>
    blamer.clearBlameForActiveTextEditor()
  );

  let show = commands.registerCommand("blamer-vs.showBlame", () =>
    blamer.showBlameForActiveTextEditor()
  );

  let toggle = commands.registerCommand("blamer-vs.toggleBlame", () =>
    blamer.toggleBlameForActiveTextEditor()
  );

  let autoBlame = window.onDidChangeActiveTextEditor((textEditor) =>
    blamer.autoBlame(textEditor)
  );

  let clearOnClose = workspace.onDidCloseTextDocument((textDocument) =>
    blamer.handleClosedDocument(textDocument)
  );

  let trackLine = window.onDidChangeTextEditorSelection(
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
