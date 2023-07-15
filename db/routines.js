const client = require("./client");
const {getUserByUsername}= require("./users")

async function createRoutine({ creatorId, isPublic, name, goal }) 
{  
  const {rows:[newRoutine]} = await client.query (
    `INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1,$2,$3,$4)
    RETURNING *; `, [creatorId, isPublic, name, goal]);

    return newRoutine;
}

async function getRoutineById(id) {
  const {rows:[routine]} = await client.query (
    `SELECT * FROM routines
    WHERE id = ${id}`
  )
  return routine;
}

async function getRoutinesWithoutActivities(){
const { rows } = await client.query ( 
`SELECT * FROM routines;`
)
return rows;
} 

//join the activity
/*    `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",
    a.name,a.description, ra.count, ra.duration
   FROM "routines" r 
   JOIN routineactivities ra 
   ON r.id = ra."routineId"
   JOIN activities a
   ON ra."activityId" = a.id;`*/

async function getAllRoutines() {
  const result = await client.query ( 
    `SELECT r.id, r."creatorId", r."isPublic", r."name", r.goal, u.username as "creatorName"            
    FROM "routines" r
    INNER JOIN "users" u
    ON u."id" = r."creatorId";`);

  const routines = result.rows;

    for (let i = 0; i < routines.length; i++) 
    {
      const routine = routines[i];
  
      // Fetch activity rows for each parent
      const routineactivityQuery = `
        SELECT a.id, a.name, a.description, ra.duration, ra.count,
        ra."routineId", ra."id" as "routineActivityId"
        FROM routineactivities ra
        INNER JOIN activities a
        ON a."id" = ra."activityId"
        WHERE ra."routineId" = $1
        `;
      const childResult = await client.query(routineactivityQuery, [routine.id]);
      const children = childResult.rows;
  
      // Add children to parent as a separate attribute
      routine.activities = children;
  
      routines[i] = routine;
    }    
    return routines;
}
/* original */
/*
async function getAllPublicRoutines() {
  console.log("getAllPublicRoutines called...");

  const { rows } = await client.query ( 
  `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",
  a.name,a.description, ra.count, ra.duration
 FROM "routines" r 
 JOIN routineactivities ra 
 ON r.id = ra."routineId"
 JOIN activities a
 ON ra."activityId" = a.id
 where r."isPublic" = True;`
  )

  return rows;
}
*/

// Return activity as separate attribute
async function getAllPublicRoutines() {
  // console.log("getAllPublicRoutines called...");

  const result = await client.query ( 
  `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",u.username as "creatorName"
   FROM "routines" r
   INNER JOIN "users" u
   ON u."id" = r."creatorId"   
   WHERE r."isPublic" = True;`
  )

  const routines = result.rows;
  
  for (let i = 0; i < routines.length; i++) 
  {
    const routine = routines[i];

    // Fetch activity rows for each parent
    const routineactivityQuery = `
      SELECT a.id, a.name, a.description,ra.duration, ra.count,
      ra."routineId", ra."id" as "routineActivityId"
      FROM routineactivities ra
      INNER JOIN activities a
      ON a."id" = ra."activityId"
      WHERE ra."routineId" = $1
      `;
    const childResult = await client.query(routineactivityQuery, [routine.id]);
    const children = childResult.rows;

    // Add children to parent as a separate attribute
    routine.activities = children;

    routines[i] = routine;
  }

  return routines;
}

async function getAllRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);
  const { rows } = await client.query ( 
    `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",u.username as "creatorName"
   FROM "routines" r 
   INNER JOIN "users" u
   ON u."id" = r."creatorId" 
   where r."creatorId"= $1;`, [user.id]);

   for (let i = 0; i < rows.length; i++) 
   {
     const routine = rows[i];
 
     // Fetch activity rows for each parent
     const routineactivityQuery = `
       SELECT a.id, a.name, a.description,ra.duration, ra.count,
       ra."routineId", ra."id" as "routineActivityId"
       FROM routineactivities ra
       INNER JOIN activities a
       ON a."id" = ra."activityId"
       WHERE ra."routineId" = $1
       `;
     const childResult = await client.query(routineactivityQuery, [routine.id]);
     const children = childResult.rows;
 
     // Add children to parent as a separate attribute
     routine.activities = children;
 
     rows[i] = routine;
   }

    return rows;
}

async function getPublicRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);
  const { rows } = await client.query ( 
   `SELECT r.id,r.name,r.goal,r."isPublic",r."creatorId",u.username as "creatorName"
    FROM "routines" r 
    INNER JOIN "users" u
    ON u."id" = r."creatorId" 
    where r."isPublic" = True  
    and r."creatorId"= $1;`, [user.id]);

    for (let i = 0; i < rows.length; i++) 
    {
      const routine = rows[i];
  
      //         ra."routineId", ra."id" as "routineActivityId"
      // Fetch activity rows for each parent
      const routineactivityQuery = `
        SELECT a.id, a.name, a.description,ra.duration, ra.count,
        ra."routineId", ra."id" as "routineActivityId"
        FROM routineactivities ra
        INNER JOIN activities a
        ON a."id" = ra."activityId"
        WHERE ra."routineId" = $1
        `;
      const childResult = await client.query(routineactivityQuery, [routine.id]);
      const children = childResult.rows;
  
      // Add children to parent as a separate attribute
      routine.activities = children;
  
      rows[i] = routine;
    }

  return rows;
}

async function getPublicRoutinesByActivity({ id }) {
  const { rows } = await client.query ( 
    `SELECT distinct r.id,r.name,r.goal,r."isPublic",r."creatorId",u.username as "creatorName"
    FROM routines r 
    JOIN routineactivities ra 
    ON r.id = ra."routineId"
    JOIN activities a
    ON ra."activityId" = a.id
    INNER JOIN "users" u
    ON u."id" = r."creatorId" 
    WHERE a.id= $1
    AND r."isPublic" = true;`, [id]);

    for (let i = 0; i < rows.length; i++) 
    {
      const routine = rows[i];
  
      // Fetch activity rows for each parent
      const routineactivityQuery = `
        SELECT a.id, a.name, a.description,ra.duration, ra.count,
        ra."routineId", ra."id" as "routineActivityId"
        FROM routineactivities ra
        INNER JOIN activities a
        ON a."id" = ra."activityId"
        WHERE ra."routineId" = $1
        `;
      const childResult = await client.query(routineactivityQuery, [routine.id]);
      const children = childResult.rows;
  
      // Add children to parent as a separate attribute
      routine.activities = children;
  
      rows[i] = routine;
    }

    return rows;
}

async function updateRoutine({ id, isPublic, name, goal }) {
  if ((typeof isPublic === "boolean") && name && goal)
  {
    await client.query(
      `UPDATE routines 
      SET name=$2, goal= $3, "isPublic"=$4
      WHERE id = $1;`,[id,name,goal,isPublic]);
  }
  else 
  {
    if (!isPublic && !goal && name)
    {
      await client.query(
        `UPDATE routines 
        SET name=$2
        WHERE id = $1;`,[id,name]);      
    }
  }

  const {rows:[routine]} = await client.query (
    `SELECT * FROM routines
    WHERE id = ${id}`
  )
  return routine;
}

async function destroyRoutine(id) {
  await client.query(
    `DELETE from routineactivities
    WHERE "routineId" = $1;`,[id]);

  await client.query(
    `DELETE from routines
    WHERE id = $1;`, [id] );

}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
