import * as vscode from "vscode";
import { DecorationData } from "./decoration-data.model";

export type DecorationRecord = {
  [key: string]: {
    decoration: vscode.TextEditorDecorationType;
    metadata: DecorationData;
  };
};
