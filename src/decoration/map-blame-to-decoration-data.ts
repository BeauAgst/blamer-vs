import { BlameData } from "../svn/map-blame-output-to-blame-data";
import { formatHoverMessage } from "./format-hover-message";
import { formatLineMessage } from "./format-line-message";

export type DecorationData = {
  afterMessage?: string;
  gutterImagePath?: string;
  hoverMessage?: string;
  line: string;
};

export const mapBlameToDecorationData = (
  blameData: BlameData,
  gutterImagePath?: string,
  revisionLog?: string
): DecorationData => {
  return {
    afterMessage: formatLineMessage(blameData),
    gutterImagePath,
    hoverMessage: formatHoverMessage(blameData, revisionLog),
    line: blameData.line,
  };
};
