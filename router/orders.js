const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

router.post('/create-order', async (req, res) => {


    try {
        const { itemName, itemCode, quantity, companyName, payment, status } = req.body;
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('orders').insertOne({ itemName, itemCode, quantity, companyName, payment, status });
        console.log(result);
        client.close();
        res.status(201).json({ message: 'Orders created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
)
router.get('/get-allorders', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');

        const orders = await db.collection('orders').find({}).toArray();
        client.close();
        res.json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.put('/update-order/:id', async (req, res) => {
    try {
        const { itemName, itemCode, quantity, companyName, payment, status } = req.body;
        const { id } = req.params;
        console.log(id);
        // Check if id is provided and is a valid 24-character hex string
        if (!id || id.length !== 24 || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid or missing order ID' });
        }

        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(id) },
            { $set: { itemName, itemCode, quantity, companyName, payment, status } }
        );

        console.log(result);
        await client.close();

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Order not found or no changes made' });
        }

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/delete-order/:id', async (req, res) => {
    let client;
    try {
        client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});
module.exports = router;
