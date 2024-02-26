const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const URL = process.env.URL;
const router = express.Router();

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

router.post('/create-tasks', async (req, res) => {
  
 
    try { 
        const { taskName,dueDate, description,assignTo,status} = req.body;
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const result = await db.collection('Tasks').insertOne({taskName,dueDate, description,assignTo,status});
       await client.close();
        res.status(201).json({ message: 'Task created successfully',result });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/get-alltasks', async (req, res) => {
   
    try {
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
        const tasks = await db.collection('Tasks').find({}).toArray();
       await client.close();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.put('/update-tasks/:id', async (req, res) => {
 
    try {
        const { taskName, dueDate, description, assignTo, status } = req.body;
        const {id} = req.params
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
       
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid customer ID format' });
        }
        const result = await db.collection('Tasks').updateOne({ _id: new ObjectId(id) }, { $set: { taskName, dueDate, description, assignTo, status } });
       console.log(req.params.id);
       await client.close();
        res.json({ message: 'Task updated successfully',result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/delete-tasks/:id', async (req, res) => {

    try {
        const {id} = req.params
        const client = new MongoClient(URL);
        await client.connect();
        const db = client.db('crm');
      
        const result = await db.collection('Tasks').deleteOne({ _id: new ObjectId(id) });
       await client.close();
        res.json({ message: 'Task deleted successfully',result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
module.exports = router;