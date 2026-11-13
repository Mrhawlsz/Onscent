# ONSCENT starter

## Hii syug, basically i prompted lang claude on an example website based on our pdfs (appdev & infoman instructions)
- Bali ang purpose lang sana neto is that we get to see the final structure on what we need to do forda projects
- still trying to understand it kung paano nangyari toh but its so cool try nyo irun hehe
- anyways install nyo node.js rinn
- U need (terminal <- either sa shell or sa vscode nalang | MySQL cli | and yun lang i think)
- to verify once installing node js type sa terminal node-v
- If PowerShell later blocks npm with a message about running scripts being disabled, run this once and answer Y:
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

## Run it
1. Install Node.js and MySQL (XAMPP's MySQL works too).
2. Create the database: `mysql -u root -p < schema.sql` (or paste schema.sql into phpMyAdmin/Workbench).
3. In `server.js`, check the MySQL user/password. Or set `DB_PASS` when starting.
4. `npm install` then `npm start`.
5. Open http://localhost:3000 (shop) and http://localhost:3000/admin.html (admin password: onscent123).

## Or (Installed the Node.js) / directly na sa terminal
1. Open nyo vscode terminal or terminal mismo
2. go to the directory of the project files ( gawa kau project folder for the files tas cd para sa directory)
3. after na sa directory type -> npm install  then wait lang
4. habang nag hihintay, buksan MySQL cli then type C:/directory/papuntang/projectfiles/scheme.sql
5. it shoud import the database itself (verify using SHOW TABLES FROM onscent;)
6. start mo na server sa terminal ulit (di sa MySQL ah)
7. if may pass CLI ng MySQL mo, type  $env:DB_PASS="passmo"
8. after that type -> npm start, u should see the localhost link diba diba

## How the pieces connect
Browser (HTML/CSS/JS) --fetch()--> Express routes in server.js --mysql2--> MySQL tables
- app.js calls `/api/products` and `/api/orders` with fetch().
- server.js receives the request, checks the data, runs SQL, and sends JSON back.
- MySQL stores products, customers, orders, order_items.
