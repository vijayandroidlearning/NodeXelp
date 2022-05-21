const app = require('express')();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

const uploadFile = (req, filePath) => {
 return new Promise((resolve, reject) => {
  const stream = fs.createWriteStream(filePath);
  stream.on('open', () => {
   console.log('Streaming started---------->  0.00%');
   req.pipe(stream);
  });

  stream.on('drain', () => {
   const written = parseInt(stream.bytesWritten);
   const total = parseInt(req.headers['content-length']);
   const pWritten = ((written / total) * 100).toFixed(2);
   console.log(`Stream Processing------->  ${pWritten}% done`);
  });

  stream.on('close', () => {
   console.log('Stream Processing---------->  100%');
   resolve(filePath);
  });
  stream.on('error', err => {
   console.error(err);
   reject(err);
  });
 });
};

app.get('/', (req, res) => {
 res.status(200).send(`Server up and running`);
});

app.post('/stream', (req, res) => {

    var mime=req.headers['content-type']
    console.log(mime);
    var ext=mime.split("/");

    const filePath = path.join(__dirname, `/file`+Date.now()+`.`+ext[1]);
    uploadFile(req, filePath)
    .then(path => res.send({ status: 'success', path }))
    .catch(err => res.send({ status: 'error', err }));
    });

app.listen(port, () => {
 console.log('Server running at http://127.0.0.1:3000/');
});