require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');
const app = express();

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3000

// var corsOptions = {
//     origin: ['http://localhost:9000', 'http://example.com'],
//     optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', authRoute);
app.use('/api/products', productRoute);

app.get("/", (req, res) => {
    res.send("hello api");
});

app.use('/test', async (req, res) => {
    res.send("Test route");
});

app.use(errorMiddleware);

mongoose.set('strictQuery', false);
mongoose
    .connect(MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Node API running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
