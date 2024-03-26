import * as vscode from "vscode";
import { DecorationData } from "./map-blame-to-decoration-data";

export const createGutterDecoration = (
  decorationData: DecorationData,
  action: "blame" | "active_line"
) => {
  return vscode.window.createTextEditorDecorationType({
    after: {
      color: "rgba(153, 153, 153, 0.35)",
      contentText:
        action === "active_line" ? decorationData.afterMessage : undefined,
      margin: "0 0 0 3em",
      textDecoration: "none",
    },
    gutterIconPath: decorationData.gutterImagePath,
    gutterIconSize: "contain",
  });
};
