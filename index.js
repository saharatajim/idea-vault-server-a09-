const dns = require("node:dns");  
dns.setServers(["8.8.8.8", "8.8.4.4"]); 
require('dotenv').config()   


const express = require('express');
const app = express();
const port = 5000;


const cors=require("cors")  
app.use(cors())  
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello  World!');
});

app.listen(port, () => {
  console.log(`Example  listening on port ${port}`);
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
  
 const db=client.db("idea-vault")
 const ideasCollection=db.collection("ideas")
 const commentsCollection=db.collection("comments")
// post idea on database
    app.post("/ideas",async(req,res)=>{
    const newIdea=req.body
     console.log(newIdea);
    const result=await ideasCollection.insertOne(newIdea)
    console.log(result)
    res.json(result)
    }
    )
//get all idea data on database    

 app.get("/ideas",async(req,res)=>{
  const{category,search}=req.query
  const query={}
  if(category){
    query.category=category
  }
  if(search){
    query.title={
      $regex:search,$options:"i"
    }
  }
  console.log(category,"category")
  console.log(query);
    const allideas=await ideasCollection.find(query).toArray()
    res.json(allideas)
  })





//get trending idea data on database    
 app.get("/trending-ideas",async(req,res)=>{
    const allideas = await ideasCollection.find().limit(6).toArray()
    res.json(allideas)
  })
// get only selected idea data details
  app.get("/ideas/:id",async(req,res)=>{
    const{id}=req.params
    const result=await ideasCollection.findOne({
      _id: new ObjectId(id)
    })
    res.json(result)
  })
 //get user based my  idea data  
app.get("/my-ideas/:userId",async (req,res)=>{
   const{userId}=req.params
 const result=await ideasCollection.find({
      userId
    }).toArray()
    res.json(result)
})
 //delete  ideas
          app.delete("/ideas/:id",async (req,res)=>{
          const{id}=req.params
          const result=await ideasCollection.deleteOne({
          _id: new ObjectId(id)
          })
          res.json(result)
})
 //update idea
 app.patch("/ideas/:id",async(req,res)=>{
  const {id}=req.params
  const updateIdea=req.body
  console.log(updateIdea)
  const result = await ideasCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set:updateIdea}
  )
  res.json(result)
})


 // comments collection

 // post comment on database
      app.post("/comments",async(req,res)=>{    
     const newComment=req.body
     console.log(newComment);
     const result=await commentsCollection.insertOne(newComment)
     console.log(result)
     res.json(result)  
  })
 //get all comments 
    app.get("/comments",async(req,res)=>{
    const allComments=await commentsCollection.find().toArray()
    res.json(allComments)
  })
  
  //get all comments only on selected details page

    app.get("/comments/:ideaId",async (req,res)=>{
    const{ideaId}=req.params
    const allComments = await commentsCollection.find({ selectedIdeaById: ideaId }).toArray()
    res.json(allComments)
})

//delete comments

app.delete("/comments/:id",async(req,res)=>{
   const {id}=req.params
     const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
      res.json(result)
  })

 //update comment
   app.patch("/comments/:id",async(req,res)=>{
  const {id}=req.params
  const updateComment=req.body
  console.log(updateComment)
  const result = await commentsCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set:updateComment}
  )
  res.json(result)
}) 
  
// My interaction

  app.get("/comments/user/:userId", async (req, res) => {
const {userId}=req.params
console.log(userId)
const userComments = await commentsCollection.find({userId }).toArray()
console.log(userComments)
  res.json(userComments)

})
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);
