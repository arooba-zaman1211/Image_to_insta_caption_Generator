require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

async function extractLabelsFromImage(imagePath) {
  console.log("Image Path:", imagePath);

  try {
    const imageBuffer = fs.readFileSync(imagePath);

    console.log("Sending request to Hugging Face Image Captioning API...");
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      { inputs: imageBuffer.toString("base64") },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    console.log(
      "Hugging Face API Response:",
      JSON.stringify(response.data, null, 2)
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const labels = response.data.map((label) => label.generated_text);
      console.log("Extracted Labels:", labels);
      return labels;
    } else {
      console.warn("No labels detected.");
      return [];
    }
  } catch (error) {
    console.error(
      "Error in Hugging Face API:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function generateCaptionFromGroq(labels) {
  if (labels.length === 0) {
    console.warn("No labels detected, skipping caption generation.");
    return "No objects detected.";
  }

  try {
    console.log("Sending request to Groq API with labels:", labels);
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are an Instagram caption generator.",
          },
          {
            role: "user",
            content: `Generate a catchy Instagram caption based on these objects: ${labels.join(
              ", "
            )}.`,
          },
        ],
        max_tokens: 50,
      },
      {
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      }
    );

    console.log("Groq API Response:", JSON.stringify(response.data, null, 2));
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in Groq API:", error.response?.data || error.message);
    return "Error generating caption.";
  }
}

exports.processImageAndGenerateCaption = async (imagePath) => {
  console.log("Starting Image Processing...");
  const labels = await extractLabelsFromImage(imagePath);
  console.log("Proceeding to caption generation...");
  const caption = await generateCaptionFromGroq(labels);
  console.log("Final Generated Caption:", caption);
  return caption;
};
