/**
 * Helper finctions
 */

import fs from 'fs'
import { join, basename, extname } from 'path'
import moment from 'moment'
import marked from 'marked'
import fm from 'front-matter'

import { Article, Meta } from './types'

/**
 * fs Promises API
 */
const { readFile, readdir, writeFile, stat } = fs.promises
export const fsPromises = fs.promises

/**
 * Is current app running on development mode or not
 * @type {Boolean}
 */
export const isDev = process.env.NODE_ENV === 'development'

/**
 * Walk source files to generage JSON data
 * @param  {string}              dir       Source files' path
 * @param  {Article[] = []}      filelist  Array of files
 * @return {Promise<Article[]>}  promise   Promise with articles
 */
export const walk = async (
  dir: string,
  filelist: Article[] = []
): Promise<Article[]> => {
  let files = await readdir(dir)
  // We only check MarkDown files
  files = files.filter(file => extname(file) === '.md')

  for (const file of files) {
    const filepath = join(dir, file)
    const filestat = await stat(filepath)

    if (filestat.isDirectory()) {
      filelist = await walk(filepath, filelist)
    } else {
      const fileData = await readFile(filepath)
      const name = basename(file, extname(file))

      const { attributes, body }: { attributes: Meta, body: string } = fm(fileData.toString())
      const meta = Object.assign({}, attributes) as Meta
      // Customize meta when front-matter is empty
      meta.date = moment.utc(
        attributes && attributes.date ? attributes.date : filestat.mtime
      ).unix()

      meta.title = attributes && attributes.title ? attributes.title : name

      meta.mDate = moment.utc(filestat.mtime).unix()

      filelist.push({
        name,
        meta,
        body: marked(body)
      })
    }
  }

  return filelist
}

/**
 * Read data from original path or 'db.json'(development mode)
 * @param  {string}              dir      Source files' path
 * @return {Promise<Article[]>}  promise  Promise with articles
 */
export const readData = async (dir: string): Promise<Article[]> => {
  let filelist = []

  if (fs.existsSync('db.json') && !isDev) {
    const data = await readFile('db.json', 'utf8')
    filelist = JSON.parse(data)
  } else {
    filelist = await walk(dir)
    await writeFile('db.json', JSON.stringify(filelist))
  }

  return filelist
}

/**
 * Build 'db.json' from source MarkDown files
 * @param  {string}         dir      Source files' path
 * @return {Promise<void>}  Promise  
 */
export const buildDB = async (dir: string): Promise<void> => {
  const filelist = await walk(dir)
  await writeFile('db.json', JSON.stringify(filelist))
}
