const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank")
const app = express();

app.use(morgan('dev'));
app.use(express.static('public'))

app.get("/", (req, res) => {
  
    const posts = postBank.list();
    
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts.map(post => `
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>
              <a href="/posts/${post.id}">${post.title}</a>
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${post.date}
            </small>
          </div>`
        ).join('')}
      </div>
    </body>
  </html>`

  res.send(html)
});

// say that a client GET requests the path /posts/7
app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`
    res.send(html)
  } else {
    res.send(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <h1>
    ${post.title}
    </h1>
    <p>
    ${post.content}
    </p>`
  );
  }
  
});

// say that a client GET requests the path /users/nimit
app.get( '/users/:name', (req, res) => {
  console.log( req.params.name ); // --> 'nimit'
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

// cant figure out how to use array.join("") to get rid of commas