const { json } = require('body-parser');
//const { exec } = require('child_process');
const express = require('express');
const router = express.Router();
const app = express();
const util = require('util');
const execa = require('execa');

app.use(express.json());

app.post('/wp', async (req, res) => {
  const { url, passwordAdmin, userAdmin, ssl, email } = req.body;

  (async () => {
    const { stdout, stderr } = await execa.command(
      `wo site create ${url} --wpfc --user=${userAdmin} --pass=${passwordAdmin} ${
        ssl ? '--letsencrypt ' : ''
      } --email=${email}`,
    );
    console.log('Vim do início', stderr);
    console.log('Vin do início e sou o stdout', stdout);
    if (ssl) {
      (async () => {
        const { stdout, stderr } = await execa.command(
          `wo site update ${url} --le --force`,
        );
        if (!stderr) {
          console.log('Vim do meio e sou o stdout', stdout);
        }
        console.log(stderr);

        return res.send('Encontramos um erro', stderr.toString());
      })();
    } else {
      res.status(201).send('Sucesso!');
    }
  })();
});

module.exports = app;
