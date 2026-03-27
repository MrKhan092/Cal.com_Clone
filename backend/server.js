require('dotenv').config();
const express = require('express');
const cors = require('cors');


const eventRoutes = require('./routes/eventRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/event-types', eventRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);



app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
