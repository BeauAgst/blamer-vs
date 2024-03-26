import * as vscode from "vscode";
import { EXTENSION_CONFIGURATION } from "../const/extension";
import { getLogForRevision } from "./get-log-for-revision";
import { setStatusBarText } from "../util/set-status-bar-text";

export type UniqueLog = {
  log?: string;
  revisionNumber: string;
};

export const getUniqueLogs = async (
  filePath: string,
  revisions: string[],
  statusBarItem: vscode.StatusBarItem
): Promise<UniqueLog[]> => {
  const { enableLogs } = vscode.workspace.getConfiguration(
    `${EXTENSION_CONFIGURATION}.blame`
  );

  if (!enableLogs) {
    return [];
  }

  setStatusBarText(statusBarItem, "Fetching logs...", "loading~spin");

  return await Promise.all(
    revisions.map(async (revisionNumber) => {
      const log = await getLogForRevision(filePath, revisionNumber);
      return { log, revisionNumber };
    })
  );
};
