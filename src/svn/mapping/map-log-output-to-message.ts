import { ElementCompact, xml2js } from "xml-js";

export const mapLogOutputToMessage = (data: string): string | undefined => {
  const json: ElementCompact = xml2js(data, {
    attributesKey: "attributes",
    compact: true,
    textKey: "text",
    trim: true,
  });

  return json?.log?.logentry?.msg?.text;
};
