
const cors = require('cors');
const express = require('express');
const app = express();
const bodyparser = require('body-parser')
require('dotenv').config();
const { MongoClient } = require('mongodb');

app.use(cors({ origin: 'https://bespoke-cucurucho-32bb1e.netlify.app/' }));
const URL = process.env.URL;
const PORT = process.env.PORT;

const authRouter = require('./router/auth')
const customerRouter = require('./router/customer')
const ordersRouter = require('./router/orders')
const productRouter = require('./router/products')
const salesRouter = require('./router/sales')
const tasksRouter = require('./router/tasks')
const ticketsRouter = require('./router/tickets')
const userlistRouter = require('./router/userlist')
const profileRouter = require('./router/profile')
app.use(bodyparser.json())

app.use('/auth',authRouter)
app.use('/customer', customerRouter)
app.use('/orders', ordersRouter)
app.use('/products', productRouter)
app.use('/sales', salesRouter)
app.use('/tasks', tasksRouter)
app.use('/tickets', ticketsRouter)
app.use('/userlist',userlistRouter)
app.use('/profile',profileRouter)

app.get('/',(req,res)=>{
    res.json(`Hello`);
    })
app.listen(PORT, ()=>{
    console.log(`server is running in ${PORT}`)});