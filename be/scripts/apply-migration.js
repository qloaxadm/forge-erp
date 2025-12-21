const { Client } = require('pg');
require('dotenv').config();

async function applyMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Start transaction
    await client.query('BEGIN');

    // Add new columns if they don't exist
    const alterTableQuery = `
      DO $$
      BEGIN
        -- Add description if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'description') THEN
          ALTER TABLE price_lists ADD COLUMN description TEXT;
        END IF;
        
        -- Add currency if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'currency') THEN
          ALTER TABLE price_lists ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD';
        END IF;
        
        -- Add is_active if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'is_active') THEN
          ALTER TABLE price_lists ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
        
        -- Add effective_from if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'effective_from') THEN
          ALTER TABLE price_lists ADD COLUMN effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        -- Add effective_to if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'effective_to') THEN
          ALTER TABLE price_lists ADD COLUMN effective_to TIMESTAMP WITH TIME ZONE;
        END IF;
        
        -- Add created_at if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'created_at') THEN
          ALTER TABLE price_lists ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        -- Add updated_at if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'price_lists' AND column_name = 'updated_at') THEN
          ALTER TABLE price_lists ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
      END
      $$;
    `;

    await client.query(alterTableQuery);
    
    // Update existing rows with default values
    const updateQuery = `
      UPDATE price_lists 
      SET 
        currency = COALESCE(currency, 'USD'),
        is_active = COALESCE(is_active, TRUE),
        effective_from = COALESCE(effective_from, NOW()),
        created_at = COALESCE(created_at, NOW()),
        updated_at = NOW()
      WHERE 
        currency IS NULL 
        OR is_active IS NULL 
        OR effective_from IS NULL 
        OR created_at IS NULL;
    `;
    
    await client.query(updateQuery);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully!');
    
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error applying migration:', error);
  } finally {
    await client.end();
  }
}

// Execute the migration
applyMigration();
