import { DateTime } from "luxon";
import { BlameData } from "../svn/map-blame-output-to-blame-data";

export const formatHoverMessage = (
  blameData: BlameData,
  revisionLog?: string
) => {
  const { author, date, revision } = blameData;

  return (
    revisionLog &&
    [
      `${revision}: ${author}`,
      date && DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL),
      revisionLog,
    ]
      .filter(Boolean)
      .join("\n\n")
  );
};
