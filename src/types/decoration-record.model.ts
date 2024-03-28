import { TextEditorDecorationType } from "vscode";
import { DecorationData } from "./decoration-data.model";

export type DecorationRecord = {
  [key: string]: {
    decoration: TextEditorDecorationType;
    metadata: DecorationData;
  };
};
