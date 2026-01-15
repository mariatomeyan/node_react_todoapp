const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'TODO API is running:'});
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
})