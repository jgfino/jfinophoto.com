import { drive_v3, google } from "googleapis";
import { Enums, TablesInsert } from "../../../supabase/database.types";

const CONCERT_FOLDER = process.env.DRIVE_CONCERT_FOLDER!;
const FESTIVAL_FOLDER = process.env.DRIVE_FESTIVAL_FOLDER!;
const PORTRAIT_FOLDER = process.env.DRIVE_PORTRAIT_FOLDER!;

const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL!,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
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
 * @param type The type of photos to get
 * @returns The photos for the page
 */
export const getDrivePhotos = async (type: Enums<"photo_type">) => {
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

  console.log(`Getting ALL Google Drive photos for ${type} page`);

  return getDrivePhotosFromFolders(type, [startFolder]);
};

/**
 * Get all the photos in Google Drive for a given page type and update the cache.
 * Optionally restrict to given parent folders.
 *
 * @param type The type of photos to get
 * @param parentFolderIds The IDs of the parent folders to get the photos from
 */
export const getDrivePhotosFromFolders = async (
  type: Enums<"photo_type">,
  parentFolderIds: string[],
) => {
  if (parentFolderIds.length === 0) {
    console.log(`No parent folders given`);
    return [];
  }

  const levels: Record<string, drive_v3.Schema$File[]> = {};

  let i = 0;
  let currentFolders = [...parentFolderIds];

  while (true && currentFolders.length > 0) {
    const res = await getSubfolders(currentFolders);

    if (res.length === 0) {
      break;
    }

    levels[i] = res;
    i++;
    currentFolders = res.map((f) => f.id!);
  }

  console.log(
    `Getting Google Drive photos in ${currentFolders.length} folders`,
  );

  // Now, query the photos in all the folders
  const photoQuery = `(${
    currentFolders.map((f) => `'${f}' in parents`).join(
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
    "files/createdTime",
    "nextPageToken",
  ];

  const photos: TablesInsert<"drive_cache">[] = [];

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

    const mappedPhotos: TablesInsert<"drive_cache">[] = resFiles.map((p) => ({
      drive_id: p.id!,
      name: p.name!,
      page: type,
      thumbnail_link: p.thumbnailLink!.replace("=s220", ""),
      parent_folder_id: p.parents![0],
      width: p.imageMediaMetadata?.width || 0,
      height: p.imageMediaMetadata?.height || 0,
      drive_created_at: p.createdTime!,
      image_metadata: p.imageMediaMetadata || {},
    }));

    photos.push(...mappedPhotos);
  } while (nextPageToken);

  console.log(`Found ${photos.length} photos for ${type} page`);

  return photos;
};
