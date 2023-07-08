const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {rows:[routineActivity] } = await client.query(
    `INSERT INTO routineactivities ("routineId", "activityId", count, duration) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;`, [routineId, activityId, count, duration]
  );

  return routineActivity;
}

async function getRoutineActivityById(id) {

  const {rows:[routineActivity]} = await client.query(
    `SELECT * FROM routineactivities 
    WHERE id = $1;`, [id]);

    return routineActivity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const {rows} = await client.query(
    `SELECT * FROM routineactivities 
    WHERE "routineId" = $1;`, [id]);

    return rows;
}

async function updateRoutineActivity({ id, count, duration }) {
  const {rows:[routineActivity]} = await client.query(
    `UPDATE routineactivities 
    SET "count"=$2, duration= $3
    WHERE id = $1
    RETURNING *;`, [id, count, duration]);
  return routineActivity;
}

async function destroyRoutineActivity(id) {
  const {rows:[result]} = await client.query(
    `DELETE from routineactivities
    WHERE id = $1
    RETURNING *;`, [id]);

  return result;
}

async function canEditRoutineActivity(routineActivityId, userId) {  
  const {rows} = await client.query(
    `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",
    a.name,a.description, ra.count, ra.duration
   FROM "routines" r 
   JOIN routineactivities ra 
   ON r.id = ra."routineId"
   JOIN activities a
   ON ra."activityId" = a.id
   where ra.id = $1
   and r."creatorId" = $2;`, [routineActivityId, userId]);

  return rows.length > 0;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
