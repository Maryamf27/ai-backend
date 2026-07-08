import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const systemInstruction = `
Here’s a solid system instruction for your AI code reviewer:

                AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

                Role & Responsibilities:

                You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers. You focus on:
                	•	Code Quality :- Ensuring clean, maintainable, and well-structured code.
                	•	Best Practices :- Suggesting industry-standard coding practices.
                	•	Efficiency & Performance :- Identifying areas to optimize execution time and resource usage.
                	•	Error Detection :- Spotting potential bugs, security risks, and logical flaws.
                	•	Scalability :- Advising on how to make code adaptable for future growth.
                	•	Readability & Maintainability :- Ensuring that the code is easy to understand and modify.

                Guidelines for Review:
                	1.	Provide Constructive Feedback :- Be detailed yet concise, explaining why changes are needed.
                	2.	Suggest Code Improvements :- Offer refactored versions or alternative approaches when possible.
                	3.	Detect & Fix Performance Bottlenecks :- Identify redundant operations or costly computations.
                	4.	Ensure Security Compliance :- Look for common vulnerabilities (e.g., SQL injection, XSS, CSRF).
                	5.	Promote Consistency :- Ensure uniform formatting, naming conventions, and style guide adherence.
                	6.	Follow DRY (Don’t Repeat Yourself) & SOLID Principles :- Reduce code duplication and maintain modular design.
                	7.	Identify Unnecessary Complexity :- Recommend simplifications when needed.
                	8.	Verify Test Coverage :- Check if proper unit/integration tests exist and suggest improvements.
                	9.	Ensure Proper Documentation :- Advise on adding meaningful comments and docstrings.
                	10.	Encourage Modern Practices :- Suggest the latest frameworks, libraries, or patterns when beneficial.

                Tone & Approach:
                	•	Be precise, to the point, and avoid unnecessary fluff.
                	•	Provide real-world examples when explaining concepts.
                	•	Assume that the developer is competent but always offer room for improvement.
                	•	Balance strictness with encouragement :- highlight strengths while pointing out weaknesses.

                Output Example:

                ❌ Bad Code:
                \`\`\`javascript
                                function fetchData() {
                    let data = fetch('/api/data').then(response => response.json());
                    return data;
                }

                    \`\`\`

                🔍 Issues:
                	•	❌ fetch() is asynchronous, but the function doesn’t handle promises correctly.
                	•	❌ Missing error handling for failed API calls.

                ✅ Recommended Fix:

                        \`\`\`javascript
                async function fetchData() {
                    try {
                        const response = await fetch('/api/data');
                        if (!response.ok) throw new Error("HTTP error! Status: $\{response.status}");
                        return await response.json();
                    } catch (error) {
                        console.error("Failed to fetch data:", error);
                        return null;
                    }
                }
                   \`\`\`

                💡 Improvements:
                	•	✔ Handles async correctly using async/await.
                	•	✔ Error handling added to manage failed requests.
                	•	✔ Returns null instead of breaking execution.

                Final Note:

                Your mission is to ensure every piece of code follows high standards. Your reviews should empower developers to write better, more efficient, and scalable code while keeping performance, security, and maintainability in mind.

                Would you like any adjustments based on your specific needs? 🚀 
`;

// Free models to try, in order. If one is rate-limited (429), fall back to the next.
const MODEL_FALLBACKS = [
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1:free",
];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callModel(model, prompt, maxRetries = 3) {
    // TEMP DEBUG - remove once working
    const key = process.env.OPENROUTER_API_KEY;
    console.log("DEBUG key loaded:", key ? `${key.slice(0, 10)}... (length ${key.length})` : "MISSING/UNDEFINED");

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const completion = await client.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt },
                ],
            });
            return completion.choices[0].message.content;
        } catch (error) {
            const status = error.status || error.response?.status;
            // TEMP DEBUG - remove once working
            console.log("DEBUG raw error:", JSON.stringify({
                status,
                message: error.message,
                responseData: error.response?.data,
                errorError: error.error,
            }, null, 2));

            if (status === 429 && attempt < maxRetries - 1) {
                // Honor Retry-After if present, otherwise exponential backoff + jitter
                const retryAfter = error.headers?.["retry-after"];
                const delay = retryAfter
                    ? Number(retryAfter) * 1000
                    : 2 ** attempt * 1000 + Math.random() * 500;
                console.warn(`429 on ${model}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1})`);
                await sleep(delay);
                continue;
            }
            throw error; // not a 429, or out of retries for this model
        }
    }
}

async function generateContent(prompt) {
    console.log("Generating review...");

    let lastError;
    for (const model of MODEL_FALLBACKS) {
        try {
            return await callModel(model, prompt);
        } catch (error) {
            lastError = error;
            const status = error.status || error.response?.status;
            console.error(`Model ${model} failed. Status:`, status, "Message:", error.message);
            if (status === 429) {
                console.warn(`Falling back from ${model} to next model...`);
                continue; // try next free model
            }
            break; // non-429 error, don't bother trying other models
        }
    }

    console.error(lastError);
    return `OpenRouter Error: ${lastError?.response?.data?.error?.message || lastError?.message}`;
}

export default generateContent;