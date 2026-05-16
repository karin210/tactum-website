"use client";

import { useEffect, useState } from "react";
import "./header.css";

export default function Header() {
  const [reservationCount, setReservationCount] = useState<number | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/reservations/count/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.count === "number") {
          setReservationCount(data.count);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <header>
      <div id="logo-container">
        <svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg">
          <path
            d="
              M 425 25
              H 50
              A 25 25 0 0 0 25 50
              V 250
              A 25 25 0 0 0 50 275
              H 425
            "
            fill="none"
            stroke="#FAFAFA"
            strokeWidth="25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg">
          <path
            d="
              M 25 275
              H 400
              A 25 25 0 0 0 425 250
              V 50
              A 25 25 0 0 0 400 25
              H 25
            "
            fill="none"
            stroke="#FAFAFA"
            strokeWidth="25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <nav>
        {reservationCount !== null && (
          <div className="reservation-counter">
            Reservations: {reservationCount}
          </div>
        )}
      </nav>
      <div></div>
    </header>
  );
}
