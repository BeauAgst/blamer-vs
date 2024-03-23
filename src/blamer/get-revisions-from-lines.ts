export type LinesByRevision = { [key: string]: number[] };

export const getRevisionsFromLines = (lines: string[]): LinesByRevision =>
  lines.reduce<LinesByRevision>((revisionMap, line, index) => {
    const revision = line.trim().split(" ")?.[0];

    if (revision && revision !== "-") {
      revisionMap[revision] = revisionMap[revision]
        ? [...revisionMap[revision], index]
        : [index];
    }

    return revisionMap;
  }, {});
