const http = require('http');
const fs = require('fs');

const PORT = 8080;

const server = http.createServer((req, res) => {

  console.log(req.method);
  console.log(req.url);
  console.log(req.headers);

  // body???

  let body = '';
  req.on('data', (chunk) => {
  let test = chunk.toString()
    body += chunk;
  });
// let urlRequest = `./public`
  req.on('end', () => {
    getHandler(req,res)
  //   if(req.url === `/` || req.url === `/index.html`){
  //   fs.readFile(`./public/index.html`,function (err,data) {
  //     if (err){
  //       return console.log('could not read the file')
  //     }
      
  //     res.writeHead(200, {
  //       'content-type': 'text/html',
  //       'content-length': data.length,
  //     });
  //     res.write(data.toString())
  //     res.end();
  //   });
  // }
  // });
});
})
server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
function getHandler(req,res) {
  if(req.url === `/` || req.url === `/index.html`){
    fs.readFile(`./public/index.html`, function (err,data) {
      if(err){
        getHandler(data, `./public/404.html`)
      }else{
        res.writeHead(200,{
          'content-type': 'text/html',
          'content-length': data.length,
        })
        res.write(data.toString())
        res.end()
      }
    })
  }else if (req.url === `/css/styles.css`){
    fs.readFile(`./public/css/styles.css`,function (err,data) {
      if(err){
        getHandler(data,`./public/404.html`)
      }else{
        res.writeHead(200,{
          'content-type': 'text/css',
          'content-length': data.length,
        })
        res.write(data.toString())
        res.end()
      }
    })
  }else{
    fs.readFile(`./public${req.url}`,function (err,data) {
      if(err){
        getHandler(data,`./public/404.html`)
      }else{
        res.writeHead(200,{
          'content-type': 'text/html',
          'content-length': data.length,
        })
        res.write(data.toString())
        res.end()
      }
    })
  }
}


// fs.readFile('./test.txt', (err, data) => {
  //   if (err) {
  //     return console.log('could not write the file');
  //   }
  //   console.log(data);
  // });

// req.on('end', () => {
// //  figure out newElement.html string data
//  // using the contents of the request

//   // write the newElement.html file
//   fs.writeFile('./newElement.html', (err, data) => {
//     if (err) {
//       return console.log(err);
//     }

//     // read contents of the public dir
//     fs.readdir('./', (err, dir) => {
//       if (err) {
//         return console.log(err);
//       }

//       // figure out new index.html
//       const index = '<html></html>';

//       // write new index.html
//       fs.writeFile('./index.html', index, (err) => {
//         if (err) {
//           return console.log(err);
//         }

//         res.end();
//       });
//     });
//   });
// });
