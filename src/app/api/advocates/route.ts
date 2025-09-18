import { count } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: Request): Promise<Response> {
  // set up query params
  const { searchParams } = new URL(request.url);
  const page: number = parseInt(searchParams.get("page") ?? "1");
  const limit: number = parseInt(searchParams.get("limit") ?? "10");


  // set up page metadata
  let pageData = db.select({count: count()}).from(advocates);
  const totalCount = (await pageData.execute())[0].count;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  let offset = (page - 1) * limit;
  let data = db.select().from(advocates);
  data = data.offset(offset).limit(limit);

  const resp = await data.execute();
  return Response.json({ data: resp, page, limit, totalCount, totalPages, hasNextPage, hasPreviousPage });
}
