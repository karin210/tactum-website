import { model, models, Schema } from "mongoose";

const ReservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    // Financial Tracking
    totalPrice: { type: Number, required: true }, // e.g., 1000.00
    depositAmount: { type: Number, required: true }, // e.g., 200.00
    balanceAmount: { type: Number, required: true }, // Remaining (Total - Deposit)

    // Payment References (Stripe IDs)
    stripeCustomerId: { type: String },
    depositPaymentIntentId: { type: String }, // First payment
    balancePaymentIntentId: { type: String }, // Second payment

    paymentStatus: {
      type: String,
      enum: ["unpaid", "deposit_paid", "fully_paid", "refunded"],
      default: "unpaid",
    },
    // Booking Details
    reservationDate: { type: Date, required: true },
    city: { type: String },
    metadata: { type: Object },
  },
  { timestamps: true },
);

export default models.Reservation || model("Reservation", ReservationSchema);
