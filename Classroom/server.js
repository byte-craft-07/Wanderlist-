const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const cookieParser = require('cookie-parser')
const flash = require("connect-flash");
app.use(cookieParser("secretcode"));
const session= require("express-session");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOptions=
{secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());




app.get("/reqcount",(req,res)=>{
  if(req.session.count){
    req.session.count++;
  }
  else{
     req.session.count=1;
  }
  
  res.send(`you sent a request ${req.session.count} times`)
})
app.use((req,res,next)=>{
   res.locals.successMsg = req.flash("success");
  res.locals.errorMsg =req.flash("error");
  next();
})

app.get("/ragister",(req,res)=>{
  let {name="anonmous"}=req.query;
  req.session.name=name;
  if(name === "anonmous"){
    req.flash("error","user ragister Unsuccesfully");
  }
  else{
      req.flash("success","user ragister succesfully");
  }
  
  res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
  // res.locals.successMsg = req.flash("success");
  // res.locals.errorMsg =req.flash("error");
  res.render("page",{name: req.session.name, msg: req.flash("success")});
});

// app.get("/test",(req,res)=>{
//   res.send("test seccesful");
// })


// app.get("/getcookies",(req,res)=>{
//   res.cookie("greet","hello");
//   res.cookie("madein","india");
//   res.send(" Send you are some cookies");
// })

// app.get("/getsignedcookie",(req,res)=>{
//   res.cookie("made-in","india",{ signed: true});
//   res.send("signed cookie sent ")
// })

// app.get("/verify",(req,res)=>{
//    console.log(req.signedCookies);
//    res.send("verified");
// })

// // Uses of cookies
// app.get("/greet",(req,res)=>{
//   let {name ="anonmous"}=req.cookies;
//   res.send(`Hi ${name}`);
  
// })

// app.get("/",(req,res)=>{
//   console.dir(req.cookies);
//   res.send("Hi am root");
// });
// app.use("/users",users);// routes se common part nikalne ke liye => /users
// app.use("/posts",posts);

// index - user
// app.get("/users",(req,res)=>{
//     res.send("get for index route ")
// })
// // show user
// app.get("/users/:id",(req,res)=>{
//     res.send("get for show users id ")
// })
// // post -users
// app.post("/users",(req,res)=>{
//     res.send("post for users ")
// })
// app.delete("/users/:id",(req,res)=>{
//     res.send("delete for user id  ")
// })

// index - post

// app.get("/posts",(req,res)=>{
//     res.send("get for post route ")
// })
// // show post
// app.get("/posts/:id",(req,res)=>{
//     res.send("get for show post id ")
// })
// // post - post
// app.post("/posts",(req,res)=>{
//     res.send("post for post ")
// })
// app.delete("/posts/:id",(req,res)=>{
//     res.send("delete for post id  ")
// })
if (require.main === module) {
  app.listen(3000,()=>{
       console.log("server is working to 3000")
  });
}

module.exports = app;
