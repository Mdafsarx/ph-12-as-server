const { MongoClient, ServerApiVersion } = require('mongodb');
const express=require('express');
const cors=require('cors')
const app=express()
const port=process.env.PORT||1000;
app.use(cors());
app.use(express.json())


app.use(
    cors({
      origin: [
        "http://localhost:5173",
      ]
    })
  );






const uri = "mongodb+srv://mdafsar99009:sF5mneEKKJ4d$.-@cluster0.zgmhkd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)     
    // data base collection here

    const apartmentCollection=client.db("onebuildDB").collection('apartment');
    const agreementCollection=client.db("onebuildDB").collection('agreement');
    const userCollection=client.db("onebuildDB").collection('user')
    const announcementCollection=client.db("onebuildDB").collection('announcement')


    // apartment
    app.get('/apartment',async(req,res)=>{
        const result=await apartmentCollection.find().toArray();
        res.send(result)
    })

    // agreement
    app.post('/agreement',async(req,res)=>{
      const find=await agreementCollection.findOne({email:req.body.email})
      if(find)return res.send({message:'already added'})
      const result=await agreementCollection.insertOne(req.body)
      res.send(result)
    })

    // user 
    app.post('/user',async(req,res)=>{
       const user=req.body;
       const find=await userCollection.findOne({email:user.email})
       if(find)return res.send({message:'this user was already added'})
       const result=await userCollection.insertOne(user) 
       res.send(result)
    })


    // announcement
    app.post('/announcement',async(req,res)=>{
       const result=await announcementCollection.insertOne(req.body);
       res.send(result)
    })














    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);















app.get('/',(req,res)=>{
    res.send('ph-12-as-server is running')
})
app.listen(port,()=>{
    console.log('server running properly')
})