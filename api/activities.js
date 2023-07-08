const express = require('express');
const router = express.Router();
const {createActivity, getAllActivities,getPublicRoutinesByActivity,updateActivity} = require("../db")
const JWT=require("jsonwebtoken")


// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async(req,res)=>{
    const routines = await getPublicRoutinesByActivity(req.params.activityId)
    res.json(routines)
})

// GET /api/activities
router.get("/", async(req,res)=>{
    const activities = await getAllActivities()
    res.json(activities)
})


// POST /api/activities
router.post("/",async(req,res)=>{
    const auth = req.headers.authorization
    //auth =  "Bearer asjdkledkajfgkleakl"
    const token = auth ? auth.split(" ")[1] : null
    if (!token) {
        throw new Error("You are not logged in")
    }
    const decoded = JWT.verify(token, "secretKey")
    if (!decoded) {
        throw new Error("Invalid credentials")
    }
    try{
        const newActivity = await createActivity(req.body)
        res.json(newActivity)
    } catch(error){
        res.status(500).json(error)
    }
})

// PATCH /api/activities/:activityId
router.patch("/:activityId", async(req,res)=>{
    const auth = req.headers.authorization
    //auth =  "Bearer asjdkledkajfgkleakl"
    const token = auth ? auth.split(" ")[1] : null
    if (!token) {
        throw new Error("You are not logged in")
    }
    const decoded = JWT.verify(token, "secretKey")
    if (!decoded) {
        throw new Error("Invalid credentials")
    }

    try{
        const updatedActivity = await updateActivity({id:req.params.activityId,name:req.body.name,description:req.body.description})
        res.json(updatedActivity)
    } catch(error){
        res.status(500).json(error)
    }
})

module.exports = router;
