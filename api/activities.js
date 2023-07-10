const express = require('express');
const router = express.Router();
const {createActivity, getAllActivities,getPublicRoutinesByActivity,updateActivity, getActivityById} = require("../db")
const JWT=require("jsonwebtoken")


// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async(req,res)=>{
    const activityExists = await getActivityById(req.params.activityId)
    if (!activityExists) {
     res.status(500).json({error: "Invalid Activity", message: `Activity ${req.params.activityId} not found`, name: "Invalid Name"})
     return
    }
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
        res.status(401).json({"message":"You must be logged in to perform this action", error:"Invalid Credentials", name: "Invalid Username"})
        return 
    }
    const decoded = JWT.verify(token, "neverTell")
    if (!decoded) {
        res.status(401).json({"message":"You must be logged in to perform this action", error:"Invalid Credentials", name: "Invalid Username"})
        return 
    }
    try{
        const newActivity = await createActivity(req.body)
        res.json(newActivity)
    } catch(error){
        res.status(500).json({error: "Invalid Activity", message: `An activity with name ${req.body.name} already exists`, name: "Invalid Name"})
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
    const decoded = JWT.verify(token, "neverTell")
    if (!decoded) {
        throw new Error("Invalid credentials")
    }

    try{
        const activityExists = await getActivityById(req.params.activityId)
        if (!activityExists) {
         res.status(500).json({error: "Invalid Activity", message: `Activity ${req.params.activityId} not found`, name: "Invalid Name"})
         return
        }
        const updatedActivity = await updateActivity({id:req.params.activityId,name:req.body.name,description:req.body.description})
        res.json(updatedActivity)
    } catch(error){
        res.status(500).json({error: "Invalid Activity", message: `An activity with name ${req.body.name} already exists`, name: "Invalid Name"})
    }
})

module.exports = router;
