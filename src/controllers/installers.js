const express = require('express');
const app = express();
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
          return res.status(201).send('Sucesso');
        }
        console.log(stderr);

        return res.status(401).send('Encontramos um erro', stderr.toString());
      })();
    } else {
      if (stderr) {
        res.status(401).send('Ocorreu algum erro....', stderr);
      }
      res.status(201).send('Sucesso!');
    }
  })();
});

app.post('/node/react', async (req, res) => {
  const { url, port, github, script, ssl } = req.body;

  (async () => {
    const { stdout, stderr } = await execa.command(
      `wo site create ${url} --proxy=0.0.0.0:${port} ${
        ssl ? '--letsencrypt --force' : ''
      }`,
    );
    if (stderr) {
      res.send('Ocorreu um erro. Essa porta/site já está em uso?');
      return 0;
    }
    (async () => {
      const { stdout, stderr } = await execa.command(
        `git clone ${github} /var/www/${url}/htdocs --progress`,
      );
      if (stdout) {
        res.send(`Não encontramos erros! Abra ${url} e veja como está!`);
      }
      if (stderr) {
        await execa.command(`npm i --prefix /var/www/${url}/htdocs`);
        await execa.command(
          `forever start -p /var/www/${url}/htdocs ${script}`,
        );
        res.send(stderr.toString());
      }
    })();
  })();
});

module.exports = app;
