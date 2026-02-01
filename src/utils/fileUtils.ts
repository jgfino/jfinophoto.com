export function shuffleArray<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export const formatFilename = (path: string, full = false) => {
  const baseName = path.replace(/\.[^.]+$/, "");
  const parts = baseName.split("_");
  const normalizedParts = [...parts];
  const lastPart = normalizedParts.at(-1);

  if (lastPart) {
    const match = lastPart.match(/^(.*)-(\d+)$/);
    if (match && match[1]) {
      normalizedParts[normalizedParts.length - 1] = match[1];
      normalizedParts.push(match[2]);
    }
  }

  if (normalizedParts.length < 5 || normalizedParts.length > 6) {
    // Unknown format
    console.warn(`Unknown format for path: ${path}`);
    return path;
  }

  const date = normalizedParts[0];
  const dateParts = date.split("-");

  const dateObj = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2] || "1"),
  );

  const artist = normalizedParts[1];

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: dateParts.length > 2 ? "numeric" : undefined,
    year: "numeric",
  });

  const year = date.split("-")[0];

  if (!full) {
    return `${artist} (${year})`;
  }

  // Concert
  if (normalizedParts.length === 5) {
    const venue = normalizedParts.at(2);
    const city = normalizedParts.at(3);

    return `${formattedDate} - ${artist} @ ${venue}, ${city}`;
  } else if (normalizedParts.length === 6) {
    const festName = normalizedParts.at(2);
    const venue = normalizedParts.at(3);
    const city = normalizedParts.at(4);

    return `${formattedDate} - ${artist} @ ${festName} - ${venue}, ${city}`;
  }

  // Unknown format
  return path;
};
