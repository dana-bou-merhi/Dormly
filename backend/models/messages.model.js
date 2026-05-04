import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  content: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
status: {  type: String,  enum: ['pending', 'replied', 'closed'],  default: 'pending' }

},{ timestamps: true });



export const Message = mongoose.model('Message', messageSchema);
