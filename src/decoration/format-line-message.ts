import { DateTime } from "luxon";
import { GroupedBlameData } from "../svn/map-blame-output-to-blame-data";

export const formatLineMessage = (blameData: GroupedBlameData): string => {
  const { author, date } = blameData;

  const timeRelative =
    date &&
    DateTime.fromISO(date).toRelative({
      round: true,
    });

  return [author, timeRelative].filter(Boolean).join(", ");
};
