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
  const parts = path.split("_");

  if (parts.length < 5 || parts.length > 6) {
    // Unknown format
    console.warn(`Unknown format for path: ${path}`);
    return path;
  }

  const date = parts[0];
  const dateParts = date.split("-");

  const dateObj = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2] || "1"),
  );

  const artist = parts[1];

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
  if (parts.length === 5) {
    const venue = parts.at(2);
    const city = parts.at(3);

    return `${formattedDate} - ${artist} @ ${venue}, ${city}`;
  } else if (parts.length === 6) {
    const festName = parts.at(2);
    const venue = parts.at(3);
    const city = parts.at(4);

    return `${formattedDate} - ${artist} @ ${festName} - ${venue}, ${city}`;
  }

  // Unknown format
  return path;
};
