// Database connection utility for Neon PostgreSQL
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Always use SSL for Neon
      max: 10, // maximum number of clients in the pool
      idleTimeoutMillis: 30000, // close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection cannot be established
      query_timeout: 30000, // query timeout
      statement_timeout: 30000, // statement timeout
    });
  }

  // Get a client from the pool
  async getClient() {
    return await this.pool.connect();
  }

  // Execute a query
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error:', { text: text.substring(0, 50), error: error.message });
      throw error;
    }
  }

  // User operations
  async createUser(username, email, passwordHash) {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, credits, role, created_at
    `;
    const result = await this.query(query, [username, email, passwordHash]);
    return result.rows[0];
  }

  async findUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1 AND is_active = true';
    const result = await this.query(query, [username]);
    return result.rows[0];
  }

  async findUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await this.query(query, [email]);
    return result.rows[0];
  }

  async findUserById(id) {
    const query = 'SELECT id, username, email, credits, role, is_active, last_login, created_at FROM users WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0];
  }

  async updateUserLastLogin(userId) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await this.query(query, [userId]);
  }

  async updateUserCredits(userId, newCredits) {
    const query = 'UPDATE users SET credits = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await this.query(query, [newCredits, userId]);
  }

  // Key operations
  async findKeyByCode(keyCode) {
    const query = 'SELECT * FROM keys WHERE key_code = $1 AND is_used = false';
    const result = await this.query(query, [keyCode]);
    return result.rows[0];
  }

  async markKeyAsUsed(keyId, userId) {
    const query = `
      UPDATE keys 
      SET is_used = true, used_by_user_id = $1, used_at = CURRENT_TIMESTAMP 
      WHERE id = $2
    `;
    await this.query(query, [userId, keyId]);
  }

  async createKeyRedemption(userId, keyId, creditsAwarded) {
    const query = `
      INSERT INTO key_redemptions (user_id, key_id, credits_awarded)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const result = await this.query(query, [userId, keyId, creditsAwarded]);
    return result.rows[0];
  }

  // Token operations
  async createToken(userId, tokenValue, creditsCost) {
    const query = `
      INSERT INTO tokens (user_id, token_value, credits_cost, expires_at)
      VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')
      RETURNING id, token_value, generated_at
    `;
    const result = await this.query(query, [userId, tokenValue, creditsCost]);
    return result.rows[0];
  }

  async getUserTokens(userId, limit = 10) {
    const query = `
      SELECT token_value, generated_at, expires_at, is_active
      FROM tokens 
      WHERE user_id = $1 
      ORDER BY generated_at DESC 
      LIMIT $2
    `;
    const result = await this.query(query, [userId, limit]);
    return result.rows;
  }

  // Credit transaction operations
  async recordCreditTransaction(userId, type, amount, description, referenceId = null) {
    const query = `
      INSERT INTO credit_transactions (user_id, transaction_type, amount, description, reference_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const result = await this.query(query, [userId, type, amount, description, referenceId]);
    return result.rows[0];
  }

  async getUserCreditHistory(userId, limit = 20) {
    const query = `
      SELECT transaction_type, amount, description, created_at
      FROM credit_transactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.query(query, [userId, limit]);
    return result.rows;
  }

  // Admin operations
  async getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT id, username, email, credits, role, is_active, last_login, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await this.query(query, [limit, offset]);
    return result.rows;
  }

  async searchUsers(searchTerm) {
    const query = `
      SELECT id, username, email, credits, role, is_active, last_login, created_at
      FROM users 
      WHERE username ILIKE $1 OR email ILIKE $1
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    const result = await this.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async updateUserStatus(userId, isActive) {
    const query = 'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await this.query(query, [isActive, userId]);
  }

  async updateUserRole(userId, role) {
    const query = 'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await this.query(query, [role, userId]);
  }

  // Analytics operations
  async getStats() {
    const queries = await Promise.all([
      this.query('SELECT COUNT(*) as total_users FROM users'),
      this.query('SELECT COUNT(*) as active_users FROM users WHERE is_active = true'),
      this.query('SELECT COUNT(*) as total_keys FROM keys'),
      this.query('SELECT COUNT(*) as used_keys FROM keys WHERE is_used = true'),
      this.query('SELECT COUNT(*) as total_tokens FROM tokens'),
      this.query('SELECT SUM(credits) as total_credits FROM users'),
    ]);

    return {
      totalUsers: parseInt(queries[0].rows[0].total_users),
      activeUsers: parseInt(queries[1].rows[0].active_users),
      totalKeys: parseInt(queries[2].rows[0].total_keys),
      usedKeys: parseInt(queries[3].rows[0].used_keys),
      totalTokens: parseInt(queries[4].rows[0].total_tokens),
      totalCredits: parseInt(queries[5].rows[0].total_credits) || 0,
    };
  }

  // Test database connection
  async testConnection() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      console.log('Database connection successful:', result.rows[0].current_time);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error.message);
      return false;
    }
  }

  // Initialize database tables (create if not exists)
  async initializeTables() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await this.query(schema);
      console.log('Database tables initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize database tables:', error.message);
      return false;
    }
  }

  // Close database connection
  async close() {
    await this.pool.end();
  }
}

// Create singleton instance
const db = new Database();

module.exports = db;