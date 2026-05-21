const express=require("express");
const router=express.Router();


// index - user
router.get("/",(req,res)=>{
    res.send("get for index route ")
})
// show user
router.get("/:id",(req,res)=>{
    res.send("get for show users id ")
})
// post -users
router.post("/",(req,res)=>{
    res.send("post for users ")
})
router.delete("/:id",(req,res)=>{
    res.send("delete for user id  ")
});

module.exports=router;