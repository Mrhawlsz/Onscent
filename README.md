# ONSCENT starter

## Run it
1. Install Node.js and MySQL (XAMPP's MySQL works too).
2. Create the database: `mysql -u root -p < schema.sql` (or paste schema.sql into phpMyAdmin/Workbench).
3. In `server.js`, check the MySQL user/password. Or set `DB_PASS` when starting.
4. `npm install` then `npm start`.
5. Open http://localhost:3000 (shop) and http://localhost:3000/admin.html (admin password: onscent123).

## How the pieces connect
Browser (HTML/CSS/JS) --fetch()--> Express routes in server.js --mysql2--> MySQL tables
- app.js calls `/api/products` and `/api/orders` with fetch().
- server.js receives the request, checks the data, runs SQL, and sends JSON back.
- MySQL stores products, customers, orders, order_items.
