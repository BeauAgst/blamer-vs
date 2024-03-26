import { ElementCompact, xml2js } from "xml-js";

export type BlameData = {
  author?: string;
  date?: string;
  line: string;
  revision: string;
};

export const mapBlameOutputToBlameData = (data: string): BlameData[] => {
  const json: ElementCompact = xml2js(data, {
    attributesKey: "attributes",
    compact: true,
    textKey: "text",
    trim: true,
  });

  const blamed: BlameData[] = json?.blame?.target.entry?.map((entry: any) => ({
    author: entry?.commit?.author?.text,
    date: entry?.commit?.date?.text,
    line: entry?.attributes?.["line-number"],
    revision: entry?.commit?.attributes?.revision,
  }));

  return blamed.filter(({ revision }) => revision);
};
