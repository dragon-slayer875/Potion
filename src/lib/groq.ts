import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import { uploadImage } from "./supabase";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hfClient = new HfInference(process.env.HGF_TOKEN);

export async function generateImagePrompt(name: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a creative and helpful AI assistant, capable of generating thumbnail descriptions for my notes. Your output will be fed into DALL-E API to generate a thumbnail. The description should be minimalistic and flat styled.",
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my notebook title ${name}.`,
        },
      ],
    });
    const imageDescription = response.choices[0]?.message?.content || "";
    return imageDescription as string;
  } catch (error) {
    console.error(error);
  }
}

export async function generateImage(image_description: string) {
  try {
    const image = await hfClient.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: image_description,
      parameters: { num_inference_steps: 5 },
      provider: "fal-ai",
    });
    const imageUploadData = await uploadImage(image);
    const imageUrl =
      `https://supabase.com/dashboard/project/mygrscvbvyqjeebeelev/storage/buckets/potion-storage` +
      imageUploadData?.path;
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
}
