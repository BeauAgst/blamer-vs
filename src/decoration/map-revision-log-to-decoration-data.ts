import { RevisionLog } from "../svn/map-data-to-revision-log";
import { formatDate } from "./format-date";

export type DecorationData = {
  gutterImagePath?: string;
  lines: number[];
  message?: string;
};

export const mapRevisionLogToDecorationData = (
  lines: number[],
  gutterImagePath?: string,
  revisionLog?: RevisionLog
): DecorationData => {
  return {
    gutterImagePath,
    lines,
    message:
      revisionLog &&
      [
        `${revisionLog?.number}: ${revisionLog?.author}`,
        formatDate(revisionLog?.date),
        revisionLog?.message,
      ]
        .filter(Boolean)
        .join("\n\n"),
  };
};
