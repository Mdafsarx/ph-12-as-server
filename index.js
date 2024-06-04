const { MongoClient, ServerApiVersion } = require('mongodb');
const express=require('express');
const cors=require('cors')
const app=express()
const port=process.env.PORT||1000;
app.use(cors())


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
    // await client.connect();
     
    // data base collection here

    const apartmentCollection=client.db("onebuildDB").collection('apartment')


    app.get('/apartment',async(req,res)=>{
        const result=await apartmentCollection.find().toArray();
        res.send(result)
    })














    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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