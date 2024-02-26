const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

router.post('/create-userlist', async (req, res) => {
   

    try {
        const { photo, userName, email, type,  status } = req.body;
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('userlist').insertOne({  photo, userName, email, type,  status});
        console.log(result);
        client.close();
        res.status(201).json({ message: 'userlist created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
)
router.get('/get-alluserlist', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');

        const result = await db.collection('userlist').find({}).toArray();
        client.close();
        res.json({ message: 'userlist fetched successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
router.put('/update-userlist/:id', async (req, res) => {
    try {
        const {  photo, userName, email, type,  status } = req.body;
        const { id } = req.params;
        console.log(id);
        // Check if id is provided and is a valid 24-character hex string
        if (!id || id.length !== 24 || !ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid or missing userlist ID' });
        }

        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');

        const result = await db.collection('userlist').updateOne(
            { _id: new ObjectId(id) },
            { $set: {  photo, userName, email, type,  status } }
        );

        console.log(result);
        await client.close();

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'userlist not found or no changes made' });
        }

        res.json({ message: 'userlist updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/delete-userlist/:id', async (req, res) => {
    let client;
    try {
        client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await db.collection('userlist').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'userlist not found' });
        }

        res.json({ message: 'userlist deleted successfully', id });
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
