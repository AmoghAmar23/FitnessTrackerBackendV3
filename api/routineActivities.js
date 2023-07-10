const JWT=require("jsonwebtoken")
const express = require('express');
const router = express.Router();
const {updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById } = require("../db/routine_activities.js")
const {getRoutineById } = require("../db/routines.js")

// PATCH /api/routine_activities/:routineActivityId
router.patch ("/:routineActivityId", async(req,res)=>{
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
    const existingRoutineActivity = await getRoutineActivityById(req.params.routineActivityId)
    const existingRoutine = await getRoutineById(existingRoutineActivity.routineId)

    if (existingRoutine.creatorId != decoded.id){
        res.status(403).json({"message":`User ${decoded.username} is not allowed to update ${existingRoutine.name}` , error:"Invalid Credentials", name: "Invalid Username"})
        return
    } 
    const updatedRoutineActivity = await updateRoutineActivity({id:req.params.routineActivityId, count:req.body.count, duration:req.body.duration})
    res.json(updatedRoutineActivity)

})

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async(req,res)=>{
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
    const existingRoutineActivity = await getRoutineActivityById(req.params.routineActivityId)
    const existingRoutine = await getRoutineById(existingRoutineActivity.routineId)
    if (existingRoutine.creatorId != decoded.id){
        res.status(403).json({"message":`User ${decoded.username} is not allowed to delete ${existingRoutine.name}` , error:"Invalid Credentials", name: "Invalid Username"})
        return
    }
    const deletedRoutineActivity = await destroyRoutineActivity(req.params.routineActivityId)
    res.json(deletedRoutineActivity)
})


module.exports = router;
