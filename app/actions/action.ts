"use server";

import User from "@/lib/models/users";
import connectDB from "@/lib/mongoDBConnection";

interface LeadData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  city?: string; // Included to match your new schema
}

export interface FormState {
  success: boolean | null;
  message: string;
}

export const createUser = async (
  initialState: FormState,
  formData: FormData,
) => {
  await connectDB();

  try {
    // 1. Normalize the email (trim and lowercase is best practice)
    const rawEmail = formData.get("email")?.toString();
    if (!rawEmail) {
      return { success: false, message: "El correo es necesario." };
    }
    const email = rawEmail.toLowerCase().trim();

    const userData: LeadData = {
      first_name: formData.get("first_name")?.toString(),
      last_name: formData.get("last_name")?.toString(),
      email: email,
      phone: formData.get("phone")?.toString(),
      city: formData.get("city")?.toString() || "Other",
    };

    // 2. Call the method on the MODEL (Capital 'U' User)
    await User.findOneAndUpdate(
      { email: userData.email }, // Search filter
      {
        $set: userData, // Update these fields
        $setOnInsert: { userType: "lead" }, // Only set this if it's a new document
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return {
      success: true,
      message: "¡Listo, recibirás noticias sobre Tactum!",
    };
  } catch (err: any) {
    console.error("Database Error:", err);

    // Provide a cleaner error message for the UI
    const errorMessage =
      err.code === 11000
        ? "Este correo ya está registrado."
        : "Hubo un problema. Por favor, intenta de nuevo.";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
