import * as fs from "fs";
import path from "path";
import yaml from "js-yaml";
import glob from "glob";
import frontmatter from "front-matter";
import * as types from 'types';

export const sbConfig = yaml.load(fs.readFileSync("./stackbit.yaml", "utf8"));

if (!sbConfig.pagesDir || !sbConfig.dataDir)
  throw new Error("Invalid Stackbit config file");

export const siteConfigFile = sbConfig.dataDir + '/config.json'

const supportedFileTypes = ["md", "json"];

function contentFilesInPath(dir: string) {
  const globPattern = `${dir}/**/*.{${supportedFileTypes.join(",")}}`;
  return glob.sync(globPattern);
}

function readContent(file: string) {
  const rawContent = fs.readFileSync(file, "utf8");
  let content = null;
  switch (path.extname(file).substring(1)) {
    case "md":
      const parsedMd = frontmatter(rawContent);
      content = {
        ...parsedMd.attributes,
        body: parsedMd.body,
      };
      break;
    case "json":
      content = JSON.parse(rawContent);
      break;
    default:
      throw Error(`Unhandled file type: ${file}`);
  }

  content.__id = file;
  content.__url = fileToUrl(file);
  return content;
}

function fileToUrl(file: string) {
  if (!file.startsWith(sbConfig.pagesDir)) return null;

  let url = file.slice(sbConfig.pagesDir.length);
  url = url.split(".")[0];
  if (url.endsWith("/index")) {
    url = url.slice(0, -6) || "/";
  }
  return url;
}

function urlToFilePairs() {
  const pageFiles = contentFilesInPath(sbConfig.pagesDir);
  return pageFiles.map((file) => [fileToUrl(file), file]);
}

export function urlToContent(url: string) {
  const urlToFile = Object.fromEntries(urlToFilePairs());
  const file = urlToFile[url];
  return readContent(file);
}

export function pagesByType(contentType: types.DocumentTypeNames) {
  let result: {[key: string]: types.Page} = {};
  for (const [url, file] of urlToFilePairs()) {
    const content = readContent(file);
    if (content.type === contentType)
      result[url] = content;
  }
  return result;
}

export function siteConfig() {
  return readContent(siteConfigFile);
}