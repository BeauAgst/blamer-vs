import { spawnProcess } from "../util/spawn-process";
import {
  GroupedBlameDataByRevision,
  mapBlameOutputToBlameData,
} from "./map-blame-output-to-blame-data";

export const blameFile = async (
  filePath: string
): Promise<GroupedBlameDataByRevision> => {
  const data = await spawnProcess(
    `svn blame --xml -x "-w --ignore-eol-style" "${filePath}"`
  );

  return mapBlameOutputToBlameData(data);
};
