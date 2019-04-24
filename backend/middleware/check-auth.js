const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
  try{
    const token=req.headers.authorization.split(" ")[1];
    //console.log(token)
    const decodedToken=jwt.verify(token,"some_secret_that_is_long");
    req.userData = {email:decodedToken.email, userId: decodedToken.userId}
    next();
  } catch(error){
    res.status(401).json({
      message:'Authentication failed'
    })
  }
}
