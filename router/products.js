const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();


router.post('/create-product', async (req, res) => {



    try {
        const { code, name, category, quantity, description, unitPrice, discount, status } = req.body;

        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('products').insertOne({ code, name, category, quantity, description, unitPrice, discount, status });
        client.close();
        res.json({ message: 'Product created successfully', result });
    } catch (err) {
        console.log(err);
        res.json({ message: 'Error creating product', err });
    }

}
)
router.get('/get-allproducts', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('products').find({}).toArray();
        client.close();
        res.json({ message: 'Products fetched successfully', result });
    } catch (err) {
        console.log(err);
        res.json({ message: 'Error fetching products', err });
    }
}
)

router.put('/update-product/:id', async (req, res) => {
    try {
        const { code, name, category, quantity, description, unitPrice, discount, status } = req.body;
        const { id } = req.params;
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
      
        const result = await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: { code, name, category, quantity, description, unitPrice, discount, status } });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log("Product updated:", { code, name, category, quantity, description, unitPrice, discount, status });
        await client.close();
        res.json({ message: 'Product updated successfully', result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating product', err });
    }
});


router.delete('/delete-product/:id', async (req, res) => {

    try {
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const { id } = req.params;

        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        await client.close();
        res.json({ message: 'Product deleted successfully', result });
    } catch (err) {
        console.log(err);
        res.json({ message: 'Error deleting product', err });
    }
})
module.exports = router;