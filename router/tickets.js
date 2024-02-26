const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

router.post('/create-ticket', async (req, res) => {
    try {
        // Destructure the fields from req.body
        const { ticketcode, subject, date, description, ticketstatus, status } = req.body;

        // Combine the fields into a single document object
        const ticketDocument = {
            ticketcode,
            subject,
            date,
            description,
            ticketstatus,
            status
        };

        // Connect to the MongoDB client
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');

        // Insert the document into the 'tickets' collection
        const result = await db.collection('tickets').insertOne(ticketDocument);
        console.log(result);

        // Close the MongoDB client connection
        client.close();

        // Send a success response
        res.status(201).json({ message: 'Ticket created successfully' });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-alltickets', async (req, res) => {

    try { 
       
         const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('tickets').find({}).toArray();
        client.close();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
   
})
router.put('/update-ticket/:id', async (req, res) => {
 
   
  
    try {
        const { ticketcode, subject, date, description, ticketstatus, status } = req.body;
        const ticket = {
            ticketcode,
            subject,
            date,
            description,
            ticketstatus,
            status
        }
        const { id } = req.params;
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const result = await  db.collection('tickets').updateOne({ _id:  new ObjectId(id) }, { $set: ticket });
        console.log(result);
       await client.close();
        res.status(200).json({ message: 'Ticket updated successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
   
})

router.delete('/delete-tickets/:id', async (req, res) => {
   
    try {
        const { id } = req.params;
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
       
       
        const result = await db.collection('tickets').deleteOne({ _id: new ObjectId(id) });
        console.log(result);
       await client.close();
        res.status(200).json({ message: 'Ticket deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
   
})
module.exports = router;

