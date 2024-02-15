const express=require('express');
const app=express();
const mongoose = require('mongoose');
const connectDB=require('./config/dbConn');
const PORT=process.env.PORT || 4000;
const cors=require('cors');

const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const secret='d75ba2a445afb34ac6c0f9764010c0b37682cf735b0323e13c0b37381f9fdc4a44d8004bbf8904b9262c8e921754473b41acfeb6f5ad73a50955c51de7cf3e05';
const saltRound=10;
const cookieParser=require('cookie-parser');

const {Server} =require("socket.io");
const server=require('http').createServer(app);


const User=require('./model/user');
const Review=require('./model/review');
const PullRequest=require('./model/pullrequest');
const Approval=require('./model/approval');

const pullRequests = [];

app.use(cookieParser());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

async function getApproversAndRequesters() {
    try {
      const users = await User.find({
        $or: [
          { roles: 'approver' },
          { roles: { $all: ['approver', 'requester'] } }
        ]
      });
  
      const approversArray = users.map(user => ({
        approverId: user._id,
        status: 'Pending',
        comments: ''
      }));
  
      return approversArray;
    } catch (error) {
      console.error("Error retrieving approvers and requesters:", error);
      throw error;
    }
}

app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    if(!token) res.json(null);
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    })
})

app.post('/register',async (req,res)=>{
    const {username,email,password,role}=req.body;
    try{
        const salt=await bcrypt.genSalt(saltRound);
        const hshpwd=await bcrypt.hash(`${password}`,`${salt}`);
        const userDoc=await User.create({username,email,password:hshpwd,roles:role});
        res.json(userDoc);

        try {
            const pullRequests = await PullRequest.find();
        
        for (const pullRequest of pullRequests) {
            if (userDoc.roles.includes('approver')) {
                const existingApprover = pullRequest.approvers.find(approver => approver.approverId.equals(userDoc._id));
    
                if (!existingApprover) {
                pullRequest.approvers.push({
                    approverId: userDoc._id,
                    status: 'Pending',
                    comments: ''
                });
                await pullRequest.save();
                }
            }
            }
        } catch (error) {
            throw error;
        }
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const findUser=await User.findOne({username});
    if(!findUser) return res.status(400).send('NO user found');
    const passcheck=await bcrypt.compare(`${password}`,findUser.password);
    if(passcheck){
        const check=findUser.roles.includes('approver')?'1':'2';
        const token=jwt.sign(
            {username,id:findUser._id,check},
            secret,
            {}
        );
        return res.cookie('token',token).json({username,id:username._id});
    }else{
        return res.sendStatus(400);
    }
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})



app.get('/pull-request',async (req,res)=>{
    const {token}=req.cookies;

    res.json(await PullRequest.find()
    .populate('requesterId',['username'])
    .sort({createdAt:-1})
    .limit(20)
    );
})

app.get('/getUsers',async(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const getUser=await User.find();
        res.status(200).json(getUser);
    })
})

app.post('/pull-request',async(req,res)=>{
    const {title,content}=req.body;
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const approversArray = await getApproversAndRequesters();
        if(title){
        const userDoc=await PullRequest.create({
            title,
            description:content,
            requesterId:info.id,
            comments:[],
            approvals:[],
            approvers:approversArray,
        })
        res.json(userDoc);}
        else res.json('no response')
    })
})

app.delete('/pull-request/:id',async(req,res)=>{
    const {id}=req.params;
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;
        const postDoc=await PullRequest.findById(id);
        const isAuthor=JSON.stringify(info.id)===JSON.stringify(postDoc.requesterId);
        console.log(postDoc.requesterId);
        console.log(info.id);
        
        await Review.deleteMany({ _id: { $in: postDoc.comments } });
        await Approval.deleteMany({ _id: { $in: postDoc.approvals } });
        await PullRequest.deleteOne({ _id: id });
        res.status(200).json('ok');
    })  
})

app.put('/pull-request/:id',async(req,res)=>{
    const {id}=req.params;
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;
        const {title,content}=req.body;
        const postDoc=await PullRequest.findById(id);
        const isAuthor=JSON.stringify(info.id)===JSON.stringify(postDoc.requesterId);
        if(!isAuthor){
            return res.status(400).send('not valid user');
        }
        await postDoc.updateOne({
            $set: {
                title, 
                description:content,
                requesterId: info.id,
                comments: postDoc.comments,
                approvers:postDoc.approvers,
                approvals:postDoc.approvals,
                status:postDoc.status,
            }
        })
        res.json(postDoc);
    })
})

app.get('/pull-request/:id',async(req,res)=>{
    const {id}=req.params;
    const postDoc=await PullRequest.findById(id)
                        .populate('requesterId',['username'])
                        .populate({
                            path: 'approvers.approverId', // Adjust the path based on your schema
                            model:'User',
                            select: 'username email' // Specify the fields you want to select from the User model
                        }).populate({
                            path:'comments',
                            model:'Review',
                            populate:{
                                path:'reviewerId',
                                model:'User',
                                select:'username',
                            },
                        }).populate({
                            path:'approvals',
                            model:'Approval',
                            populate:{
                                path:'approverId',
                                model:'User',
                                select:'username',
                            },
                        })
    res.json(postDoc);
})


app.post('/pull-request/:id/comments',async(req,res)=>{
    const {comment}=req.body;
    const {id}=req.params;
    const {token}=req.cookies;
    if(!token) return res.status(401).json('login first');

    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const postDoc=await PullRequest.findById(id);
        const newComment= await Review.create({
            pullRequestId:id,
            reviewerId:info.id,
            comments:comment,
        })
        postDoc.comments.push(newComment);
        await postDoc.save();
        res.status(200).json(comment);
    })
})


app.post('/pull-request/:id/approvals',async(req,res)=>{
    const {comment}=req.body;
    const {id}=req.params;
    const {token}=req.cookies;
    if(!token) return res.status(401).json('login first');

    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const postDoc=await PullRequest.findById(id);
        const newApproval= await Approval.create({
            pullRequestId:id,
            approverId:info.id,
            status:'Approved',
        })
        postDoc.approvals.push(newApproval);
        await postDoc.save();
        res.status(200).json(newApproval);

        postDoc.approvers.forEach((approver) => {
            if (JSON.stringify(info.id)===JSON.stringify(approver.approverId)) {
              approver.status = 'Approved';
            }
        });

        let flag=false;
        postDoc.approvers.forEach((approver)=>{
            if(approver.status==="Pending"){
                flag=true;
            }
        })
        if(flag==false){
            postDoc.status="Approved";
        }
        postDoc.save();
    })
})



mongoose.connection.once('open',()=>{
    server.listen(PORT, ()=>{console.log('server is running at port 4000')});

    const io=new Server(server,{
        cors:{
            origin: "http://localhost:3000",
        },
        methods:["GET","POST"],
    })

    io.on('connection', (socket) => {
        console.log('A user connected');
        
        // Handle create request event
        socket.on('createRequest', (newRequest) => {
            console.log(newRequest);
            socket.emit('updatePullRequests',newRequest);
            pullRequests.push(newRequest);
            // Add the new request to the list
            // Broadcast the updated list to all connected clients
            // io.emit('updatePullRequests', pullRequests);
        });
        
    });
        
    
    console.log(`connected to DB`);
})
