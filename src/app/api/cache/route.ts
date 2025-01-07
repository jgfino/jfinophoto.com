import { updateCacheAndThumbnailLinks } from "@/lib/db/supabase";
import { revalidatePages } from "@/lib/util";

export async function POST(request: Request): Promise<Response> {
  const headers = request.headers;

  const authorization = headers.get("Authorization");
  if (authorization !== "Bearer " + process.env.NEXT_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("Updating cache...");

  try {
    await updateCacheAndThumbnailLinks(true);
    revalidatePages("live");
    revalidatePages("festival");
    revalidatePages("portrait");
    return new Response("Cache updated", { status: 200 });
  } catch (error) {
    console.error("Error updating cache:", error);
    return new Response("Error updating cache", { status: 500 });
  }
}
