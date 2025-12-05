📚 Library Inventory Management System

A simple web application built with Node.js, Express, EJS, and MongoDB for managing library books. Users can add books, view books, search, borrow/return, and see most-borrowed books. Includes a modern UI with Dark Mode.

🚀 Features: ➕ Add new books 📖 View all books 🔍 Search by author or tag 📉 Track available copies 🔄 Borrow & return books 🔥 View most borrowed books (MongoDB Aggregation) 🌙 Dark Mode UI 📱 Fully responsive (Bootstrap 5)

🚀 How to Download & Run

1️⃣ Download the Project Option A – ZIP file • Click the Code button on GitHub • Select Download ZIP • Extract the folder

Option B – Git clone git clone https://github.com/YOUR_USERNAME/library-management.git cd library-management

2️⃣ Install Dependencies npm install

3️⃣ Install & Start MongoDB This project requires MongoDB. Make sure MongoDB is running:

4️⃣ Start the Website Normally npm start

Open in browser: http://localhost:3000

Add Sample Books: mongosh use libraryDB db.books.insertMany([...])

📁 Main Contents • index.js – Server logic • views/ – EJS pages • public/ – CSS & Dark mode script • books & borrowed collections stored in MongoDB
