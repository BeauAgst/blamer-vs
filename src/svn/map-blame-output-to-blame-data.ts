import { ElementCompact, xml2js } from "xml-js";

type BlameData = {
  author?: string;
  date?: string;
  line: string;
  revision?: string;
};

export type GroupedBlameData = {
  author?: string;
  date?: string;
  lines: string[];
  revision?: string;
};

export type GroupedBlameDataByRevision = {
  [key: string]: GroupedBlameData;
};

export const mapBlameOutputToBlameData = (
  data: string
): GroupedBlameDataByRevision => {
  const json: ElementCompact = xml2js(data, {
    attributesKey: "attributes",
    compact: true,
    textKey: "text",
    trim: true,
  });

  const blameEntries = json?.blame?.target.entry;

  const mappedData: BlameData[] = blameEntries?.map((entry: any) => ({
    author: entry?.commit?.author?.text,
    date: entry?.commit?.date?.text,
    line: entry?.attributes?.["line-number"],
    revision: entry?.commit?.attributes?.revision,
  }));

  return mappedData.reduce<GroupedBlameDataByRevision>(
    (groupedBlames, entry: BlameData) => {
      const { author, date, line, revision } = entry;

      if (revision && revision !== "-") {
        const existingRevisionData = groupedBlames[revision];

        if (existingRevisionData) {
          groupedBlames[revision] = {
            ...existingRevisionData,
            lines: [...existingRevisionData.lines, line],
          };
        } else {
          groupedBlames[revision] = {
            author,
            date,
            lines: [line],
            revision,
          };
        }
      }

      return groupedBlames;
    },
    {}
  );
};
