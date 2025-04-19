import { GoogleGenAI, Modality } from "@google/genai";
import { storage } from "@/config/appwriteConfig";
import { v4 as uuidv4 } from "uuid";
import { File } from "node:buffer"; // Requires Node.js 20+ OR use `undici`

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate image with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        temperature: 0.7,
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    const base64Image = parts.find((part) => part.inlineData)?.inlineData?.data;

    if (!base64Image) {
      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(base64Image, "base64");
    const fileName = `generated-${uuidv4()}.png`;

    // Appwrite expects a native File or Buffer
    const appwriteFile = new File([buffer], fileName, { type: "image/png" });

    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      uuidv4(),
      appwriteFile
    );
    

    const fileURL = storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      uploadedFile.$id
    );

    console.log(fileURL)

    return new Response(JSON.stringify({ imageUrl: fileURL }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🔥 Error in API Route:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
