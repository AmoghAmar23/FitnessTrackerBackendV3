const JWT=require("jsonwebtoken")
const express = require('express');
const router = express.Router();
const {getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineById} = require("../db/routines.js") 
const {addActivityToRoutine, getRoutineActivityById} = require("../db/routine_activities.js")

// GET /api/routines
router.get("/", async(req,res)=>{
    const routines = await getAllPublicRoutines()
    res.json(routines)
})

// POST /api/routines
router.post("/", async(req,res)=>{
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
    const newRoutine = await createRoutine({creatorId:decoded.id, isPublic:req.body.isPublic, name:req.body.name, goal:req.body.goal})
    res.json(newRoutine)
})

// PATCH /api/routines/:routineId
router.patch("/:routineId", async(req,res)=>{
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
    const existingRoutine = await getRoutineById(req.params.routineId)
    if (existingRoutine.creatorId != decoded.id){
        res.status(403).json({"message":`User ${decoded.username} is not allowed to update ${existingRoutine.name}` , error:"Invalid Credentials", name: "Invalid Username"})
        return
    } 
    const updatedRoutine = await updateRoutine({id:req.params.routineId, isPublic:req.body.isPublic, name:req.body.name, goal:req.body.goal})
    res.json(updatedRoutine)
})

// DELETE /api/routines/:routineId
router.delete("/:routineId", async(req,res)=>{
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
    const existingRoutine = await getRoutineById(req.params.routineId)
    if (existingRoutine.creatorId != decoded.id){
        res.status(403).json({"message":`User ${decoded.username} is not allowed to delete ${existingRoutine.name}` , error:"Invalid Credentials", name: "Invalid Username"})
        return
    }     await destroyRoutine(req.params.routineId)
    res.json(existingRoutine)
})

// POST /api/routines/:routineId/activities

router.post("/:routineId/activities", async(req,res)=>{
    // const routineActivityExists = await a
    const addedActivity = await addActivityToRoutine({routineId:req.params.routineId, activityId:req.body.activityId, count:req.body.count, duration:req.body.duration})
    res.json(addedActivity)
})

module.exports = router;
