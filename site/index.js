const app = require('../lib/')({
  source: 'content',
  theme: 'site'
})

app.get('\^/$|\/docs|\/examples', async (req, res) => {
  const startTime = Date.now()
  let name = 'home'
  const path = req.path.slice(1)
  if (path) {
    name = path
  }

  const post = await app.query({ name })
  res.render('home', { post, startTime })
})

app.get('/*', (req, res) => {
  res.sendStatus(404)
})

app.start()
