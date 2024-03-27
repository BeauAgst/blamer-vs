import { DateTime } from "luxon";
import { Blame } from "../../types/blame.model";

export const mapBlameToInlineMessage = (blame: Blame): string => {
  const { author, date, revision } = blame;

  const timeRelative =
    date &&
    DateTime.fromISO(date).toRelative({
      round: true,
    });

  const authorAndTime = [author, timeRelative].filter(Boolean).join(", ");
  const formattedRevision = `(#${revision})`;

  return [authorAndTime, formattedRevision].join(" • ");
};
