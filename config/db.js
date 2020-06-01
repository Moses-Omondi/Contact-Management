const mongoose = require("mongoose");
const config = require("config");
mongoose.set('useCreateIndex', true);

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    
    console.log(`Database successfully connected 🚀`);
  } catch (error) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
 