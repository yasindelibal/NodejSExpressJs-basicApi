const express=require('express')
const productRoutes=require('./routes/product')
const mongoose=require('mongoose')
require("dotenv/config")
const bodyParser=require("body-parser")
const cors=require("cors")
const authRoutes=require('./routes/auth')


const app=express()

app.use(bodyParser.json())
app.use(cors())
mongoose.connect(`mongodb+srv://test:${process.env.PASSWORD}@cluster0.absoj.mongodb.net/?retryWrites=true&w=majority`,
(e)=>{
    if(e){
        console.log(e)
    }
    else{
        console.log("database connected")
    }
})

app.use('/auth',authRoutes)
app.use('/product',productRoutes)



app.listen(3001)