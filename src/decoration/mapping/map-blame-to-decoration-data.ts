import { Blame } from "../../types/blame.model";
import { DecorationData } from "../../types/decoration-data.model";
import { mapBlameToHoverMessage } from "./map-blame-to-hover-message";
import { mapBlameToInlineMessage } from "./map-blame-to-inline-message";

export const mapBlameToDecorationData = (
  blame: Blame,
  gutterImagePath?: string,
  revisionLog?: string
): DecorationData => {
  return {
    afterMessage: mapBlameToInlineMessage(blame),
    gutterImagePath,
    hoverMessage: mapBlameToHoverMessage(blame, revisionLog),
    line: blame.line,
  };
};
