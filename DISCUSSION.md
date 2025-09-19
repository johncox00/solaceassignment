## Task Priorities

1. Fix vulnerabilities - Ensure we're not shipping critical vulnerabilities. It's always easier when you upgrade early and often.
2. Pagination (start types) - Reduce risk of crushing user experience with potentially large payloads.
3. Search functionality - Fix broken UX. Minimum usability.
4. Serial > UUID - Security enhancement now that users are unblocked.
5. Sorting - Make it even more usable.
6. Styling - Make the app "feel" more real (building trust) and even easier to use.

## Outstanding Items

- Linter errors in `route.ts` despite seemingly sound syntax. Looks to be a typing issue.

## Recommendations

- Use something like Elasticsearch for search functionality (or generally). The current `ilike` implementation won't scale. This was a quick hit given the time constraints.
- Add filters to enhance usability (ex: checkboxes for unique values of `degree`, `specialties`, possibly `city`, and maybe ranges for `years_of_experience`).
- Create finer-grained error handling based on status codes.
- Add loading state.
- If the app is going to be any bigger consider moving state managemnt to something like Jotai with API interactions abstracted behind state interactions.
- Depending on context of usage, the `<table>` display of data could use some improvement. It won't work great on mobile, but that might not be a concern.
- There is likely opportunity to abstract some more comonents for the sake of driving consistent usage of Tailwind classes.
- Do some user testing to see what the appropriate delay on firing the search request should be and/or if triggering from a button click/enter would be preferable.

## Using AI

I used the occasional tab completion, though often times they're not what I need. The place where I leaned on AI the most was styling, mostly just because I'm not intimately familiar with Tailwind and it was a lot of keystrokes. I was also not familiar with the details of Drizzle or Drizzle Kit, so I used the chat in Cursor as a way to get to the documentation I needed quickly. The concepts were all very familiar - just syntax details and figuring out patterns for migrations.
