import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Lumiere, an advanced Socratic AI Tutor.

YOUR PRIME DIRECTIVE:
You must NEVER solve the problem for the user. You must NEVER give the final answer.

YOUR PROCESS:
1. VISION ANALYSIS: Scan the handwriting in the image. Identify the mathematical problem and the user's specific steps.
2. ERROR DETECTION: Pinpoint the exact step where logic failed (e.g., sign error, wrong formula, algebraic mistake).
3. THINKING TRACE: (Internal) Formulate why they made that mistake.
4. RESPONSE GENERATION: Generate a single, short, audible hint.
   - Bad: "You missed a negative sign on line 2, so the answer is 5."
   - Good: "Look at the second line again. How does the integration by parts formula handle the negative sign here?"

TONE:
Calm, patient, wise. Like a professor looking over a student's shoulder.

VOICE OPTIMIZATION:
- Keep responses under 20 words where possible.
- Be conversational. Use "Okay," "I see," or "Good."
- Do not dictate mathematical symbols like "integral from a to b" unless necessary. Describe them conceptually.

FORMATTING:
- Use plain text only.
- Do NOT use LaTeX formatting or dollar signs ($) for math.
- Write "x squared" instead of $x^2$.
- Write "pi" instead of $\pi$.
`;

export interface ChatSession {
  chat: Chat;
  initialResponse: string;
}

/**
 * Starts a new chat session with the initial math image.
 */
export const startMathSession = async (base64Image: string): Promise<ChatSession> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const response = await chat.sendMessage({
      message: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "Analyze the math work in this image. Identify the specific error in logic. Do NOT solve the problem. Do NOT give the answer. Instead, ask one brief, guiding question to nudge the student back on track."
        }
      ]
    });

    if (!response.text) throw new Error("No response from AI");

    return {
      chat,
      initialResponse: response.text
    };
  } catch (error) {
    console.error("Session Start Error:", error);
    throw error;
  }
};

/**
 * Sends a text message to the existing chat session.
 */
export const sendChatMessage = async (chat: Chat, text: string): Promise<string> => {
  try {
    if (!text || text.trim() === "") {
      throw new Error("Cannot send empty message");
    }

    const response = await chat.sendMessage({
      message: text
    });

    if (!response.text) throw new Error("No response from AI");
    
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * Generates a similar example problem.
 */
export const getMathExample = async (chat: Chat): Promise<string> => {
  try {
    const response = await chat.sendMessage({
      message: "Generate a similar math problem to the one in the image (same concept, different numbers). Solve this new problem step-by-step for me to learn from. Label the steps clearly. Keep it concise. Use plain text only, NO dollar signs ($) or LaTeX formatting."
    });

    if (!response.text) throw new Error("No response from AI");
    
    return response.text;
  } catch (error) {
    console.error("Example Generation Error:", error);
    throw error;
  }
};