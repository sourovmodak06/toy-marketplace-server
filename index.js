const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhzphwv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const toyCollection = client.db("ToyMarketplace").collection("gallery");
    const popularProducts = client
      .db("ToyMarketplace")
      .collection("PopularProducts");
    const marvelCategory = client
      .db("ToyMarketplace")
      .collection("MarvelCategory");
    const starWarCategory = client
      .db("ToyMarketplace")
      .collection("starWarCategory");
    const transformerCategory = client
      .db("ToyMarketplace")
      .collection("transformerCategory");
    const dcCategory = client.db("ToyMarketplace").collection("dcCategory");

    const addToy = client.db("ToyMarketplace").collection("addToy");

    app.get("/gallery", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const result = await popularProducts.find().toArray();
      res.send(result);
    });
    app.get("/marvelCategory", async (req, res) => {
      const result = await marvelCategory.find().toArray();
      res.send(result);
    });
    app.get("/starWarCategory", async (req, res) => {
      const result = await starWarCategory.find().toArray();
      res.send(result);
    });
    app.get("/transformerCategory", async (req, res) => {
      const result = await transformerCategory.find().toArray();
      res.send(result);
    });
    app.get("/dcCategory", async (req, res) => {
      const result = await dcCategory.find().toArray();
      res.send(result);
    });

    app.post("/addToy", async (req, res) => {
      const newToy = req.body;
      const result = await addToy.insertOne(newToy);
      res.send(result);
    });
    app.get("/addToy", async (req, res) => {
      const cursor = addToy.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/addToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToy.findOne(query);
      res.send(result);
    });

    app.put("/addToy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateToy = req.body;
      const toy = {
        $set: {
          toyUrl: updateToy.toyUrl,
          toyName: updateToy.toyName,
          sellerName: updateToy.sellerName,
          sellerPhoto: updateToy.sellerPhoto,
          email: updateToy.email,
          toyCategory: updateToy.toyCategory,
          price: updateToy.price,
          rating: updateToy.rating,
          quantity: updateToy.quantity,
          description: updateToy.description
        }
      }
      const result = await addToy.updateOne(filter, toy, option)
      res.send(result);
    })

    app.get("/toy/:text", async (req, res) => {
      const name = req.params.text;
      const cursor = addToy.find({sellerName: name}).sort({ price: -1});
      const result = await cursor.toArray();
      res.send(result);
    });



    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addToy.deleteOne(query)
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Super Hero Toy Store server is running");
});

app.listen(port, () => {
  console.log(`Super Hero Toy Store server PORT: ${port}`);
});
