const express=require("express");
const router=express.Router();


router.get("/",(req,res)=>{
    res.send("get for post route ")
})
// show post
router.get("/:id",(req,res)=>{
    res.send("get for show post id ")
})
// post - post
router.post("/",(req,res)=>{
    res.send("post for post ")
})
router.delete("/:id",(req,res)=>{
    res.send("delete for post id  ")
})
module.exports=router;