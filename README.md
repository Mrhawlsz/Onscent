# ONSCENT starter

## Hii syug, basically i prompted lang claude on an example website based on our pdfs (appdev & infoman instructions)
- Bali ang purpose lang sana neto is that we get to see the final structure on what we need to do forda projects
- still trying to understand it kung paano nangyari toh but its so cool try nyo irun hehe
- anyways install nyo node.js rinn
- U need (terminal <- either sa shell or sa vscode nalang | MySQL cli | and yun lang i think)

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
