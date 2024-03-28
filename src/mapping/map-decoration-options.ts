import { DecorationData } from "../types/decoration-data.model";
import { MAX_NUMBER } from "../const/number";
import { MarkdownString, Range } from "vscode";

export const mapDecorationOptions = (decorationData: DecorationData) => {
  const lineNumber = Number(decorationData.line) - 1;

  return [
    {
      hoverMessage: new MarkdownString(decorationData.hoverMessage),
      range: new Range(lineNumber, MAX_NUMBER, lineNumber, MAX_NUMBER),
    },
  ];
};
