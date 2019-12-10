import express from 'express'
import { join } from 'path'

import { Tusa, Params, Result, Config } from './types'
import { isDev, buildDB } from './utils'
import query from './query'

const createApp = (
  config: Config
): Tusa => {
  const app: Tusa = express()

  const defaultConfig = { theme: 'default', source: 'source', staticPaths: ['public'] }
  const newConfig = Object.assign(defaultConfig, config)

  const themePath = join(__dirname, '..', 'views', newConfig.theme)
  const sourcePath = join(__dirname, '..', newConfig.source)

  // Rebuild the database every time the server starts
  buildDB(sourcePath)

  app.set('views', themePath)
  app.set('view engine', 'ejs')

  // Set static middleware paths
  app.use(express.static(join(themePath, 'static')))
  for (const item of newConfig.staticPaths) {
    app.use(express.static(join(__dirname, '..', item)))
  }

  app.query = (params: Params): Promise<Result> => {
    return query(sourcePath, params)
  }

  app.start = (port = 8000): void => {
    // Custom error hanlder
    app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        // eslint-disable-next-line
        next: express.NextFunction
      ) => {
        if (isDev) {
          console.error(error)
        }
        res.sendStatus(500)
      }
    )

    // start the Express server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`)
    })
  }

  return app
}

module.exports = createApp
