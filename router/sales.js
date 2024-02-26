const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

router.post('/create-sales', async (req, res) => {

    try {
      
        const { itemName,price,qty, companyName, amount, entryDate, stage } = req.body;
        const client = await MongoClient.connect(URL);
       
        const db = client.db('crm');
        const result = await db.collection('sales').insertOne({ itemName,price,qty, companyName, amount, entryDate, stage})
        client.close();
        res.json({ message: ' sales details created successfully', result })
        console.log(result)
    } catch (err) {
        console.log(err)
        res.json({ message: 'Error creating details', err });
    }
})

router.get('/get-allsales', async (req, res) => {

    try {
        const client = await MongoClient.connect(URL);
        const db = client.db('crm');
        const result = await db.collection('sales').find({}).toArray();
        client.close();
        res.json({ message: 'sales details fetched successfully', result });
    } catch (err) {
        console.log(err)
        res.json({ message: 'Error fetching details', err });
    }
})

router.put('/update-sales/:id', async (req, res) => {
  
    try {
        const { itemName,price,qty, companyName, amount, entryDate, stage } = req.body;
        const {id} = req.params;
        const client = new MongoClient(URL);
        await client.connect();
       
        const db = client.db('crm');
     

        const result = await db.collection('sales').updateOne({ _id: new ObjectId(id)  }, { $set: { itemName,price,qty, companyName, amount, entryDate, stage } });
       await client.close();
        res.json({ message: 'sales details updated successfully', result });
    } catch (err) {
        console.log(err)
        res.json({ message: 'Error updating details', err });
    }
})

router.delete('/delete-sales/:id', async (req, res) => {
   
    try {
        const client = new MongoClient(URL);
        await client.connect();
       
        const db = client.db('crm');
      
        const result = await db.collection('sales').deleteOne({ _id: new ObjectId(req.params.id)  });
      await  client.close();
        res.json({ message: 'sales details deleted successfully', result });
    } catch (err) {
        console.log(err)
        res.json({ message: 'Error deleting details', err });
    }
})
module.exports = router;