import { RevisionLog, mapDataToRevisionLog } from "./map-data-to-revision-log";
import { spawnProcess } from "../util/spawn-process";

export const getLogForRevision = async (
  filePath: string,
  revisionNumber: string
): Promise<RevisionLog> => {
  const data = await spawnProcess(
    `svn log -r ${revisionNumber} "${filePath}" --xml`
  );
  return mapDataToRevisionLog(data);
};
