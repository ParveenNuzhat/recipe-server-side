const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const objectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtojm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("mealRecipes");
    const recipeCollection = database.collection("recipes");

    //GET ALL RECIPES
    app.get("/recipes", async (req, res) => {
      const cursor = recipeCollection.find({});
      const recipes = await cursor.toArray();
      res.send(recipes);
    });

    // GET SINGLE Bird API
    app.get("/recipeCollection/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      console.log(query);
      const recipe = await recipeCollection.findOne(query);
      res.json(recipe);
    });

    // POST API Recipe
    app.post("/recipes", async (req, res) => {
      const recipe = req.body;
      console.log("Hitting the post", recipe);
      const result = await recipeCollection.insertOne(recipe);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    app.delete("/recipeCollection/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: objectId(id) };
      const result = await recipeCollection.deleteOne(query);
      console.log("deleting recipe with id ", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("running server");
});
