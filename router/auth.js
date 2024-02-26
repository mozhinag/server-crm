// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const URL = process.env.URL;
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET
router.get('/', (req,res) => {
  res.send('hello world');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const connection = await MongoClient.connect(URL);
    const db = connection.db('crm');

    // Check if user already exists
    let user = await db.collection('users').findOne({ username });
    if (user) {
      connection.close();
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      role
    });

    // Close the database connection
    connection.close();

    // Prepare payload for JWT
    const payload = {
      user: {
        id: result.insertedId,
        role: role,
      },
    };

  // Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  }
 catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}
});

// Route to get a list of all users
router.get('/users', async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db('crm');

    // Fetch all users from the 'users' collection
    const usersList = await db.collection('users').find({}).toArray();

    // Close the database connection
    connection.close();

    // Send the list of users as a response
    res.json(usersList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await MongoClient.connect(URL);
    const db = connection.db('crm');

    let user = await db.collection('users').findOne({ email });

    if (!user) {
      connection.close();
      return res.status(400).json({ msg: 'Incorrect Username and Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      connection.close();
      return res.status(400).json({ msg: 'Incorrect Username and Password' });
    }

    const payload = {
      user: {
        id: user._id, 
        role: user.role,
      },
    };

    // Generate JWT token and respond in a single place
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          connection.close();
          throw err;
        }
        // Send the token and user's role in the response
        // Note: Spread operator (...) cannot be used directly on the user object as it may contain sensitive information like password
        res.json({ 
          token, 
          user: { 
            role: user.role, 
            username: user.username, 
            email: user.email,
            // include any other user fields you need but exclude the password
          } 
        });
        connection.close();
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
