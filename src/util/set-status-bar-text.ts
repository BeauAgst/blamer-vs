import * as vscode from "vscode";
import { EXTENSION_NAME } from "../const/extension";

export const setStatusBarText = (
  statusBarItem: vscode.StatusBarItem,
  message: string,
  icon?: string
) => {
  const text = [icon ? `$(${icon})` : "", `${EXTENSION_NAME}:`, message];
  statusBarItem.text = text.filter(Boolean).join(" ");
};
