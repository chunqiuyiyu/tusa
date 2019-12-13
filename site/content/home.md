# Tusa

[Tusa][1] is a tiny [Flat-File][2] CMS(Content Management System).

Quickly use it in three steps:
<details open>
  <summary>Load up Tusa</summary>

```js
const app = require('tusa')()
```

</details>
<details open>
  <summary>Define routes</summary>
  
```js
app.get('/', async (req, res) => {
  const post = await app.query({ name: 'home' })
  res.render('home', { post })
})
```

</details>
<details open>
  <summary>Start APP</summary>
  
```js
app.start()
```

</details>

Tusa is built on the top of [Express][3] and [Markdown][4] Flat-File query stystem.

Checkout [Docs](/docs) and [Examples](/examples) for more details.

[1]: https://github.com/chunqiuyiyu/tusa
[2]: https://en.wikipedia.org/wiki/Flat-file_database
[3]: https://expressjs.com/
[4]: https://en.wikipedia.org/wiki/Markdown
