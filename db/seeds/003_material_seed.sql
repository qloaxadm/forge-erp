INSERT INTO uom_types (code, name) VALUES
('PCS','Pieces'),
('KG','Kilogram'),
('LTR','Litre'),
('CASE','Case'),
('BTL','Bottle')
ON CONFLICT DO NOTHING;

INSERT INTO raw_material_category (name) VALUES
('Preforms'),
('Caps'),
('Labels'),
('Shrink Film'),
('Chemicals'),
('Packaging')
ON CONFLICT DO NOTHING;

INSERT INTO customer_types (name) VALUES
('Distributor'),
('Dealer'),
('Retailer'),
('Modern Trade')
ON CONFLICT DO NOTHING;

