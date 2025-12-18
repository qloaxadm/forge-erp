CREATE TABLE suppliers 
( id SERIAL PRIMARY KEY, 
name VARCHAR(150) NOT NULL, 
contact_person VARCHAR(100), 
phone VARCHAR(20),
 email VARCHAR(100), 
 gst_number VARCHAR(20), 
 address TEXT, 
 created_at TIMESTAMP DEFAULT NOW(), 
 updated_at TIMESTAMP DEFAULT NOW() );