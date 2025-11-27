import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = 3000;

// EJS + static setup
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, booksCollection, borrowedCollection;

async function connectDB() {
  await client.connect();
  db = client.db("libraryDB");
  booksCollection = db.collection("books");
  borrowedCollection = db.collection("borrowed");

  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}

connectDB();

// --------------------- ROUTES ---------------------

// HOME PAGE
app.get("/", (req, res) => res.render("index"));

// VIEW ALL BOOKS
app.get("/books", async (req, res) => {
  const books = await booksCollection.find().toArray();
  res.render("books", { books });
});

// ADD BOOK PAGE
app.get("/add-book", (req, res) => res.render("addBook"));

// ADD BOOK PROCESS
app.post("/add-book", async (req, res) => {
  const { title, author, tags, totalCopies } = req.body;

  const newBook = {
    title,
    author,
    tags: tags.split(",").map(t => t.trim()),
    totalCopies: Number(totalCopies),
    availableCopies: Number(totalCopies)
  };

  await booksCollection.insertOne(newBook);
  res.redirect("/books");
});

// SEARCH PAGE
app.get("/search", (req, res) => res.render("search"));

// SEARCH RESULTS
app.get("/search-results", async (req, res) => {
  const { author, tag } = req.query;
  const filter = {};

  if (author) filter.author = author;
  if (tag) filter.tags = tag;

  const books = await booksCollection.find(filter).toArray();
  res.render("books", { books });
});

// BORROW A BOOK
app.post("/borrow/:id", async (req, res) => {
  const bookId = new ObjectId(req.params.id);
  const book = await booksCollection.findOne({ _id: bookId });

  if (book.availableCopies > 0) {
    await booksCollection.updateOne({ _id: bookId }, { $inc: { availableCopies: -1 } });

    await borrowedCollection.insertOne({
      bookId,
      userId: "guest",
      borrowDate: new Date(),
      returnDate: null
    });
  }

  res.redirect("/books");
});

// RETURN A BOOK
app.post("/return/:id", async (req, res) => {
  const borrowId = new ObjectId(req.params.id);

  const record = await borrowedCollection.findOne({ _id: borrowId });
  if (!record || record.returnDate) return res.redirect("/books");

  await borrowedCollection.updateOne(
    { _id: borrowId },
    { $set: { returnDate: new Date() } }
  );

  await booksCollection.updateOne(
    { _id: record.bookId },
    { $inc: { availableCopies: 1 } }
  );

  res.redirect("/books");
});

// MOST BORROWED
app.get("/most-borrowed", async (req, res) => {
  const result = await borrowedCollection.aggregate([
    { $group: { _id: "$bookId", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookDetails"
      }
    },
    {
      $project: {
        borrowCount: 1,
        title: { $arrayElemAt: ["$bookDetails.title", 0] },
        author: { $arrayElemAt: ["$bookDetails.author", 0] }
      }
    }
  ]).toArray();

  res.render("mostBorrowed", { result });
});
