const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const port =5000;

//middleware
app.use(express.json())
app.use('/me',(req, resp, next)=>{
    // console.log(req.headers['authorization']);
    let token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token,jwt_secret,(err,decodedToken)=>{
        if(err)
        resp.json({
            status:401,
            msg:"Unauthorized",
            err: err
        })
        else{
            console.log("New user login : ",decodedToken);
            next();
        }
    })
})
var users=[];

function intializeDatasource(){
  users.push({
    id: 1,
    username: "sam",
    password: "1234",
    role: "STUDENT"
  })
  users.push({
    id: 2,
    username: "ram",
    password: "1254",
    role: "FACULTY"
  })
  users.push({
    id: 3,
    username: "bam",
    password: "1334",
    role: "FACULTY"
  })
  users.push({
    id:4,
    username: "aam",
    password: "17434",
    role: "STUDENT"
  })
}
const jwt_secret= "test"
// register
// login
app.post('/login', (req,resp) => {
    console.log(req.body)
    let { username, password } = req.body;
    //check if user is geniuine
    let fetchedUser = users.filter(user => user.username == username)[0]//user.find{username: username}
    //match the password
    if(fetchedUser.password == password){
        //issue a jwt token
        let generatedToken = jwt.sign(fetchedUser, jwt_secret, {expiresIn:'2s'});
        resp.json({
            status: 200,
            msg: "Logged in Successfully",
            accessToken: generatedToken
        })
    }
    else {
        resp.json({
            status:401,
            msg:"Unauthorized"
        })
    }
})

//fetching user profile
app.get('/me/:id',(req, resp)=>{
    let id = req.params['id'];
    let user = users.filter(user=>user.id == id) [0];
    resp.json({
        status:200,
        msg:"User retrieved",
        data:user
    })
})

app.listen(port,() => {
    intializeDatasource()
    console.log(`Server listining on port  : ${port} `)
})
