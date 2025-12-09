require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 4300;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Appointment service listening on ${PORT}`);
  });
});
