export function parseINIString(data: string): Record<string, any> {
  const regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*;.*$/,
  };

  const value: Record<string, any> = {};
  const lines = data.split(/[\r\n]+/);
  let section: string | null = null;

  lines.forEach((line) => {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      const match = line.match(regex.param);
      if (match) {
        if (section) {
          value[section][match[1]] = match[2];
        } else {
          value[match[1]] = match[2];
        }
      }
    } else if (regex.section.test(line)) {
      const match = line.match(regex.section);
      if (match) {
        value[match[1]] = {};
        section = match[1];
      }
    } else if (line.length === 0 && section) {
      section = null;
    }
  });

  return value;
}
