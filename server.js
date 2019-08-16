const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const PORT = 8080;

function newPost(reqParse) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements - ${reqParse.elementName}</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>${reqParse.elementName}</h1>
    <h2>${reqParse.elementSymbol}</h2>
    <h3>Atomic number ${reqParse.elementAtomicNumber}</h3>
    <p>${reqParse.elementDescription}</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`;
}
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === `POST`) {
      postHandler(req, res, body);
    } else if (req.method === `GET`) {
      getHandler(req, res);
    } else if (req.method === `PUT`) {
      putHandler(req, res, body);
    } else if (req.method === `DELETE`) {
      deleteHandler(req, res, body);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});

function getHandler(req, res) {
  if (req.url === `/` || req.url === `/index.html`) {
    fs.readFile(`./public/index.html`, function(err, data) {
      if (err) {
        errorHandler(res);
      } else {
        res.writeHead(200, {
          "content-type": "text/html",
          "content-length": data.length
        });
        res.write(data.toString());
        res.end();
      }
    });
  } else if (req.url === `/css/styles.css`) {
    fs.readFile(`./public/css/styles.css`, function(err, data) {
      if (err) {
        errorHandler(res);
      } else {
        res.writeHead(200, {
          "content-type": "text/css",
          "content-length": data.length
        });
        res.write(data.toString());
        res.end();
      }
    });
  } else {
    fs.readFile(`./public${req.url}`, function(err, data) {
      if (err) {
        errorHandler(res);
      } else {
        res.writeHead(200, {
          "content-type": "text/html",
          "content-length": data.length
        });
        res.write(data.toString());
        res.end();
      }
    });
  }
}

function errorHandler(res) {
  fs.readFile(`./public/404.html`, function(err, data) {
    if (err) {
      res.writeHead(500, {
        "content-type": "application/json"
      });
    }
    res.writeHead(404, {
      "content-type": "text/html",
      "content-length": data.length
    });
    res.write(data.toString());
    res.end();
  });
}

function postHandler(req, res, body) {
  let reqParse = querystring.parse(body);
  fs.writeFile(
    `./public/${reqParse.elementName}.html`,
    newPost(reqParse),
    (err, data) => {
      if (err) {
        return errorHandler(res);
      }

      //rewriting Index
      fs.readdir(`./public`, function(err, data) {
        if (err) {
          errorHandler(res);
        } else {
          let filtered = data.filter(function(e) {
            return ![`.keep`, `404.html`, `css`, `index.html`].includes(e);
          });

          fs.writeFile(`./public/index.html`, makeIndex(filtered), function(
            err
          ) {
            if (err) {
              errorHandler(res);
            }
            let str = `{ "success" : true }`;
            res.writeHead(200, {
              "content-type": "application/json",
              "content-length": str.length
            });
            res.write(str);
            res.end();
          });
        }
      });
    }
  );
}

function makeIndex(filtered) {
  let idx = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are ${filtered.length}</h3>
    <ol>`;

  let idx2 = `
  </ol>
  </body>
  </html>`;
  for (let i = 0; i < filtered.length; i++) {
    let name = filtered[i].split(".");
    let listElements = `<li>
    <a href= "/${filtered[i]}">${name[0]}</a>
    </li>`;
    idx += listElements;
  }
  idx += idx2;
  return idx;
}

function putHandler(req, res, body) {
  let reqParse = querystring.parse(body);
  fs.stat(`./public/${reqParse.elementName}.html`, function(err, stats) {
    if (err) {
      return errorHandler(res);
    }
    if (!stats) {
      return errorHandler(res);
    }
    fs.writeFile(
      `./public/${reqParse.elementName}.html`,
      newPost(reqParse),
      function(err, data) {
        if (err) {
          return errorHandler(err);
        }
        let str = `{ "success" : true }`;
        res.writeHead(200, {
          "content-type": "application/json",
          "content-length": str.length
        });
        res.write(str);
        res.end();
      }
    );
  });
}

function deleteHandler(req, res) {
  fs.unlink(`./public/${req.url}`, function(err, data) {
    if (err) {
      return errorHandler(res);
    }
    fs.readdir(`./public`, function(err, data) {
      if (err) {
        errorHandler(res);
      } else {
        let filtered = data.filter(function(e) {
          return ![`.keep`, `404.html`, `css`, `index.html`].includes(e);
        });

        fs.writeFile(`./public/index.html`, makeIndex(filtered), function(err) {
          if (err) {
            errorHandler(res);
          }
          let str = `{ "success" : true }`;
          res.writeHead(200, {
            "content-type": "application/json",
            "content-length": str.length
          });
          res.write(str);
          res.end();
        });
      }
    });
  });
}
