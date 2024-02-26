const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

// Example of validating an ObjectId string
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

router.post('/create-profile', async (req, res) => {


    try {
        const { name, dob, gender, email, mobileNo, role } = req.body;

        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('profiles').insertOne({ name, dob, gender, email, mobileNo, role });
       client.close();
        res.status(201).json({ message: 'Profile created successfully',result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
}
)
router.get('/all-profile', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('profiles').find({}).toArray();
        client.close();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
}
)



router.put('/update-profile/:id', async (req, res) => {
    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const { id } = req.params;

        let updateData = req.body;
        // Remove the _id field from the update data if it exists
        delete updateData._id;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid profile ID format' });
        }
        const result = await db.collection('profiles').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No profile found with that ID' });
        }
        client.close();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
});




router.get('/profile/:id', async (req, res) => {
  
    try {
        const client = new MongoClient(URL);
        await client.connect();

        const db = client.db('crm');
       
        const { id } = req.params;
        console.log(req.params);
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid customer ID format' });
        }
    
        const result = await db.collection('profiles').findOne({ _id: new ObjectId(id) });

        if (!result) {
            return res.status(404).json({ message: 'No profile found with that ID' });
        }
       await client.close();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
})
module.exports = router;