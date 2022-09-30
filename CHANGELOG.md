# Changelog

All the notable changes made to this site. It adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.16.0] - 2022-09-30

- New post translated and published.
- 2 new drafts.
- Adjusted previous translation.

## [0.15.0] - 2022-09-30

- New post draft.
- Added Google Analytics in production.

## [0.14.4] - 2022-09-30

- Fixed local link from post.

## [0.14.3] - 2022-09-30

- Changed some routes/post titles.

## [0.14.2] - 2022-09-29

- Added redirects for netlify for old routes (previous blog posts).
- Added `dev` boolean in api, remove from fn definitions.
- Fixed api to filter out draft posts from series list.

## [0.14.1] - 2022-09-29

- Fixed deploy error by emptying draft react-query series post 4.

## [0.14.0] - 2022-09-29

- Updated dependencies.
- Improved API `isInternal` function.
- Added and styled auto PostOriginal box on post top for translated posts.
- Changd post frontmatter to include an `original` object for translations.
- 3 new posts translated and published (react-query 1, 2 and 3).
- Tweaked the post series component.

## [0.13.0] - 2022-09-27

- Updated dependencies.
- New draft.
- Tweaked project card css.
- Created post series functionality:
  - Added a post series list component for post template.
- Tweaked font sizes.

## [0.12.13] - 2022-09-26

- Added `adapter-auto` for netlify deploy.

## [0.12.12] - 2022-09-26

- Removed `.npmrc` to try netlify deploys.

## [0.12.11] - 2022-09-26

- Changed `@sveltejs/kit` version for netlify deploy.

## [0.12.10] - 2022-09-26

- Added `adapter-auto` for netlify deploy.

## [0.12.9] - 2022-09-26

- Tried to fix 404 on Vercel.
- Fixed ts in post api.
- Fixed typos in post.

## [0.12.8] - 2022-09-23

- Updated dependencies.

## [0.12.7] - 2022-09-22

- Try to fix vercel deploy 404 (downgrade `adapter-vercel`).
- Fixed link in post to project file in GH.

## [0.12.6] - 2022-09-22

- Moved posts api functions.

## [0.12.5] - 2022-09-22

- Fixed `Box` component css.
- Fixed a link url to blog post.

## [0.12.4] - 2022-09-22

- Updated all SvelteKit posts to new SvelteKit API.

## [0.12.3] - 2022-09-22

- Updated to latest `@sveltejs/kit`:
  - Updated `$app/env` to `$app/environment`.
  - Updated `config.kit.prerender.default`
- Updated posts with SvelteKit API changes.
- Replaced `eslint-plugin-svelte3` with `eslint-plugin-svelte`.
- Updated dependencies.

## [0.12.2] - 2022-08-16

- Fixed error in category page.
- new drafts (start translations from TkDodo).

## [0.12.1] - 2022-08-16

- Changed to `adapter-vercel`.

## [0.12.0] - 2022-08-16

- Updated SvelteKit to new `load` function and new routing structure.
- Updated dependencies.
- Added different date format in listed post if `dev`.
- Added a toggle for all SEO boxes in listed posts in blog page.
- Wrote 1 new post.
- In `dev`, show category list in blog page.
- Reverted "next.js" post category naming to "nextjs".

## [0.11.0] - 2022-07-11

- Wrote 1 new post.
- Updated SvelteKit, migrated to new Vite config.
- Renamed "next.js" post category.

## [0.10.0] - 2022-07-08

- Updated dependencies.
- Created sitemap.
- Refactored home page: prepare for English locale, keep latest posts in store.
- Wrote 1 new post.
- Created an SEO link counter per post for `dev`.
- Created a word counter per post for `dev` to show with SEO links.

## [0.9.0] - 2022-07-04

- Updated post meta components (separated for listed post and single post).
- Updated dependencies.
- Created 3 drafts.
- Wrote 1 new post.
- Added category post count in api and post meta.
- Created `getCategories` function to get all post categories from folder names and their count. Unused for now until there are more posts.
- Added `canonical` in head meta tags.
- Fixed styling specificity in Header.

## [0.8.0] - 2022-06-28

- Added old route redirects in category endpoint.
- Updated dependencies.
- Wrote 1 new post.
- Added page transitions.
- Changed page load fns to manage page meta `title` and `description` defaults and in blog pages.

## [0.7.0] - 2022-06-25

- Updated dependencies.
- Wrote 2 new posts.
- Fixed post sorting by updated or date.
- Added post index in listed posts in blog.

## [0.6.0] - 2022-06-24

- Added latest posts in home.
- Changed the post api API.
- Wrote 2 new posts.

## [0.5.0] - 2022-06-21

- Created TwitterBox for post end twitter link.
- Changed PostMeta to conditionally show category (don't show in category pages).
- Wrote 2 new posts.
- Added post title and description in `head`.
- Added app version in footer.
- Simplified footer.
- Show title in category page.
- Filter draft posts if prod.

## [0.4.0] - 2022-06-20

- Many changes: rewrote the whole blog post fetching functionality, it's much simpler now.
- Changed routes to posts, now posts will be at `/[category]/[slug]`, and there will be a `/[category]` page for each category, listing those posts.
- Changed to static site (to try it).

## [0.3.3] - 2022-06-13

- Updated dependencies.
- Installed vercel adapter.
- Fixed navigation and endpoint errors.

## [0.3.2] - 2022-03-01

- Created `/now` page in `svx` instead of `html`.
- Added draft text in post title in `dev`.
- Added draft text in listed post in `dev`.
- Tried to add the Triangles canvas.
- Fixed `svx` post content code snippets render.

## [0.3.1] - 2022-03-01

- Updated dependencies.
- Try Netlify adapter again.

## [0.3.0] - 2022-01-25

- Full rewrite (*simple*) site in SvelteKit:
  - Added (old*ish*) index and now page
  - Added blog and posts, written in MDsveX.
  - Added ESlint.
  - Added netlify adapter.

## [0.2.1] - 2021-01-15

- Slightly changed homepage texts.

## [0.2.0] - 2021-01-15

Almost ready for launch.

- Removed many features (categories, home effects, etc.) from the site as they are not needed at all until the site is growing.
- Footer div angle not working on first page load until width is changed (not likely to happen much...), so now there is a hard-coded default until a better solution is found.

## [0.1.0] - 2020-07-21

🎊 Website beta launched!

Deployed in [Netlify](https://quizzical-varahamihira-9fdae1.netlify.app/), with test blog posts and not fully responsive yet. Some SEO and PWA features missing as per Chrome Lighthouse.

- Added basic features:
  - Main homepage.
  - Nav only links to /now page.

There are no more pages, the blog is not linked from anywhere (the link in header is commented).
