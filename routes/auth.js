const express=require("express")
const router=express.Router()
const User=require('../models/User')
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerSchema = Joi.object({

    name:Joi.string().required().min(3).max(255),
    email:Joi.string().email().required().min(6).max(255),
    password:Joi.string().required().min(6).max(255) 

})

const loginSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
})

router.post('/register',(req,res)=>{

    const{error}=registerSchema.validate(req.body) 
    if(error)
    {
        res.status(400).send(error.details[0].message) 
        return;
    }
    const salt=bcrypt.genSaltSync(10)
    const hash=bcrypt.hashSync(req.body.password,salt)
    const user=new User({...req.body,password:hash})
    user
    .save()
    .then((user)=>{
       
        const token=jwt.sign({_id:user._id},process.env.JWT_CODE)
        res.header("Authforization",token).json({accessToken:token})
    })
    .catch((err)=>{res.json(err)})
})



router.post('/login',(req,res)=>{

    const{error}=loginSchema.validate(req.body) 
    if(error)
    {
        res.status(400).send(error.details[0].message) 
        return;
    }


    const{email,password}=req.body
    User.findOne({email})
    .then((user)=>{
        if(!user){res.send("email yanlis")}

        const isValid=bcrypt.compareSync(password,user.password)

        if(!isValid){res.send("sifre yanlis")}
        
        const token=jwt.sign({_id:user._id},process.env.JWT_CODE)
        res.header("Authforization",token).json({accessToken:token})
    })
    .catch((err)=>{
        res.status(400).send("errrorrrr")
    })

})


module.exports=router