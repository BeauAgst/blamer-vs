import * as vscode from "vscode";
import { spawnProcess } from "../util/spawn-process";
import { mapBlameOutputToBlameModel } from "./mapping/map-blame-output-to-blame-model";
import { mapLogOutputToMessage } from "./mapping/map-log-output-to-message";
import { EXTENSION_CONFIGURATION } from "../const/extension";
import { StatusBarItem } from "../status-bar-item";
import { Blame } from "../types/blame.model";
import { Log } from "../types/log.model";

export class SVN {
  constructor(private statusBarItem: StatusBarItem) {}
  async blameFile(fileName: string): Promise<Blame[]> {
    const data = await spawnProcess(
      `svn blame --xml -x "-w --ignore-eol-style" "${fileName}"`
    );

    return mapBlameOutputToBlameModel(data);
  }

  async getLogForRevision(fileName: string, revision: string) {
    const data = await spawnProcess(
      `svn log --xml -r ${revision} "${fileName}"`
    );

    return mapLogOutputToMessage(data);
  }

  async getLogsForRevisions(
    fileName: string,
    revisions: string[]
  ): Promise<Log[]> {
    const { enableLogs } = vscode.workspace.getConfiguration(
      EXTENSION_CONFIGURATION
    );

    if (!enableLogs) {
      return [];
    }

    this.statusBarItem.show();
    this.statusBarItem.setText("Fetching logs...", "loading~spin");

    return await Promise.all(
      revisions.map(async (revision) => {
        const log = await this.getLogForRevision(fileName, revision);
        return { log, revision };
      })
    );
  }
}
