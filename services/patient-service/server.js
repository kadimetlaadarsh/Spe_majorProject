require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4100;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Patient service running on ${PORT}`);
  });
});
