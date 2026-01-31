"use server";

const BASE_URL = process.env.NODE_ENV == "development" ? "http://localhost:3000/" : ""; //TODO: define prod base url

export const createReservation = async(formData: FormData) => {

  await fetch(BASE_URL + "api/payment-intent", { method: "POST" });
}