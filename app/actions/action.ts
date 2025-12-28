"use server";

import Lead from "@/lib/models/users";
import connectDB from "@/lib/mongoDBConnection";

interface LeadData {
  first_name?: string
  last_name?: string
  email: string
  phone?: string
}

export const createLead = async(formData: FormData) => {
  await connectDB();
  try {
    const leadData: LeadData = {
      first_name: formData.get("first_name")?.toString(),
      last_name: formData.get("last_name")?.toString(),
      email: formData.get("email")?.toString() as string,
      phone: formData.get("phone")?.toString(),
    }
    const newLead = new Lead(leadData);
    const res = await newLead.save();
    console.log(res);
  } catch(err) {
    console.log(err);
  }
}