import * as vscode from "vscode";
import { DecorationData } from "./map-revision-log-to-decoration-data";

export const createGutterDecoration = (decorationData: DecorationData) =>
  vscode.window.createTextEditorDecorationType({
    after: {
      color: "rgba(153, 153, 153, 0.35)",
      // contentText: decorationData.afterMessage,
      margin: "0 0 0 3em",
      textDecoration: "none",
    },
    gutterIconPath: decorationData.gutterImagePath,
    gutterIconSize: "contain",
  });
