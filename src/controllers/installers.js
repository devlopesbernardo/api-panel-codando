const { json } = require('body-parser');
const { exec } = require('child_process');
const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json());

app.post('/wp', (req, res) => {
  const { url, passwordAdmin, userAdmin, ssl, email } = req.body;

  exec(
    `wo site create ${url} --wpfc --user=${userAdmin} --pass=${passwordAdmin} ${
      ssl ? '--letsencrypt ' : ''
    } --email=${email}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
  res.status(200).send('Deu certo!');
});

module.exports = app;
