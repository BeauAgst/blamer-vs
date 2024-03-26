import { spawnProcess } from "../util/spawn-process";
import {
  BlameData,
  mapBlameOutputToBlameData,
} from "./map-blame-output-to-blame-data";

export const blameFile = async (filePath: string): Promise<BlameData[]> => {
  const data = await spawnProcess(
    `svn blame --xml -x "-w --ignore-eol-style" "${filePath}"`
  );

  return mapBlameOutputToBlameData(data);
};
