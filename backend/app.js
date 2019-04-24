const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path')

const postsRoute=require('./routes/posts');
const userRoute=require('./routes/user');

const app=express();

mongoose.connect("mongodb+srv://atom:DxPOsp9AdT86OQHt@cluster0-erbb6.mongodb.net/node-angular?retryWrites=true",{useNewUrlParser: true})
.then(()=>{
  console.log('Connected to Database')
})
.catch(()=>{
  console.log('Failed to connect to database')
});


app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader('Access-Control-Allow-Methods',"GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
});

app.use('/api/posts',postsRoute);
app.use('/api/user',userRoute);

module.exports=app;
