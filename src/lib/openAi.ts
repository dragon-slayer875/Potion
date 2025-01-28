import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImagePrompt(name: string) {
  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
    const imageDescription = gptResponse.choices[0].message;
    return imageDescription;
  } catch (error) {
    console.error(error);
  }
}
export async function generateImage() { }
