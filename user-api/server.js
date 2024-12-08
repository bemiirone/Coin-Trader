// server.js
require('dotenv').config();
const cors = require('cors'); // Import cors package
const express = require('express');
const mongoose = require('mongoose');
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
