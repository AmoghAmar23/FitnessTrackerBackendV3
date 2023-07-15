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
        const token = JWT.sign({id:user.id, username:user.username},"neverTell")
        res.json({"message": "you're logged in!", "user":{id:user.id,username:user.username}, token})
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
        // res.statusCode=401
        // throw new Error("You are not logged in")
        res.status(401).json({"message":"You must be logged in to perform this action", error:"Invalid Credentials", name: "Invalid Username"})
        return
    }
    const decoded = JWT.verify(token, "neverTell")
    if (!decoded){
        // res.statusCode=401
        // throw new Error("Invalid Credentials")
        res.status(401).json({"message":"invalid credentials"})
        return
    }

    try{
        const user = await getUserByUsername(decoded.username)
        res.json(user)
    } catch(error){
        res.status(res.statusCode===401 ? res.statusCode : 500).json(error)
    }
})

// GET /api/users/:username/routines
router.get("/:username/routines",async(req,res)=>{
    const auth = req.headers.authorization
    const token = auth ? auth.split(" ")[1] : null
    if (!token) {
        res.status(401).json({"message":"You must be logged in to perform this action", error:"Invalid Credentials", name: "Invalid Username"})
        return 
    }
    const decoded = JWT.verify(token, "neverTell")
    if (!decoded) {
        res.status(401).json({"message":"You must be logged in to perform this action", error:"Invalid Credentials", name: "Invalid Username"})
        return 
    }
    try{
        const routines = await getPublicRoutinesByUser(decoded.username)
        console.log("======from get method=======",routines)
        res.json(routines)
    } catch(error){
        res.status(500).json(error)
    }
})

module.exports = router;
