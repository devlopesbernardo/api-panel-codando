const express = require('express');
const app = express();
const port = 3000;

var installers = require('./src/controllers/installers');

app.use('/installers', installers);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
