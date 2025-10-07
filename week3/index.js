const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

app.use('/app-swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'));

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
