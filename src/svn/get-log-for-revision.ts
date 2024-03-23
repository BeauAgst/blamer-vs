import { mapLogOutputToMessage } from "./map-log-output-to-message";
import { spawnProcess } from "../util/spawn-process";

export const getLogForRevision = async (
  filePath: string,
  revisionNumber: string
) => {
  const data = await spawnProcess(
    `svn log --xml -r ${revisionNumber} "${filePath}"`
  );
  return mapLogOutputToMessage(data);
};
