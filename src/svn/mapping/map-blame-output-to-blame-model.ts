import { ElementCompact, xml2js } from "xml-js";
import { Blame } from "../../types/blame.model";

export const mapBlameOutputToBlameModel = (data: string): Blame[] => {
  const json: ElementCompact = xml2js(data, {
    attributesKey: "attributes",
    compact: true,
    textKey: "text",
    trim: true,
  });

  const blamed: Blame[] = json?.blame?.target.entry?.map((entry: any) => ({
    author: entry?.commit?.author?.text,
    date: entry?.commit?.date?.text,
    line: entry?.attributes?.["line-number"],
    revision: entry?.commit?.attributes?.revision,
  }));

  return blamed.filter(({ revision }) => revision);
};
