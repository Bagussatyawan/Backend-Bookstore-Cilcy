require('dotenv').config();
const express = require('express');
// const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();


const PORT = process.env.PORT || 6969

const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
const transactionRouter = require('./routers/transactionRouter');
const orderRouter = require('./routers/orderRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/thumbnails', express.static(__dirname + '/Upload_thumbnail/'));



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/order', orderRouter);


//ERROR HANDLING 
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    return res.status(status).json({
        message: status !== 500 ? error.message : "Internal server error",
    });
});


app.listen(PORT, () => {
    console.log(`Succes running server on port ${PORT}`)
});