INSERT INTO uom_types (code, name) VALUES
('PCS','Pieces'),
('KG','Kilogram'),
('LTR','Litre'),
('CASE','Case'),
('BTL','Bottle')
ON CONFLICT (code) DO NOTHING;