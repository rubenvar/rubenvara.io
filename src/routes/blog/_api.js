// the utility functions in this file process posts for the .json.js api filtes in /routes
import path from 'path';
import fs from 'fs';
import { compile } from 'mdsvex';
import { dev } from '$app/env';

export const POSTS_PATH = 'src/posts';

/**
 * Returns an array of post objects with some of their metadata and optional post content.
 * Array is sorted in reverse chronological order
 * @param {boolean} isContentWanted - if true the HTML post content is returned as well as meta
 */
export const getAllPosts = async (isContentWanted = false) => {
  // get folder with posts
  const __dirname = path.resolve();
  const location = path.join(__dirname, POSTS_PATH);

  // find all post directories
  const directories = fs
    .readdirSync(location)
    .filter((element) => fs.lstatSync(`${location}/${element}`).isDirectory());

  // maybe not found
  if (!directories) throw new Error(`no post directories found`);

  // get each post from its directory and save the raw content of the file
  // TODO change to not hardcoded file name (now index.md)
  const articles = directories.map((element) => {
    const contentPath = `${location}/${element}/index.md`;
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, { encoding: 'utf-8' });
    }
    return undefined;
  });

  if (!articles) throw new Error(`no post files found`);

  // compile each raw content and return and object per post
  let result = articles.map(async (content) => {
    // compile the content with mdsvex
    const compiled = await compile(content);

    // if no post compiled, null
    if (!Object.keys(compiled.data).length > 0) return null;

    // get post metadata
    const { slug, title, date, updated, description, categories, status } =
      compiled.data.fm;

    let resultElement = {
      slug,
      title,
      date,
      updated,
      description,
      categories,
      status,
    };
    // maybe return post content
    if (isContentWanted) {
      resultElement = { ...resultElement, body: compiled.code };
    }

    return resultElement;
  });
  result = await Promise.all(result);

  return (
    result
      // filter out nulls
      .filter((item) => !!item)
      // filter out non-published if prod
      .filter((item) => item.status === 'published' || dev)
      // sort by updated or date
      .sort(
        (a, b) =>
          Date.parse(b.updated || b.date) - Date.parse(a.updated || a.date)
      )
  );
};
