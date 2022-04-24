const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// Middlewear
app.use(cors());
app.use(express.json());

// Endpoints 
app.get('/', (req, res) => {
    res.send('Hello World');
});

//connection url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusteremajohn.8cfdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// create mongo client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        const productsCollection = client.db('emajohn').collection('products');
        
        // Get all product endpoint 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    }
    finally {

    }
}
run().catch(console.dir);




// Server listen 
app.listen(port, () => {
    console.log('Listening port', port)
});