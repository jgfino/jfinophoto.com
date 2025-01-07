import { drive_v3, google } from "googleapis";
<<<<<<< Updated upstream
import credentials from "../../../credentials.json";
=======
>>>>>>> Stashed changes
import { Enums } from "../../../supabase/database.types";

const CONCERT_FOLDER = process.env.DRIVE_CONCERT_FOLDER!;
const FESTIVAL_FOLDER = process.env.DRIVE_FESTIVAL_FOLDER!;
const PORTRAIT_FOLDER = process.env.DRIVE_PORTRAIT_FOLDER!;

const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

const auth = new google.auth.JWT(
<<<<<<< Updated upstream
  credentials.client_email,
  undefined,
  credentials.private_key,
=======
  process.env.GOOGLE_CLIENT_EMAIL!,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
>>>>>>> Stashed changes
  scopes,
);

const drive = google.drive({ version: "v3", auth });

/**
 * Get all the folders within the given folders (1 level deep)
 *
 * @param folderIds The IDs of the folders to get the folders within
 */
const getSubfolders = async (
  folderIds: string[],
): Promise<drive_v3.Schema$File[]> => {
  let nextPageToken: string | undefined | null;

  const folders: drive_v3.Schema$File[] = [];

  do {
    const folderQuery = `(${
      folderIds.map((f) => `'${f}' in parents`).join(" or ")
    }) and mimeType='application/vnd.google-apps.folder'`;

    const folderFields = [
      "files/id",
      "files/name",
      "files/parents",
      "nextPageToken",
    ];

    const res = (
      await drive.files.list({
        fields: folderFields.join(","),
        q: folderQuery,
        pageSize: 1000,
        pageToken: nextPageToken || undefined,
        orderBy: "name desc",
      })
    ).data as drive_v3.Schema$FileList;

    if (res.files) {
      folders.push(...res.files);
    }

    nextPageToken = res.nextPageToken;
  } while (nextPageToken);

  return folders;
};

/**
 * Get all the photos in Google Drive for a given page type
 *
 * @param type The type of photos to get
 */
export const getDrivePhotos = async (
  type: Enums<"photo_page">,
) => {
  console.log(`Getting Google Drive photos for ${type} page`);

  const startFolder = type === "live"
    ? CONCERT_FOLDER
    : type === "festival"
    ? FESTIVAL_FOLDER
    : type === "portrait"
    ? PORTRAIT_FOLDER!
    : null;

  if (!startFolder) {
    throw new Error(`Invalid page type: ${type}`);
  }

  const levels: Record<string, drive_v3.Schema$File[]> = {};

  let i = 0;
  let currentFolders = [startFolder];

  while (true) {
    const res = await getSubfolders(currentFolders);

    if (res.length === 0) {
      break;
    }

    levels[i] = res;
    i++;
    currentFolders = res.map((f) => f.id!);
  }

  // Now, make a neat map of the folders with lowest level ID (contains the photos) and an array of parent folders names
  const foldersMap: Record<string, drive_v3.Schema$File[]> = {};

  if (Object.keys(levels).length === 0) {
    return [];
  }

  const lowestLevel = Object.keys(levels)[Object.keys(levels).length - 1];

  for (const artist of levels[lowestLevel]) {
    const parents = [artist];
    let currentParent = artist;
    for (let i = Number(lowestLevel) - 1; i >= 0; i--) {
      const parent = levels[i].find((f) =>
        currentParent.parents?.includes(f.id!)
      );

      if (!parent) {
        throw new Error(
          "Parent not found - Drive folder structure is incorrect",
        );
      }

      currentParent = parent;
      parents.push(parent);
    }

    foldersMap[artist.id!] = parents;
  }

  // Now, query the photos in all the folders
  const photoQuery = `(${
    (Object.keys(foldersMap)).map((f) => `'${f}' in parents`).join(
      " or ",
    )
  }) and mimeType='image/jpeg'`;

  const photoFields = [
    "files/mimeType",
    "files/name",
    "files/id",
    "files/parents",
    "files/thumbnailLink",
    "files/imageMediaMetadata",
    "nextPageToken",
  ];

  const photos = [];

  let nextPageToken: string | undefined | null;

  do {
    const res = (
      await drive.files.list({
        fields: photoFields.join(","),
        q: photoQuery,
        pageSize: 1000,
        orderBy: "createdTime desc",
        pageToken: nextPageToken || undefined,
      })
    ).data as drive_v3.Schema$FileList;

    nextPageToken = res.nextPageToken;

    const resFiles = res.files || [];

    // Get the parent folder paths for each photo
    const photoMap: Record<string, string[]> = {};

    for (const p of resFiles) {
      photoMap[p.id!] = foldersMap[p.parents![0]].map((f) => f.name!);
    }

    const mappedPhotos = resFiles.map((p) => ({
      id: p.id!,
      name: p.name!,
      thumbnailLink: p.thumbnailLink!.replace("=s220", ""),
      parentFolderId: p.parents![0],
      width: p.imageMediaMetadata?.width || 0,
      height: p.imageMediaMetadata?.height || 0,
      path: photoMap[p.id!],
    }));

    photos.push(...mappedPhotos);
  } while (nextPageToken);

  console.log(`Found ${photos.length} photos for ${type} page`);

  return photos;
};

export type DrivePhoto = Awaited<
  ReturnType<typeof getDrivePhotos>
>[number];
