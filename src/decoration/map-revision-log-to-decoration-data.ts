import { GroupedBlameData } from "../svn/map-blame-output-to-blame-data";
import { formatHoverMessage } from "./format-hover-message";
import { formatLineMessage } from "./format-line-message";

export type DecorationData = {
  afterMessage?: string;
  gutterImagePath?: string;
  hoverMessage?: string;
  lines: string[];
};

export const mapRevisionLogToDecorationData = (
  blameData: GroupedBlameData,
  gutterImagePath?: string,
  revisionLog?: string
): DecorationData => {
  return {
    afterMessage: formatLineMessage(blameData),
    gutterImagePath,
    hoverMessage: formatHoverMessage(blameData, revisionLog),
    lines: blameData.lines,
  };
};
