import { Express } from 'express'

export type Meta = { 
  title?: string
  date?: number
  mDate?: number
  tags?: string[],
  formatDate?: string
}

export type Article = {
  name: string
  body: string
  meta: Meta
}

export type Params = {
  name?: string
  order?: 'desc' | 'asc'
  count?: number
  page?: number
  dateFormat?: string
  tag?: string
}

export type Result = {
  list: Article[]
  pages: number
} | Article

export type Config = {
  theme: string
  source: string
  staticPaths: string[]
}

export interface Tusa extends Express {
  query?: (params: Params) => Promise<Result>
  start?: () => void
}
