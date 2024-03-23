export type RevisionLog = {
  author?: string;
  date?: string;
  message?: string;
  number?: string;
};

const matchers = {
  author: /<author>([^<]*)<\/author>/,
  date: /<date>([^<]*)<\/date>/,
  message: /<msg>([^<]*)<\/msg>/,
  number: /revision="(.*)">/,
};

export const mapDataToRevisionLog = (data: string): RevisionLog => {
  return {
    author: data.match(matchers.author)?.[1],
    date: data.match(matchers.date)?.[1],
    message: data.match(matchers.message)?.[1],
    number: data.match(matchers.number)?.[1],
  };
};
