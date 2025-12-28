import { model, models, Schema } from "mongoose";

const LeadsSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
  },
  phone: Number,
});

const Lead = models.Lead || model("Lead", LeadsSchema);

export default Lead;