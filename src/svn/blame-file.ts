import { spawnProcess } from "../util/spawn-process";

export const blameFile = async (filePath: string): Promise<string[]> => {
  const data = await spawnProcess(
    `svn blame -x "-w --ignore-eol-style" "${filePath}"`
  );
  return data.split("\n");
};
