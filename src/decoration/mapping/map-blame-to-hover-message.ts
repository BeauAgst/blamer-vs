import { DateTime } from "luxon";
import { Blame } from "../../types/blame.model";

export const mapBlameToHoverMessage = (blame: Blame, revisionLog?: string) => {
  const { author, date, revision } = blame;

  return [
    `${revision}: ${author}`,
    date && DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL),
    revisionLog,
  ]
    .filter(Boolean)
    .join("\n\n");
};
