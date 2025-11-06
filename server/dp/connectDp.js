const mongoose = require('mongoose');

const connectDp = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected with DP successfully`);
  } catch (error) {
    console.log(`connect DP failed` + error.message);
    process.exit(1);
  }
};

module.exports = connectDp;
