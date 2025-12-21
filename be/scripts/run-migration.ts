import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to the database');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', '..', 'db', 'migrations', '036_add_columns_to_price_lists.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    console.log('🚀 Running migration...');
    await client.query(sql);
    console.log('✅ Migration applied successfully!');
    
  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
runMigration().catch(console.error);