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
    const allideas=await ideasCollection.find().toArray()
    res.json(allideas)
  })
//get trending idea data on database    
 app.get("/trending-ideas",async(req,res)=>{
    const allideas = await ideasCollection.find().limit(1).toArray()
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



  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);