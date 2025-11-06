const express = require('express');
const morgan = require('morgan');
const connectDp = require('./dp/connectDp');
require('dotenv').config();
// const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const groupRoutes = require('./routes/group.route');
const { app, server } = require('./utils/socket');

app.use(morgan());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);

app.use('/', (req, res) => {
  res.send('Welcome to our chat application');
});

const main = async () => {
  try {
    await connectDp();
    server.listen(PORT, () => {
      console.log(`server running on port:${PORT}`);
    });
  } catch (error) {
    console.log(`server running failed`);
    process.exit(1);
  }
};

main();
