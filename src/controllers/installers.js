const { json } = require('body-parser');
//const { exec } = require('child_process');
const express = require('express');
const router = express.Router();
const app = express();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.use(express.json());

app.post('/wp', async (req, res) => {
  const { url, passwordAdmin, userAdmin, ssl, email } = req.body;

  const { stdout, stderr } = await exec(
    `wo site create ${url} --wpfc --user=${userAdmin} --pass=${passwordAdmin} ${
      ssl ? '--letsencrypt ' : ''
    } --email=${email}`,
  );
  if (!stderr) {
    res.send(stdout);
    const { out, err } = await exec(`wo site update ${url} --le`);
    if (!err) {
      console.log(out);
    }
  }
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
  // res.status(200).send('Deu certo!');
});

module.exports = app;
