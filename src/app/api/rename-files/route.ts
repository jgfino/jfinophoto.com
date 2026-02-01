import { renameFiles } from "@/lib/google/drive";

export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  const headers = request.headers;

  const authorization = headers.get("Authorization");
  if (authorization !== "Bearer " + process.env.NEXT_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  await renameFiles();

  return new Response("Renamed files", { status: 200 });
}

// export const renameFiles = async () => {
//   const startFolder = CONCERT_FOLDER;

//   // Years
//   const yearFolders = await getSubfolders([startFolder]);

//   for (const yearFolder of yearFolders) {
//     // Festivals
//     const festivalFolders = await getSubfolders([yearFolder.id!]);

//     for (const festivalFolder of festivalFolders) {
//       const concert = festivalFolder.name!.split(" | ");
//       const date = concert[0];

//       // if date newer than 9/1/24
//       if (new Date(date) > new Date("2021-09-25")) {
//         continue;
//       }

//       const venue = concert[2];
//       const location = concert[3];

//       // Artists
//       const artistFolders = await getSubfolders([festivalFolder.id!]);

//       for (const artistFolder of artistFolders) {
//         const artist = artistFolder.name;

//         const photoQuery =
//           `'${artistFolder.id}' in parents and mimeType='image/jpeg'`;
//         const fields = [
//           "files/id",
//           "files/name",
//           "files/parents",
//         ].join(",");

//         const photos = (
//           await drive.files.list({
//             fields,
//             q: photoQuery,
//           })
//         ).data.files || [];

//         const promises = [];

//         // Rename photos
//         for (let i = 0; i < photos.length; i++) {
//           const photo = photos[i];
//           const newName = `${date}_${artist}_${venue}_${location}_${i + 1}.jpg`;
//           promises.push(drive.files.update({
//             fileId: photo.id!,
//             requestBody: {
//               name: newName,
//             },
//           }));
//         }

//         console.log(`Renaming ${date}/${artist}`);
//         await Promise.all(promises);
//       }
//     }
//   }
// };
