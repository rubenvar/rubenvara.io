# Changelog

All the notable changes made to this site. It adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.2] - 2022-03-01

### Added

- Created `/now` page in `svx` instead of `html`.
- Added draft text in post title in `dev`.
- Added draft text in listed post in `dev`.

### Changed

- Tried to add the Triangles canvas.

### Fixed

- Fixed `svx` post content code snippets render.

## [0.3.1] - 2022-03-01

### Changed

- Updated dependencies.
- Try Netlify adapter again.

## [0.3.0] - 2022-01-25

- Full rewrite (*simple*) site in SvelteKit:
  - Added (old*ish*) index and now page
  - Added blog and posts, written in MDsveX.
  - Added ESlint.
  - Added netlify adapter.

## [0.2.1] - 2021-01-15

### Changed

- Slightly changed homepage texts.

## [0.2.0] - 2021-01-15

Almost ready for launch.

### Changed

- Removed many features (categories, home effects, etc.) from the site as they are not needed at all until the site is growing.

### Fixed

- Footer div angle not working on first page load until width is changed (not likely to happen much...), so now there is a hard-coded default until a better solution is found.

## [0.1.0] - 2020-07-21

🎊 Website beta launched!

Deployed in [Netlify](https://quizzical-varahamihira-9fdae1.netlify.app/), with test blog posts and not fully responsive yet. Some SEO and PWA features missing as per Chrome Lighthouse.

### Added

- Basic features:
  - Main homepage.
  - Nav only links to /now page.

There are no more pages, the blog is not linked from anywhere (the link in header is commented).
