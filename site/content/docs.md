# Docs

Tusa is just a wrapper of Express, for many questions you should query [Express documentation](https://expressjs.com/en/4x/api.html).

## Configure

Set source file directory, template theme name(path) and static file directories in the constructor function.

```js
const app = require('tusa')({
  source: 'content',  // Default value is 'source'
  theme: 'mytheme',   // Default value is 'default'
  staticPaths: ['static']  // Default value is ['public']
})
```

## APIs

### app.query(params)

Query for qualified content from the source files. Parameter list supports the following:

```js
const params = {
  name: 'home',            // Markdown file name
  order: 'desc',           // Sort files by it's date
  count: 10,               // Limit count of mathed files
  page: 1,                 // Pagination function
  dateFormat: 'YY-MM-DD',  // Format Date with moment.fromat
  tag: 'tech'
}
```

### app.start(port)

Specify the port to start the server, default port is 8000.
