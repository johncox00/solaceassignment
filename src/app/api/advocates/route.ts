import { count, ilike, or, sql, asc, desc } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { SortBy, SortOrder } from "../../../types";

export async function GET(request: Request): Promise<Response> {
  // set up query params
  const { searchParams } = new URL(request.url);
  const page: number = parseInt(searchParams.get("page") ?? "1");
  let limit: number = parseInt(searchParams.get("limit") ?? "10");
  limit = limit > 100 ? 100 : limit;
  limit = limit < 10 ? 10 : limit;
  const search: string = searchParams.get("search") ?? "";
  const sortBy: SortBy = (searchParams.get("sortBy") as SortBy) ?? "lastName";
  const sortOrder: SortOrder = (searchParams.get("sortOrder") as SortOrder) ?? "asc";

  // set up data query
  let data = db.select().from(advocates);

  // set up page metadata query
  let pageData = db.select({count: count()}).from(advocates);

  // add search conditions if search term is provided
  if (search.trim()) {
    const searchPattern = search.trim();

    const searchConditions = or(
      ilike(advocates.firstName, `%${searchPattern}%`),
      ilike(advocates.lastName, `%${searchPattern}%`),
      ilike(advocates.city, `%${searchPattern}%`),
      ilike(advocates.degree, `%${searchPattern}%`),
      sql`${advocates.specialties}::text ILIKE ${'%' + searchPattern + '%'}`,
    );
    data = data.where(searchConditions);
    pageData = pageData.where(searchConditions);
  }


  // gather page metadata
  const totalCount = (await pageData.execute())[0].count;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // add sort conditions if sortBy and sortOrder are provided
  if (sortBy) {
    if (sortOrder === "asc") {
      data = data.orderBy(asc(advocates[sortBy]));
    } else {
      data = data.orderBy(desc(advocates[sortBy]));
    }
  }

  let offset = (page - 1) * limit;
  data = data.offset(offset).limit(limit);

  const resp = await data.execute();
  return Response.json({ data: resp, page, limit, totalCount, totalPages, hasNextPage, hasPreviousPage });
}
