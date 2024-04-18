const mongoose = require("mongoose"); 

const { Schema } = mongoose;

const reactionSchema = new Schema ({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {type: String, required: true, maxlength: 280},
    username: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const thoughtSchema = new Schema ({
    thoughtText: {type: String, required: true, minlength: 1, maxlength: 280},
    createdAt: {type: Date, default: Date.now},
    username: {type: String , required: true},
    reactions: [reactionSchema], 
})

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
}
)

const Thought = mongoose.model ('thought', thoughtSchema)

module.exports = Thought