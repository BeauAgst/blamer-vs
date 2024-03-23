import * as vscode from "vscode";
import { DecorationData } from "./map-revision-log-to-decoration-data";

export const mapDecorationOptions = (
  decorationData: DecorationData
): vscode.DecorationOptions[] =>
  decorationData.lines.map((line) => ({
    hoverMessage: decorationData.message
      ? new vscode.MarkdownString(decorationData.message)
      : undefined,
    range: new vscode.Range(line, 0, line, 1000),
  }));
