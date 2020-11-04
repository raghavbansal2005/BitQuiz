const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  question: String,
  correct_answer: String,
  options: [String],
  solution: String,
  topic: String,
  competency: String
})

module.exports = mongoose.model('question', QuestionSchema)