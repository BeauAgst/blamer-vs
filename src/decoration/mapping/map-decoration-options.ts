import * as vscode from "vscode";
import { DecorationData } from "../../types/decoration-data.model";
import { MAX_NUMBER } from "../../const/number";

export const mapDecorationOptions = (decorationData: DecorationData) => {
  const lineNumber = Number(decorationData.line) - 1;

  return [
    {
      hoverMessage: new vscode.MarkdownString(decorationData.hoverMessage),
      range: new vscode.Range(lineNumber, MAX_NUMBER, lineNumber, MAX_NUMBER),
    },
  ];
};
