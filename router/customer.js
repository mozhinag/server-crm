const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

// Example of validating an ObjectId string
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);



router.post('/create-customer', async (req, res) => {


    try {
        const { firstname, lastname, email, mobile, address, customerType, sex, status } = req.body;

        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('customers').insertOne({ firstname, lastname, email, mobile, address, customerType, sex, status });
       client.close();
        res.status(201).json({ message: 'Customer created successfully',result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
}
)
router.get('/all-customers', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const customers = await db.collection('customers').find({}).toArray();
        client.close();
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
}
)



router.put('/update-customer/:id', async (req, res) => {
    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const { id } = req.params;

        let updateData = req.body;
        // Remove the _id field from the update data if it exists
        delete updateData._id;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid customer ID format' });
        }
        const result = await db.collection('customers').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No customer found with that ID' });
        }
        client.close();
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
});


// Endpoint to delete a customer
router.delete('/delete-customer/:id', async (req, res) => {
    try {
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');

        const { id } = req.params; // Move this line before using `id`

        if (!isValidObjectId(id)) {
            await client.close(); // Ensure to close the client in case of errors
            return res.status(400).json({ message: 'Invalid customer ID format' });
        }

        const result = await db.collection('customers').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            await client.close(); // Ensure to close the client in case of errors
            return res.status(404).json({ message: 'No customer found with that ID' });
        }
        await client.close();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        if (client) {
            await client.close(); // Ensure to close the client even if an error occurs
        }
        res.status(500).json({ message: 'Internal server error' });
    } 
});

router.get('/customer/:id', async (req, res) => {
  
    try {
        const client = new MongoClient(URL);
        await client.connect();

        const db = client.db('crm');
       
        const { id } = req.params;
        console.log(req.params);
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid customer ID format' });
        }
    
        const customer = await db.collection('customers').findOne({ _id: new ObjectId(id) });

        if (!customer) {
            return res.status(404).json({ message: 'No customer found with that ID' });
        }
       await client.close();
        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } 
})
module.exports = router;