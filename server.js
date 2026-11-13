const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// The connection from Node to MySQL. Change user/password to match your MySQL.
const pool = mysql.createPool({
  host: 'localhost', user: 'root',
  password: process.env.DB_PASS || '', database: 'onscent'
});
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'onscent123';
const admin = (req, res, next) =>
  req.get('x-admin-password') === ADMIN_PASSWORD ? next()
  : res.status(401).json({ error: 'Wrong admin password.' });
const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// READ products (customer)
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY line, product_id');
  res.json(rows);
});

// CREATE order (customer)
app.post('/api/orders', async (req, res) => {
  const { name, email, phone, address, items } = req.body;
  if (![name, email, phone, address].every(v => v && String(v).trim()))
    return res.status(400).json({ error: 'Please fill in every field.' });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: 'Enter a valid email address.' });
  if (!/^(09|\+639)\d{9}$/.test(phone))
    return res.status(400).json({ error: 'Enter a valid mobile number, like 09171234567.' });
  if (!Array.isArray(items) || !items.length)
    return res.status(400).json({ error: 'Your order is empty.' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `INSERT INTO customers (full_name, email, phone, address) VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), phone=VALUES(phone), address=VALUES(address)`,
      [name.trim(), email.trim(), phone, address.trim()]);
    const [[c]] = await conn.query('SELECT customer_id FROM customers WHERE email=?', [email.trim()]);
    const [o] = await conn.query('INSERT INTO orders (customer_id) VALUES (?)', [c.customer_id]);
    for (const it of items) {
      const [[p]] = await conn.query('SELECT price, stock FROM products WHERE product_id=? FOR UPDATE', [it.product_id]);
      if (!p) throw new Error('A product in your order no longer exists.');
      if (!(it.quantity > 0) || it.quantity > p.stock) throw new Error('Not enough stock for one of your items.');
      await conn.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?,?,?,?)',
        [o.insertId, it.product_id, it.quantity, p.price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE product_id=?', [it.quantity, it.product_id]);
    }
    await conn.commit();
    res.json({ order_id: o.insertId });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally { conn.release(); }
});

// READ all orders (admin)
app.get('/api/orders', admin, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT o.order_id, o.status, o.created_at, c.full_name, c.phone, c.address,
            SUM(i.quantity * i.unit_price) AS total,
            GROUP_CONCAT(CONCAT(p.name, ' x', i.quantity) SEPARATOR ', ') AS items
     FROM orders o
     JOIN customers c ON c.customer_id = o.customer_id
     JOIN order_items i ON i.order_id = o.order_id
     JOIN products p ON p.product_id = i.product_id
     GROUP BY o.order_id, c.full_name, c.phone, c.address
     ORDER BY o.created_at DESC`);
  res.json(rows);
});

// UPDATE order status (admin)
app.patch('/api/orders/:id', admin, async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
  const [r] = await pool.query('UPDATE orders SET status=? WHERE order_id=?', [req.body.status, req.params.id]);
  r.affectedRows ? res.json({ ok: true }) : res.status(404).json({ error: 'Order not found.' });
});

// DELETE order (admin)
app.delete('/api/orders/:id', admin, async (req, res) => {
  const [r] = await pool.query('DELETE FROM orders WHERE order_id=?', [req.params.id]);
  r.affectedRows ? res.json({ ok: true }) : res.status(404).json({ error: 'Order not found.' });
});

app.listen(3000, () => console.log('ONSCENT running at http://localhost:3000'));
