const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thvamxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`; 

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
    await client.connect();
    const coffeesCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db('coffeeDB').collection('users');

    app.get('/coffees', async(req,res)=>{
      // const cursor = coffeesCollection.find();
      // const result = await cursor.toArray();
      const result = await coffeesCollection.find().toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)};
      const coffee = await coffeesCollection.findOne(query);
      res.send(coffee);   
    })

    app.post('/coffees', async(req,res)=>{
      const newCoffee = req.body;
      console.log(newCoffee); 
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: updatedCoffee
      };
      const result = await coffeesCollection.updateOne(filter,coffee,options);
      res.send(result);
    })

    app.delete('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      console.log(query);
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    })

    // user related API
    app.get('/users',async(req,res)=>{
      const result= await usersCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req,res)=>{
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })

    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
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
    res.send("coffee is getting ready")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})