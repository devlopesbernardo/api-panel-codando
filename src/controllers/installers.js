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
    const { out, err } = await execa.command(
      `wo site update ${url} --le --force`,
    );
    if (!err) {
      return res.send('SSL ativado!');
    }
    return res.send('Encontramos um erro', err.toString());
    return console.log(stdout.toString());
    //console.log(stdout);
    //console.log(stderr);
  })();
  //await generatessl(url);

  // exec(
  //   `wo site create ${url} --wpfc --user=${userAdmin} --pass=${passwordAdmin} ${
  //     ssl ? '--letsencrypt ' : ''
  //   } --email=${email}`,
  //   (error, stdout, stderr) => {
  //     if (error) {
  //       console.log(`error: ${error.message}`);
  //       return;
  //     }
  //     if (stderr) {
  //       console.log(`stderr: ${stderr}`);
  //       return;
  //     }
  //     console.log(stdout);
  //     exec(`wo site update ${url} --le`, (error, stdout, stderr) => {
  //       if (error) {
  //         console.log(`error: ${error.message}`);
  //         return;
  //       }
  //       if (stderr) {
  //         console.log(`stderr: ${stderr}`);
  //         return;
  //       }
  //       console.log(stdout);
  //     });
  //   },
  // );
  res.status(200).send('Deu certo!');
});

module.exports = app;
