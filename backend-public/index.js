const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow all origins for testing
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());

// Simple in-memory storage for testing (replace with database in production)
const users = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Public API is running',
    endpoints: {
      health: '/health',
      register: '/api/auth/register',
      login: '/api/auth/login',
      redeem_key: '/api/keys/redeem',
      generate_token: '/api/tokens/generate',
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running!',
    status: 'active',
    endpoints: {
      health: '/health',
      register: '/api/auth/register',
      login: '/api/auth/login',
      redeem_key: '/api/keys/redeem',
      generate_token: '/api/tokens/generate',
    }
  });
});

// Registration endpoint
app.post('/api/auth/register', [
  body('username').isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    console.log('Registration attempt:', { username: req.body.username, email: req.body.email });
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      console.log('User already exists:', { username, email });
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      username,
      email,
      password_hash: passwordHash,
      credits: 0,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString()
    };

    users.push(user);
    console.log('User created successfully:', { id: user.id, username: user.username });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'default-jwt-secret-for-testing',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        credits: user.credits
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password } = req.body;
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is not active' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-jwt-secret-for-testing',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        credits: user.credits
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Key redemption endpoint
app.post('/api/keys/redeem', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    // Predefined keys for testing
    const predefinedKeys = {
      'KEY-DEMO2024': 100,
      'KEY-TEST1234': 50,
      'KEY-SAMPLE99': 75,
      'KEY-STARTER01': 25,
      'KEY-WELCOME88': 150,
      'KEY-BONUS777': 200
    };

    if (!predefinedKeys[key]) {
      return res.status(400).json({ error: 'Invalid key' });
    }

    const creditsAwarded = predefinedKeys[key];
    
    res.json({
      message: 'Key redeemed successfully',
      creditsAwarded: creditsAwarded,
      totalCredits: creditsAwarded
    });
  } catch (error) {
    console.error('Key redemption error:', error);
    res.status(500).json({ error: 'Key redemption failed' });
  }
});

// Token generation endpoint  
app.post('/api/tokens/generate', async (req, res) => {
  try {
    const tokenCost = 10;
    const userCredits = 100; // Mock user credits
    
    if (userCredits < tokenCost) {
      return res.status(400).json({ 
        error: 'Insufficient credits',
        required: tokenCost,
        available: userCredits 
      });
    }

    const token = `TOKEN-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    res.json({
      message: 'Token generated successfully',
      token: token,
      creditsUsed: tokenCost,
      remainingCredits: userCredits - tokenCost
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// Get token cost
app.get('/api/tokens/cost', (req, res) => {
  res.json({
    cost: 10,
    description: 'Cost per token generation'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Endpoint not found:', req.originalUrl);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server (only in non-production environments for local testing)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Public backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;