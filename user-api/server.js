// server.js
require('dotenv').config();
const cors = require('cors'); // Import cors package
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "test_secret_key"; 
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  portfolio_total: Number,
  cash: Number,
});

// Trade Schema and Model
const tradeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  coin_id: { type: Number, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  volume: { type: Number, required: true },
  order: { type: String, enum: ['buy', 'sell'], required: true }
});

const User = mongoose.model('users', userSchema);
const Trade = mongoose.model('trades', tradeSchema);

// User Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { portfolio_total, cash } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { portfolio_total, cash },
      { new: true }
    );

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Successfully updated user:', user); // Debugging log
    res.json(user);
  } catch (error) {
    console.error('Error updating portfolio total and cash:', error); // Debugging log
    res.status(500).json({ error: 'Error updating portfolio total and cash' });
  }
});

// Register
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  res.status(201).send({ message: 'User registered successfully' });
});

// Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, admin: user.admin }, SECRET_KEY, { expiresIn: '1h' });
  res.send({ token, user });
});

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send({ message: 'Unauthorized' });
      req.userId = decoded.id;
      next();
  });
};

app.get('/api/protected-route', authenticate, (req, res) => {
  try {
    res.send({ message: 'You have access' });
  } catch (error) {
    console.error('Error accessing protected route:', error);
    res.status(500).send({ message: 'Error accessing protected route' });
  }
});

// Trade Routes

app.get('/api/trades', async (req, res) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trades' });
  }
});

app.post('/api/trades', async (req, res) => {
  try {
    const trade = new Trade(req.body);
    await trade.validate();
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trades/:user_id', async (req, res) => {
  try {
    const trades = await Trade.find({ user_id: req.params.user_id });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trades' });
  }
});

app.put('/api/trades/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(req
      .params.id, req.body, { new: true });
    await trade.validate();
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/trades/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting trade' });
  }
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
