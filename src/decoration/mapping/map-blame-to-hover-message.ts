import { DateTime } from "luxon";
import { Blame } from "../../types/blame.model";

export const mapBlameToHoverMessage = (blame: Blame, log?: string) => {
  const { author, date, revision } = blame;

  const authorText = author ? `**${author}**,` : "";

  const revisionDateRelative = date
    ? DateTime.fromISO(date).toRelative({
        round: true,
      })
    : "";

  const revisionDate = date
    ? `_(${DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED)})_`
    : "";

  const revisionNumber = revision ? `#${revision}` : "";

  const rows = [
    [authorText, revisionDateRelative, revisionDate],
    [revisionNumber],
    ["<ul><li>test</li></ul>"],
    [log],
  ];

  return rows.map((row) => row.filter(Boolean).join(" ")).join("\n\n");
};
