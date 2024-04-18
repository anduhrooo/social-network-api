const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }
        }
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: "thought"
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
}, {
    toJSON: {
        virtuals: true,
    },
    id: false
})

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});


const User = mongoose.model('user', userSchema)

module.exports = User