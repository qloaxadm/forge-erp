const { Client } = require('pg');
require('dotenv').config();

async function checkTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    
    // Check table structure
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'price_lists';
    `);
    
    console.log('Current price_lists table structure:');
    console.table(res.rows);
    
  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    await client.end();
  }
}

checkTable();
