import connectDB from "@/lib/mongoDBConnection";
import Reservation from "@/lib/models/reservations";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendCount = async () => {
        try {
          const count = await Reservation.countDocuments();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ count })}\n\n`),
          );
        } catch (err) {
          console.error("Error sending count:", err);
        }
      };

      // Send initial count
      await sendCount();

      // Listen for changes
      const changeStream = Reservation.watch();

      changeStream.on("change", async () => {
        await sendCount();
      });

      // We should ideally close the changeStream when the connection is closed.
      // However, ReadableStream in Next.js/Edge can be tricky to detect closure.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
