require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const productRoute = require("./routes/productRoute")
const app = express()
const errorMiddleware = require('./middleware/errorMiddleware')
var cors = require('cors')

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT

var corsOptions = {
    origin: ['http://localhost:9000', 'http://example.com'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/products', productRoute)

app.get("/", (req, res) => {
    res.send("hello api")
})

app.get("/blog", (req, res) => {
    res.send("hello blog");
})

app.use(errorMiddleware)

mongoose.set('strictQuery', false)
mongoose
    .connect(
        MONGO_URL
    )
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Node API running in port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })
