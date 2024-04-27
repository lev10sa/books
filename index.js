const XLSX = require("xlsx");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const vendor = "development";
const strings =
  vendor === "production"
    ? "mongodb+srv://alfiandi27_:Alfiandi2708_@mernapp.wxtw4s1.mongodb.net/?retryWrites=true&w=majority"
    : "mongodb://localhost:27017/seg";

mongoose.connect(strings, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const Schema = mongoose.Schema;
const gymSchema = new Schema(
  {
    name: { type: String, required: true },
    isbn: { type: String, required: true },
    category: { type: String, required: true },
    bookPrice: { type: String, required: true },
    ebookPrice: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Gym = mongoose.model("Book", gymSchema);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const workbook = XLSX.readFile("data.xlsx");
const sheet_name_list = workbook.SheetNames;
const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); // Add this line to log the loaded data

// Sort data by name in ascending order (A-Z)
jsonData.sort((a, b) => (a.name > b.name ? -1 : 1));

jsonData.forEach((data) => {
  const orderedData = {
    name: data["Name"],
    isbn: data["ISBN"],
    category: data["Category"],
    bookPrice: data["Book"],
    ebookPrice: data["Ebook"],
  };
  console.log(orderedData);
  const gym = new Gym(orderedData);
  gym
    .save()
    .then(() => console.log("Document saved successfully"))
    .catch((err) => {
      console.error("Error saving document:", err);
      if (err.name === "ValidationError") {
        console.log("Validation errors:", err.errors);
      }
    });
});
