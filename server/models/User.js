import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})

const User = mongoose.model("User", UserSchema);
export default User;