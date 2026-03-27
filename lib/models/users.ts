import { model, models, Schema, Document } from "mongoose";

// Defining an interface for TypeScript type safety in your Server Actions
interface IUser extends Document {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: number;
  city?: string;
  userType: "lead" | "customer";
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: String,
    email: {
      type: String,
      required: true,
      unique: true, // Crucial: prevents duplicate leads/users
      lowercase: true,
      trim: true,
    },
    phone: Number,
    city: {
      type: String,
      default: "Other",
    },
    // This field tracks the "intent" level of the user
    userType: {
      type: String,
      enum: ["lead", "customer"],
      default: "lead",
    },
    // Link this to Stripe once they start a checkout session
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple 'null' values for leads without Stripe IDs
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Export as "User" to represent the unified identity
const User = models.User || model<IUser>("User", UserSchema);

export default User;
