// the utility functions in this file process posts for the .json.js api filtes in /routes
import path from 'path';
import fs from 'fs';
import { compile } from 'mdsvex';

const POSTS_PATH = 'src/posts';

/**
 * Returns an object with all post metadata and post content.
 * @param {string} slug - post slug
 * @param {boolean} isContentWanted - if true the HTML post content is returned as well as meta
 */
export const getSinglePost = async (slug, isContentWanted = true) => {
  // ???
  if (slug === 'service-worker.js') return;

  // get folder with posts
  const __dirname = path.resolve();
  const postsFolder = path.join(__dirname, POSTS_PATH);

  // find the post directory
  const postDirectory = fs
    .readdirSync(postsFolder)
    .filter((folder) => fs.lstatSync(`${postsFolder}/${folder}`).isDirectory())
    .find((folder) => folder === slug);

  // maybe not found
  if (!postDirectory)
    throw new Error(`no post directory found with url: ${slug}`);

  // get the post from its directory and save the raw content of the file
  // TODO change to not hardcoded file name (now index.md)
  const contentPath = `${postsFolder}/${postDirectory}/index.md`;

  if (!contentPath) throw new Error(`no post file found with url: ${slug}`);

  const article = fs.readFileSync(contentPath, { encoding: 'utf-8' });
  const compiled = await compile(article);

  const { title, seoTitle, date, updated, description, categories, status } =
    compiled.data.fm;

  let result = {
    slug,
    title,
    seoTitle,
    date,
    updated,
    description,
    categories,
    status,
  };
  if (isContentWanted) {
    result = { ...result, content: compiled.code };
  }

  return result;
};
