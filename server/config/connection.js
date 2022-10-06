const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.56.1:3000/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
