import { drive_v3, google } from "googleapis";
import credentials from "../../../credentials.json";
import { Enums, Tables } from "../../../supabase/database.types";
import { cache } from "react";

const CONCERT_FOLDER = process.env.DRIVE_CONCERT_FOLDER!;
const FESTIVAL_FOLDER = process.env.DRIVE_FESTIVAL_FOLDER!;
const PORTRAIT_FOLDER = process.env.DRIVE_PORTRAIT_FOLDER!;

const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

const auth = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
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
 * @param limit The number of photos to get
 * @param pageToken The page token for pagination
 * @param folders The folder map cache to prevent redundant API calls
 */
export const getDrivePhotos = cache(async (
  type: Enums<"photo_page">,
  limit: number,
  pageToken: string | undefined,
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

  const res = (
    await drive.files.list({
      fields: photoFields.join(","),
      q: photoQuery,
      pageSize: limit,
      orderBy: "createdTime desc",
      pageToken: pageToken,
    })
  ).data as drive_v3.Schema$FileList;

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

  return {
    photos,
    nextPageToken: res.nextPageToken,
  };
});

export type DrivePhoto = Awaited<
  ReturnType<typeof getDrivePhotos>
>["photos"][0];

/**
 * Get updated thumbnail links for the given photos. Will also get updated links for photos
 * in the same folders as the given photos
 * @param photos: The photos to update
 */
export const getUpdatedThumbnailLinks = async (photos: Tables<"photos">[]) => {
  console.log(`Updating thumbnail links for ${photos.length} photos`);

  const photoQuery = `(${
    photos.map((p) => `'${p.parent_folder_id}' in parents`).join(
      " or ",
    )
  }) and mimeType='image/jpeg'`;

  const photoFields = "files/id,files/thumbnailLink,nextPageToken";

  let nextPageToken: string | undefined | null;
  const updatedLinks: Record<string, string> = {};

  do {
    const res = (
      await drive.files.list({
        fields: photoFields,
        q: photoQuery,
        pageSize: 1000,
        pageToken: nextPageToken || undefined,
      })
    ).data as drive_v3.Schema$FileList;

    const resFiles = res.files || [];

    for (const p of resFiles) {
      updatedLinks[p.id!] = p.thumbnailLink!.replace("=s220", "");
    }

    nextPageToken = res.nextPageToken;
  } while (nextPageToken);

  const notUpdated = photos.filter((p) => !updatedLinks[p.drive_id]);

  console.log(
    `Found ${
      Object.values(updatedLinks).length
    } updated thumbnail links. Found ${notUpdated.length} photos that were not found in Drive`,
  );

  return {
    updated: updatedLinks,
    notUpdated,
  };
};

// export const updatePaths = async () => {
//   console.log("Updating paths");
//   let nextPageToken: string | undefined | null;

//   const allPhotos = [];
//   do {
//     const { photos, nextPageToken: token } = await getDrivePhotos(
//       "festival",
//       1000,
//       nextPageToken || undefined,
//     );

//     allPhotos.push(...photos);

//     nextPageToken = token;
//     console.log(`Next page token: ${nextPageToken}`);
//   } while (nextPageToken);

//   console.log("hello");

//   const dbPhotos = await getPhotos("live");

//   for (const p of dbPhotos) {
//     const drivePhoto = allPhotos.find((dp) => dp.id === p.drive_id);

//     if (!drivePhoto) {
//       console.log(`Photo not found in Drive: ${p.drive_id}`);
//       continue;
//     }

//     await serviceClient.from("photos").update({
//       path: drivePhoto.path,
//     }).eq("drive_id", p.drive_id);
//   }
// };
