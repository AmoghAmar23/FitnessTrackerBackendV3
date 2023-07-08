/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {createUser,getUser, getUserByUsername, getPublicRoutinesByUser} = require("../db")
const JWT=require("jsonwebtoken")

// POST /api/users/register
router.post("/register",async(req,res)=>{
    try{
        const newUser = await createUser(req.body);
        const token = JWT.sign({id:newUser.id, username:newUser.username},"secretKey")
        
        res.json({
            message: "Registration complete!",
            token: token,
            user: newUser
        })
    } catch(error){
        res.status(500).json({
            error: error.message,
            message: error.message,
            name: error.name
        })
    }
})

// POST /api/users/login
router.post("/login",async(req,res)=>{
    try{
        const user = await getUser(req.body)
        const token = JWT.sign({id:user.id, username:user.username},"secretKey")
        res.json({token})
    } catch(error){
        res.status(500).json(error)
    }
})

// GET /api/users/me
router.get("/me",async(req,res)=>{
    const auth = req.headers.authorization
    //auth =  "Bearer asjdkledkajfgkleakl"
    const token = auth ? auth.split(" ")[1] : null
    if (!token) {
        throw new Error("You are not logged in")
    }
    const decoded = JWT.verify(token, "secretKey")

    try{
        const user = await getUserByUsername(decoded.username)
        res.json(user)
    } catch(error){
        res.status(500).json(error)
    }
})

// GET /api/users/:username/routines
router.get("/:username/routines",async(req,res)=>{
    const auth = req.headers.authorization
    const token = auth ? auth.split(" ")[1] : null
    if (!token) {
        throw new Error("You are not logged in")
    }
    const decoded = JWT.verify(token, "secretKey")

    try{
        const routines = await getPublicRoutinesByUser(decoded.username)
        res.json(routines)
    } catch(error){
        res.status(500).json(error)
    }
})

module.exports = router;
