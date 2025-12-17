CREATE INDEX idx_material_category ON materials(category_id);
CREATE INDEX idx_material_uom ON materials(uom_id);


CREATE INDEX idx_product_uom ON products(uom_id);

CREATE INDEX idx_customer_type ON customers(customer_type_id);

CREATE INDEX idx_price_list_customer_type ON price_lists(customer_type_id);
CREATE INDEX idx_price_list_items_product ON price_list_items(product_id);
