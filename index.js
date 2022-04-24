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
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            let products;
            if (page || pageSize) {
                // 0 --> skip: 0 get: 0-10 --> 10;
                // 1 --> skip: 1*10 get: 11-20 --> 10;
                // 2 --> skip: 2*20 get: 21-30 --> 10;
                // 0 --> skip: 3*10 get: 31-40 --> 10;
                products = await cursor.skip(page*pageSize).limit(pageSize).toArray();
            }
            else{
                products = await cursor.toArray();
            }
            res.send(products);
        });

        // Get product count endpoint 
        app.get('/products-count', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count}); 
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