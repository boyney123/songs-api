"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connect = require("../../app/config/database");
const Song = mongoose.model("Song");
const { getMetadataForFile } = require("../../app/utils/metadata");

const songsDirectory = path.join(__dirname, "../../public/songs");

connect();

const main = async () => {
  const files = fs.readdirSync(songsDirectory).map(async file => {
    return getMetadataForFile(songsDirectory, file);
  });

  const data = await Promise.all(files);

  try {
    await Song.collection.insertMany(data);
  } catch (error) {
    console.log("Failed to populate the database");
    console.log(error);
    process.exit(1);
  }

  console.log("Successfully populated database");
  process.exit(0);
};

main();
