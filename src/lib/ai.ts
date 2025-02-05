import { HfInference } from "@huggingface/inference";
import { uploadImage } from "./supabase";
import { createGroq } from "@ai-sdk/groq";
import { generateText, streamText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const hfClient = new HfInference(process.env.HGF_TOKEN);

export async function generateImagePrompt(name: string) {
  try {
    const response = await generateText({
      model: groq("llama-3.3-70b-versatile"),
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
    const imageDescription = response.text || "";
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
      `https://mygrscvbvyqjeebeelev.supabase.co/storage/v1/object/public/potion-storage/` +
      imageUploadData?.path;
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function generateCompletion(prompt: string) {
  try {
    return streamText({
      model: groq("llama-3.3-70b-versatile"),
      messages: [
        {
          role: "system",
          content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
        },
        {
          role: "user",
          content: `I am writing a piece of text in a notion like text editor app.
        Help me complete my train of thought here: ##${prompt}##
        keep the tone of the text consistent with the rest of the text.
        keep the response short and sweet.`,
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
}
