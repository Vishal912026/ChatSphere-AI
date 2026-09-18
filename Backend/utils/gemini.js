import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getGeminiResponse = async (message) => {
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash-lite",
                contents: message,
                config: {
                    systemInstruction: "If a question involves current events, current officeholders, live prices, or any time-sensitive/real-time information, add exactly ONE short disclaimer line at the very end of your answer, in this exact format: '⚠️ Note: This information may be outdated — please verify from a current source.' Do not mention specific cutoff dates. For static/general-knowledge questions (science, history, definitions, comparisons, etc.), answer normally with no disclaimer."
                },
            });
            return response.text || "Sorry, I couldn't generate a response. Please try again.";
        } catch (err) {
            console.log(`Attempt ${attempt + 1} failed:`, err?.status || err.message);

           

                   const isRetryable = err?.status === 503 || err?.status === 429;
                           const isLastAttempt = attempt === maxRetries;

                                if (!isRetryable || isLastAttempt) {
                          return "Something went wrong while generating a response. Please try again in a moment.";
                    }

await delay(2000 * (attempt + 1));

        }
    }
};

export default getGeminiResponse;