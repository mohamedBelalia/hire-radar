import mongoose, { Document, models, Schema } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

export interface UserI extends Document{
    name: string, 
    username: string,
    password: string,
    profile_picture?: string,
    status?: 'online' | 'offline' | 'typing'
}


const userSchema = new Schema<UserI>({
    name: {type: String, required: true, max: 50,},
    username: {type: String, unique: true, required: true, max: 20},
    password: {type: String, required: true},
    profile_picture: {type: String},
    status: {type: String, enum: ['online','offline','typing']}
},{
    timestamps: true
})

userSchema.virtual('profilePictureUrl').get(function () {
    if (!this.profile_picture) return null;
  
    return `${process.env.BASE_URL || 'http://localhost:5000'}${this.profile_picture}`;
  });
  
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = models.User || mongoose.model<UserI>('User',userSchema)
export default User;