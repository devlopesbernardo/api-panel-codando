const { json } = require('body-parser');
//const { exec } = require('child_process');
const express = require('express');
const router = express.Router();
const app = express();
const util = require('util');
const { spawn } = require('child_process');

app.use(express.json());

async function generatessl(url) {
  const { stdout, stderr } = await spawn(`wo site update ${url} --le --force`);
  if (stderr) {
    return console.log(stderr.toString());
  }
  return console.log(stdout.toString());
}

app.post('/wp', async (req, res) => {
  const { url, passwordAdmin, userAdmin, ssl, email } = req.body;

  const woCreate = spawn('wo', [
    'site',
    'create',
    `${url}`,
    '--wpfc',
    `--user=${userAdmin}`,
    `--pass=${passwordAdmin}`,
    `${ssl ? '--letsencrypt ' : ''}`,
    `--email=${email}`,
  ]);
  woCreate.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  woCreate.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

  woCreate.on('exit', (code) => {
    console.log(`child process exited with code ${code}`);
  });

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
