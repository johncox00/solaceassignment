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

- Use something like Elasticsearch for search functionality (or generally).
- Add filters to enhance usability (ex: checkboxes for unique values of `degree`, `specialties`, possibly `city`, and maybe ranges for `years_of_experience`).
