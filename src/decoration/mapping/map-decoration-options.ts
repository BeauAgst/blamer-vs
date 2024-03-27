import * as vscode from "vscode";
import { EXTENSION_CONFIGURATION } from "../../const/extension";
import { DecorationData } from "../../types/decoration-data.model";

export const mapDecorationOptions = (decorationData: DecorationData) => {
  const { enableLogs } = vscode.workspace.getConfiguration(
    EXTENSION_CONFIGURATION
  );

  const lineNumber = Number(decorationData.line) - 1;

  return [
    {
      hoverMessage: enableLogs
        ? new vscode.MarkdownString(decorationData.hoverMessage)
        : undefined,
      range: new vscode.Range(lineNumber, 0, lineNumber, 1000),
    },
  ];
};
