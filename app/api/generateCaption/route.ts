import { NextResponse } from "next/server";
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/gpt2";

export async function POST(req: Request) {
  try {
    const { memeName } = await req.json();

    const prompt = `Generate a short and funny meme caption for a meme named "${memeName}". Keep it to one humorous sentence..`;
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );
    const caption =
      response.data[0]?.generated_text || "No caption generated 😅";

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("Error generating AI caption:", error);
    return NextResponse.json(
      { error: `Failed to generate caption:` },
      { status: 500 }
    );
  }
}
