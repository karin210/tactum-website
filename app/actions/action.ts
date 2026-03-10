"use server";

import Lead from "@/lib/models/users";
import connectDB from "@/lib/mongoDBConnection";

interface LeadData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
}

export interface FormState {
  success: boolean | null; // Allow null for the initial state
  message: string;
}

export const createLead = async (
  initialState: FormState,
  formData: FormData,
) => {
  await connectDB();
  try {
    const leadData: LeadData = {
      first_name: formData.get("first_name")?.toString(),
      last_name: formData.get("last_name")?.toString(),
      email: formData.get("email")?.toString() as string,
      phone: formData.get("phone")?.toString(),
    };
    const newLead = new Lead(leadData);
    const res = await newLead.save();
    return {
      success: true,
      message: "¡Listo, recibirás noticias sobre Tactum!",
    };
    console.log(res);
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      message: err.message || "Something went wrong. Please try again.",
    };
  }
};
