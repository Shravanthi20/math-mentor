const mongoose= require("mongoose")

const questionSchema= mongoose.Schema({
    question:{
        type: Number,
        required:true,
        unique: true,
    },
    answer: {
        type: String,
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
})

const Question= mongoose.model("Question", questionSchema)

module.exports= Question