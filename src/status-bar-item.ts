import * as vscode from "vscode";
import { EXTENSION_NAME } from "./const/extension";

export class StatusBarItem {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      0
    );
  }

  setText(message: string, icon?: string) {
    const text = [icon ? `$(${icon})` : "", `${EXTENSION_NAME}:`, message];
    this.statusBarItem.text = text.filter(Boolean).join(" ");
  }

  show() {
    return this.statusBarItem.show();
  }

  hide() {
    return this.statusBarItem.hide();
  }
}
