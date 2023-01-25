import _ from 'lodash';
import path from 'path';
import slugify from 'slugify';
import fse from 'fs-extra';

import { utils } from '@stackbit/cms-core';
import { Readable } from 'stream';
import axios from 'axios';

const MARKDOWN_FILE_EXTENSIONS = ['md', 'mdx', 'markdown'];

export function sanitizeSlug(slug: string): string {
    return slug
        .split('/')
        .map((part) => slugify(part, { lower: true }))
        .join('/');
}

export async function getFileDates(filePath: string): Promise<{ createdAt: string; updatedAt: string }> {
    let fileStats: fse.Stats | null = null;
    try {
        fileStats = await fse.stat(filePath);
    } catch (err) {}
    return {
        createdAt: (fileStats?.birthtime ?? new Date()).toISOString(),
        updatedAt: (fileStats?.mtime ?? new Date()).toISOString()
    };
}

export async function getFileData(filePath: string): Promise<any> {
    const extension = path.extname(filePath).substring(1);
    let data = await utils.parseFile(filePath);
    if (MARKDOWN_FILE_EXTENSIONS.includes(extension) && _.has(data, 'frontmatter') && _.has(data, 'markdown')) {
        data = data.frontmatter;
    }
    return data;
}

export async function saveFileData(filePath: string, data: any): Promise<boolean> {
    let dataToWrite = data;
    const extension = path.extname(filePath).substring(1);
    if (MARKDOWN_FILE_EXTENSIONS.includes(extension)) {
        const existingData = (await fse.pathExists(filePath)) ? await utils.parseFile(filePath) : {};
        dataToWrite = {
            ...existingData,
            frontmatter: data
        };
    }
    return utils.outputDataIfNeeded(filePath, dataToWrite);
}

export async function saveBase64Data(filePath: string, data: string): Promise<void> {
    const buffer = Buffer.from(data, 'base64');
    const readStream = Readable.from(buffer);
    await fse.ensureDir(path.dirname(filePath));
    const writeStream = fse.createWriteStream(filePath);
    readStream.pipe(writeStream);
    return new Promise((resolve, reject) => {
        writeStream.on('error', reject).on('finish', resolve);
    });
}

export async function saveFromUrl(filePath: string, url: string): Promise<void> {
    const response = await axios({
        responseType: 'stream',
        url
    });
    await fse.ensureDir(path.dirname(filePath));
    const writeStream = fse.createWriteStream(filePath);
    response.data.pipe(writeStream);
    return new Promise((resolve, reject) => {
        writeStream.on('error', reject).on('finish', resolve);
    });
}
