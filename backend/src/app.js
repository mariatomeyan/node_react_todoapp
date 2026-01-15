const express = require('express');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({message: 'TODO API is running:'});
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
})