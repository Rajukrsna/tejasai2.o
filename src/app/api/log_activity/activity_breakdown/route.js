import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Daily from "@/models/Daily/Schema";

export async function GET() {
    const userId  = "user_2pQbMG8GIQOhas0DonijxDCsi0T";

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const breakdown = await Daily.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          _id: 0,
          co2_transportation: 1,
          co2_energy: 1,
          co2_diet: 1,
          co2_recycling: 1,
          co2_travel: 1,
        },
      },
    ]);

    const activity = breakdown[0] || {};

    return NextResponse.json({
      categories: [
        { label: "Transportation", value: activity.co2_transportation || 0 },
        { label: "Energy", value: activity.co2_energy || 0 },
        { label: "Diet", value: activity.co2_diet || 0 },
        { label: "Recycling", value: activity.co2_recycling || 0 },
        { label: "Travel", value: activity.co2_travel || 0 },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data." }, { status: 500 });
  }
}
