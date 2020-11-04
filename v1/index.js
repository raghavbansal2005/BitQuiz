const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Question = require('./models/question')



mongoose.connect('mongodb+srv://owner-raghav:password123456@cluster0.gc8q9.mongodb.net/fbla?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => { 
  console.log('Connected to DB!')
}).catch(err => {
  console.log('ERROR:', err.message)
});
mongoose.set('useCreateIndex', true);






app.get("/", async (req, res) => {
    await Question.find({}).then(q => res.send(q));
});





















const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
  if (err) throw err
  console.log('Listening on port 3000...')
})