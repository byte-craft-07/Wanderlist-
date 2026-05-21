function asyncWrape(fn){
  return function(req,res,next){
    fn(req,res,next).catch((err)=>{
      next(err);
    }
  )}
}
module.exports= asyncWrape;
//Error Handler using function this is the best method