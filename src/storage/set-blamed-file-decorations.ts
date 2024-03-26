import * as vscode from "vscode";
import { DecorationData } from "../decoration/map-revision-log-to-decoration-data";

export const setBlamedFileDecorations = async (
  context: vscode.ExtensionContext,
  storageKey: string,
  decorations?: {
    decorationData: DecorationData;
    decoration: vscode.TextEditorDecorationType;
  }[]
) => context.workspaceState.update(storageKey, decorations);
