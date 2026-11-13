CREATE DATABASE IF NOT EXISTS onscent;
USE onscent;

CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  line ENUM('men','women') NOT NULL,
  notes VARCHAR(160) NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price > 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0)
);
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(80) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(200) NOT NULL
);
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Sample products: replace with the real ONSCENT catalog.
INSERT INTO products (name, line, notes, price, stock) VALUES
('Onyx',   'men',   'Smoked vetiver, black pepper, cedar',  1499.00, 20),
('Argent', 'men',   'Bergamot, cold mint, white musk',      1299.00, 20),
('Cendre', 'men',   'Leather, tobacco leaf, amber',         1699.00, 15),
('Blanc',  'women', 'White tea, jasmine, soft musk',        1399.00, 20),
('Aurum',  'women', 'Honeyed iris, sandalwood, vanilla',    1799.00, 15),
('Soleil', 'women', 'Neroli, pear, golden amber',           1499.00, 20);
