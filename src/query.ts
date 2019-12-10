/**
 * Flat-File query system
 */

import moment from 'moment'

import { Params, Result } from './types'
import { readData } from './utils'

const query = async (
  sourcePath: string,
  params: Params = {}
): Promise<Result> => {
  const fileList = await readData(sourcePath)

  const result = {
    list: Array.from(fileList),
    pages: 1
  }

  if (params.tag) {
    result.list = result.list.filter(
      item =>
        params.tag && item.meta.tags && item.meta.tags.includes(params.tag)
    )
  }

  if (params.name) {
    const article = fileList.find(item => item && item.name === params.name)
    if (article) {
      if (params.dateFormat) {
        article.meta.formatDate = moment
          .unix(article.meta.date!)
          .utc()
          .format(params.dateFormat)
      }
      return article
    }
  }

  if (params.order) {
    const order = params.order
    if (order !== 'desc' && order !== 'asc') {
      throw new Error(`Query params 'order' must be 'asc' or 'desc'`)
    }

    result.list = result.list.filter(
      item => item && item.meta && item.meta.date
    )
    result.list.sort((a, b) => {
      const dateA = a.meta.date!
      const dateB = b.meta.date!

      return order === 'desc' ? dateB - dateA : dateA - dateB
    })
  }

  if (params.page || params.count) {
    const count = params.count ? params.count : 0
    const startPage = params.page ? params.page : 1
    const startIndex = (startPage - 1) * count

    if (!!count) {
      result.pages = Math.ceil(result.list.length / count)
    }
    result.list = result.list.slice(startIndex, startIndex + count)
  }

  if (params.dateFormat) {
    result.list = result.list.map(item => ({
      ...item,
      meta: {
        ...item.meta,
        formatDate: moment.unix(item.meta.date!).utc().format(params.dateFormat)
      }
    }))
  }
  
  return result
}

export default query
