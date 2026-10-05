import { NextResponse } from "next/server";
import axiosFetch from "@/Utils/fetch";
import { getCache, setCache } from "@/Utils/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  const cacheKey = JSON.stringify(query);

  // Check if the result for this query is already cached
  const cachedResult = getCache(cacheKey);
  if (cachedResult) {
    return NextResponse.json(cachedResult);
  }

  const {
    requestID,
    id,
    language,
    page,
    genreKeywords,
    sortBy,
    year,
    country,
    query: searchQuery,
    season,
    episode,
  }: any = query;

  const result: any = await axiosFetch({
    requestID,
    id,
    language,
    page,
    genreKeywords,
    sortBy,
    year,
    country,
    query: searchQuery,
    season,
    episode,
  });

  // Cache the result
  setCache(cacheKey, result);
  return NextResponse.json(result);
}
