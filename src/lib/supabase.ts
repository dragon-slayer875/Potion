import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL || "";
const supabaseKey = process.env.SUPABASE_PROJECT_KEY || "";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(image: Blob) {
  const { data, error } = await supabaseClient.storage
    .from("potion-storage")
    .upload(`public/${new Date().getTime()}.png`, image);

  if (error) {
    console.error(error);
    window.alert("Failed to upload image");
  }

  return data;
}
