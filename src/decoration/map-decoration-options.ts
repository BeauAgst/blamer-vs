import * as vscode from "vscode";
import { DecorationData } from "./map-revision-log-to-decoration-data";

export const mapDecorationOptions = (
  decorationData: DecorationData
): vscode.DecorationOptions[] =>
  decorationData.lines.map((line) => {
    const lineNumber = Number(line) - 1;
    return {
      hoverMessage: decorationData.hoverMessage
        ? new vscode.MarkdownString(decorationData.hoverMessage)
        : undefined,
      range: new vscode.Range(lineNumber, 0, lineNumber, 1000),
    };
  });
