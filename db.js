const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://kasunabeysinghe:NnCfYVKJ1gAwickE@cluster0.dnq7pzv.mongodb.net/ezbook', { useNewUrlParser: true });

// Create a schema for your collection
const schema = new mongoose.Schema({
    primary: String,
    hs_code: String,
    nature_of_goods: String,
    shc: String
});

// Create a model for your collection
const Model = mongoose.model('hscode_natureofgoods', schema);

// Check for a successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  // Check for errors during connection
  mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });
  
// Query your collection and list all values of data_1 that contain the word "Live"
Model.find({ nature_of_goods: { $regex: /Live/ } }, { nature_of_goods: 1 })
  .then((data) => {
    console.log('Query executed successfully');
    data.forEach((doc) => {
      if (doc.nature_of_goods) {
        console.log(doc.nature_of_goods);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
