const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URL;
const User = require('../models/User');
const SALT_ROUNDS = 10;
async function run() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
  const users = await User.find({});
  console.log(`Found ${users.length} users. Starting...`);

  let updated = 0;
  for (const user of users) {
    const pwd = user.password || '';
    if (typeof pwd === 'string' && pwd.startsWith('$2') && pwd.length >= 60) {
      continue;
    }

    if (!pwd) {
      console.log(
        `Skipping user ${user._id} (${
          user.email || user.name
        }) — no password field.`
      );
      continue;
    }

    try {
      const hash = await bcrypt.hash(pwd, SALT_ROUNDS);
      user.password = hash;
      await user.save();
      updated++;
      console.log(
        `Hashed password for ${user._id} (${user.email || user.name})`
      );
    } catch (err) {
      console.error(`Failed for ${user._id}:`, err);
    }
  }

  console.log(`Done. Updated ${updated} users.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
