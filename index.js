const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app = express()
const stripe = require("stripe")(process.env.DB_STRIPE)
const port = process.env.PORT || 1000;
app.use(cors());
app.use(express.json())


//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      'https://resplendent-cranachan-4047db.netlify.app'
    ]
  })
);






const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PAS}@cluster0.zgmhkd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

    const apartmentCollection = client.db("onebuildDB").collection('apartment');
    const agreementCollection = client.db("onebuildDB").collection('agreement');
    const agreementCollectionAdmin = client.db("onebuildDB").collection('agreementAdmin');
    const userCollection = client.db("onebuildDB").collection('user')
    const announcementCollection = client.db("onebuildDB").collection('announcement')
    const paymentCollection = client.db("onebuildDB").collection('payment')
    const couponCollection = client.db("onebuildDB").collection('coupon')


    // payment
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100)

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ['card'],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });

    })
    app.post('/payment', async (req, res) => {
      const result = await paymentCollection.insertOne(req.body);
      res.send(result);
    })
    app.get('/payment/:email', async (req, res) => {
      const result = await paymentCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })
    app.get('/findPayment',async(req,res)=>{
      let query = {};
      if (req.query.search) {
        query = {
          email:req.query.email,
          month: { $regex: req.query.search, $options: "i" }
        }
      }
      const result=await paymentCollection.find(query).toArray();
      res.send(result)
    })




    // apartment
    app.get('/apartment', async (req, res) => {
      const result = await apartmentCollection.find().toArray();
      res.send(result)
    })



    // agreement
    app.post('/agreement', async (req, res) => {
      const find = await agreementCollection.findOne({ email: req.body.email })
      if (find) return res.send({ message: 'already added' })
      const result = await agreementCollection.insertOne(req.body)
      res.send(result)
    })

    app.delete('/agreement/:email', async (req, res) => {
      const result = await agreementCollection.deleteOne({ email: req.params.email });
      res.send(result);
    })


    app.post('/agreementAdmin', async (req, res) => {
      const find = await agreementCollection.findOne({ email: req.body.email })
      const find2 = await agreementCollectionAdmin.findOne({ email: req.body.email })
      if (find && find2) return res.send({ message: 'already added' })
      const result = await agreementCollectionAdmin.insertOne(req.body)
      res.send(result)
    })
    app.delete('/agreementAdmin', async (req, res) => {
      const result = await agreementCollectionAdmin.deleteOne({ _id: new ObjectId(req.query.id) });
      res.send(result)
    })
    app.put('/agreement', async (req, res) => {
      const filter = { email: req.query.email };
      const updateDoc = {
        $set: {
          status: req.body.status,
          year1: req.body.year1,
          mount1: req.body.mount1,
          date1: req.body.date1,
        }
      }
      const result = await agreementCollection.updateOne(filter, updateDoc);
      res.send(result)
    })
    app.get('/agreement', async (req, res) => {
      const result = await agreementCollection.find().toArray();
      res.send(result)
    })
    app.get('/agreementAdmin', async (req, res) => {
      const result = await agreementCollectionAdmin.find().toArray();
      res.send(result)
    })
    app.get('/agreement/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await agreementCollection.findOne({ email: req.params.email })
      res.send(result);
    })




    // user 
    app.post('/user', async (req, res) => {
      const user = req.body;
      const find = await userCollection.findOne({ email: user.email })
      if (find) return res.send({ message: 'this user was already added' })
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
    app.put('/user', async (req, res) => {
      const updateDoc = {
        $set: {
          userRole: req.body.Role
        }
      }
      const result = await userCollection.updateOne({ email: req.query.email }, updateDoc);
      res.send(result)
    })
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })



    // announcement
    app.post('/announcement', async (req, res) => {
      const result = await announcementCollection.insertOne(req.body);
      res.send(result)
    })
    app.get('/announcement', async (req, res) => {
      const result = await announcementCollection.find().toArray();
      res.send(result)
    })






    app.get('/coupon',async(req,res)=>{
      const result=await couponCollection.find().toArray();
      res.send(result);
    })

    app.post('/coupon',async(req,res)=>{
      const result=await couponCollection.insertOne(req.body)
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















app.get('/', (req, res) => {
  res.send('ph-12-as-server is running')
})
app.listen(port, () => {
  console.log('server running properly')
})