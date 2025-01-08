import { createClient } from "@supabase/supabase-js";
import { Database, Enums, Tables } from "../../../supabase/database.types";
import { getDrivePhotos, getDrivePhotosFromFolders } from "../google/drive";

export const PAGE_TYPES = ["live", "festival", "portrait"] as const;

const serviceClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const portfolioWithPhotoQuery = (page?: Enums<"photo_type">) => {
  let query = serviceClient.from("portfolio").select(`
    *,
    photo: drive_cache(*)  
  `);

  if (page) {
    query = query.eq("page", page);
  }

  return query;
};

/**
 * Add a photo from drive to a page
 * @param id The drive ID of the photo
 */
export const addPhotoToPage = async (
  id: string,
  page: Enums<"photo_type">,
) => {
  console.log(`Adding drive photo ${id} to ${page}`);

  // Insert or update the new photo
  const { error } = await serviceClient.from("portfolio").upsert({
    photo: id,
    page,
  });

  if (error) {
    throw error;
  }
};

/**
 * Delete a photo from a page
 * @param id The Google Drive ID of the photo
 * @param page The page to delete the photo from
 */
export const removePhotoFromPage = async (
  id: string,
  page: Enums<"photo_type">,
) => {
  console.log(`Deleting photo ${id}`);

  const { error } = await serviceClient
    .from("portfolio")
    .delete()
    .eq("photo", id)
    .eq("page", page);

  if (error) {
    throw error;
  }
};

/**
 * Delete multiple photos from a page
 * @param ids The Google Drive IDs of the photos
 * @param page The page to delete the photo from
 */
export const removePhotosFromPage = async (
  ids: string[],
  page: Enums<"photo_type">,
) => {
  console.log(`Deleting photos ${ids}`);

  const { error } = await serviceClient
    .from("portfolio")
    .delete()
    .in("photo", ids)
    .eq("page", page);

  if (error) {
    throw error;
  }
};

/**
 * Get the photos for the given page, or all pages if none is given
 * @param page The page type to get the photos for
 * @returns The photos for the page
 */
export const getPortfolioPhotos = async (
  page: Enums<"photo_type">,
) => {
  console.log(`Getting database photos for ${page} page`);

  const { data, error } = await portfolioWithPhotoQuery(page);

  if (error) {
    throw error;
  }

  return (data || []).map((d) => d.photo as Tables<"drive_cache">);
};

/**
 * Get a photo by its Google Drive ID. This only works for photos that have been added to the portfolio
 * @param id The Google Drive ID of the photo
 */
export const getPortfolioPhoto = async (id: string) => {
  const { data, error } = await portfolioWithPhotoQuery().eq(
    "photo",
    id,
  ).maybeSingle();

  if (error) {
    throw error;
  }

  return data?.photo as Tables<"drive_cache"> | undefined;
};

/**
 * Get ALL the google drive photos for a page (from supabase cache)
 * @param page The page type to get the photos for
 * @param limit The number of photos to get
 * @param offset The offset to start from
 *
 * @returns The photos for the page
 */
export const getCachedDrivePhotos = async (
  page: Enums<"photo_type">,
  limit: number,
  offset: number,
): Promise<Tables<"drive_cache">[]> => {
  console.log(`Getting cached drive photos for ${page}`);

  const { data, error } = await serviceClient
    .from("drive_cache")
    .select("*")
    .eq("page", page)
    .order("drive_created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * Update the google drive cache
 * @param portfolioOnly Whether to only update the portfolio photos (default: true)
 */
export const updateDrivePhotos = async (portfolioOnly = true) => {
  await Promise.all(PAGE_TYPES.map(async (page) => {
    if (portfolioOnly) {
      const portfolioPhotos = await getPortfolioPhotos(page);
      const folderIds = portfolioPhotos.map((p) => p.parent_folder_id);
      const drivePhotos = await getDrivePhotosFromFolders(page, folderIds);

      // Update cache entries
      await serviceClient.from("drive_cache").upsert(drivePhotos);
    } else {
      const drivePhotos = await getDrivePhotos(page);

      // Update cache entry
      await serviceClient.from("drive_cache").upsert(drivePhotos);
    }

    console.log(
      `Updated ${portfolioOnly ? "PORTFOLIO" : "FULL"} drive cache for ${page}`,
    );
  }));
};
