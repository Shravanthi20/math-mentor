const express= require("express");
const connect_db= require("./config/db.js");
const userRoutes= require("./routes/userRoutes.js")
const questionRoutes= require("./routes/questionRoutes.js")

const app= express();
app.use(express.json());
connect_db();

app.use("api/users",userRoutes);
app.use("app/questions",questionRoutes);

// add middleware for password hashing
connect_db().then(()=>{
    app.listen(3000,()=>{
    console.log("Backend Started, Server listening on port 3000");
    console.log("http://localhost:3000");
});
});