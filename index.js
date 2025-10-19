const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const adventurersRoutes = require('./routes/adventurers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use('/adventurers', adventurersRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${PORT}/docs`);
});