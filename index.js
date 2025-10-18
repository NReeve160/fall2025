const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbController');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
const adventurerRoutes = require('./routes/adventurers');
app.use('/adventurers', adventurerRoutes);

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
