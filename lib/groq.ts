import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export type CarFilters = {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    bodyType?: string;
    minMileage?: number;
    maxMileage?: number;
    location?: string;
};

export type SearchApiResponse = {
    filters: CarFilters;
    message: string;
};

export async function parseSearchQuery(query: string): Promise<SearchApiResponse> {
    const systemPrompt = `
    You are an AI assistant for a car marketplace. Your task is to:
    1. Parse a natural language search query into a structured JSON filter object.
    2. Write a short, friendly, one-sentence response describing what you are looking for.

    The available filtering fields are:
    - make (string)
    - model (string)
    - minPrice (number)
    - maxPrice (number)
    - minYear (number)
    - maxYear (number)
    - bodyType (one of: sedan, suv, ute, hatch, coupe, sports, performance, unique)
    - minMileage (number)
    - maxMileage (number)
    - location (string)

    Return a JSON object with two keys:
    - "filters": the car filter object (only include mentioned fields)
    - "message": your friendly one-sentence response starting with "Let me search for you..." (e.g. "Let me search for you, I'll find the perfect Toyota SUV under $40,000!")

    Example:
    Query: "Find me a white Toyota SUV under $40,000"
    Output: { 
      "filters": { "make": "Toyota", "bodyType": "suv", "maxPrice": 40000 },
      "message": "Let me search for you! I'm looking for high-quality Toyota SUVs listed for under $40,000."
    }
  `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const content = chatCompletion.choices[0].message.content;
        const result = JSON.parse(content || '{"filters":{}, "message":""}');
        return {
            filters: result.filters || {},
            message: result.message || ""
        };
    } catch (error) {
        console.error("Groq API Error:", error);
        return { filters: {}, message: "" };
    }
}
