import path from 'path';
import fs from 'fs';
import { compile } from 'mdsvex';

export const POSTS_PATH = 'src/posts';

/**
 * Returns an array of post objects with some of their metadata and optional post content.
 * Array is sort in reverse chronological order
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
    
  // get each post from its directory and save the raw content of the file
  // TODO change to not hardcoded file name (now index.md)
  const articles = directories.map((element) => {
    const contentPath = `${location}/${element}/index.md`;
    if (fs.existsSync(contentPath)) {
      return fs.readFileSync(contentPath, { encoding: 'utf-8' });
    }
  });

  // compile each raw content and return and object per post
  let result = articles.map(async (content) => {
    // compile the content with mdsvex
    const compiled = await compile(content);
    // get metadata
    const { slug, title, date, updated, description, categories } = compiled.data.fm;
    
    let resultElement = { slug, title, date, updated, description, categories };
    if (isContentWanted) {
      resultElement = { ...resultElement, body: compiled.code };
    }
    
    return resultElement;
  });
  result = await Promise.all(result);
  
  // sort and return
  return result.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/**
 * Returns an object with all post metadata and post content.
 * @param {string} slug - post slug
 * @param {boolean} isContentWanted - if true the HTML post content is returned as well as meta
 */
export const getSinglePost = async (slug, isContentWanted = true)  => {
  // get folder with posts
  const __dirname = path.resolve();
  const postsFolder = path.join(__dirname, POSTS_PATH);

  // find the post directory
  const postDirectory = fs
    .readdirSync(postsFolder)
    .filter((folder) => fs.lstatSync(`${postsFolder}/${folder}`).isDirectory())
    .find((folder) => folder === slug);

  // maybe not found
  if (!postDirectory) throw new Error('no post found with this url');
  
  // get the post from its directory and save the raw content of the file
  // TODO change to not hardcoded file name (now index.md)
  const contentPath = `${postsFolder}/${postDirectory}/index.md`;
  
  if (!contentPath) throw new Error('no post found with this url');
  const article = fs.readFileSync(contentPath, { encoding: 'utf-8' });
  
  const compiled = await compile(article);
  const { title, seoTitle, date, updated, description, categories } = compiled.data.fm;
  
  let result = { slug, title, seoTitle, date, updated, description, categories };
  if (isContentWanted) {
    result = { ...result, content: compiled.code };
  }

  return result;
}

export const getPost = async (content, body = true) => {
  const transformedContent = await compile(content);
  const {
    datePublished,
    featuredImage,
    featuredImageAlt,
    ogImage,
    ogSquareImage,
    postTitle,
    seoMetaDescription,
    twitterImage,
  } = transformedContent.data.fm;
  let result = {
    datePublished,
    featuredImage,
    featuredImageAlt,
    ogImage,
    ogSquareImage,
    postTitle,
    seoMetaDescription,
    twitterImage,
  };
  if (body) {
    result = { ...result, body: transformedContent.code };
  }
  return result;
};