import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const translateWithGemini = async (fieldsToTranslate, targetLanguage) => {
    const prompt = `
        You are a professional content localization expert.
        Translate the string values in the following JSON object into ${targetLanguage}.
        - Maintain the original JSON structure and keys exactly.
        - Respond with ONLY the translated, valid JSON object and nothing else. Do not wrap it in markdown or add any commentary.

        JSON to translate:
        ${JSON.stringify(fieldsToTranslate, null, 2)}
    `;

    const response = await genAI.models.generateContent({
        model: import.meta.env.VITE_GEMINI_MODEL,
        contents: prompt,
    });

    let responseText = response.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/```json|```/g, "").trim();

    console.log("Gemini response:", responseText);

    return JSON.parse(responseText);

};

export default translateWithGemini;