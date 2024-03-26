import * as vscode from "vscode";
import { EXTENSION_CONFIGURATION } from "../const/extension";
import { gutterImageGenerator } from "../util/gutter-image-generator";

type GutterImagePathHashMap = {
  [key: string]: string | undefined;
};

export const createGutterImagePathHashMap = async (
  revisions: string[]
): Promise<GutterImagePathHashMap> => {
  const { enableVisualIndicators } = vscode.workspace.getConfiguration(
    `${EXTENSION_CONFIGURATION}.blame`
  );

  if (!enableVisualIndicators) {
    return {};
  }

  const generator = await gutterImageGenerator();

  return revisions.reduce<GutterImagePathHashMap>(
    (hashMap, revisionNumber: string) => {
      const existingValue = hashMap[revisionNumber];

      if (existingValue) {
        return hashMap;
      }

      return {
        ...hashMap,
        [revisionNumber]: generator?.next().value,
      };
    },
    {}
  );
};
