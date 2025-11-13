
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const readFileAsText = (file: File): Promise<{ name: string, content: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
            resolve({ name: file.name, content: event.target.result });
        } else {
            // Fallback for non-text files to avoid errors, though the prompt expects text.
            resolve({ name: file.name, content: `[Binary file content for ${file.name}]`});
        }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
      "candidates": {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            "name": { type: Type.STRING },
            "role": { type: Type.STRING },
            "matchScore": { type: Type.INTEGER },
            "contact": { 
                type: Type.OBJECT, 
                properties: { 
                    // FIX: Corrected syntax error by removing extra quote and making it a valid object property.
                    "email": { type: Type.STRING }, 
                    "phone": { type: Type.STRING } 
                } 
            },
            "linkedin": { type: Type.STRING },
            "summary": { type: Type.STRING },
            "matchedRequirements": { type: Type.ARRAY, items: { type: Type.STRING } },
            "missingRequirements": { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "role", "matchScore", "contact", "linkedin", "summary", "matchedRequirements", "missingRequirements"]
        }
      },
      "overallSuggestions": { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["candidates", "overallSuggestions"]
};

export const analyzeResumes = async (jd: string, resumes: File[], isSingleCandidate: boolean): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const fileContents = await Promise.all(resumes.map(readFileAsText));
  const resumeTexts = fileContents.map(file => `--- RESUME: ${file.name} ---\n${file.content}`).join('\n\n');

  const systemPrompt = `
    You are "Chankya AI," a world-class resume analyzer.
    Your task is to analyze a job description (JD) and a batch of resumes.
    You MUST return a JSON object with two top-level keys: "candidates" and "overallSuggestions".
    
    1.  **"candidates"**: This MUST be an array of objects. Each object represents one candidate.
        For each candidate, you MUST provide:
        - "name": The candidate's full name. If not found, infer from the file name or use "Unknown".
        - "role": Their most recent or relevant job title.
        - "matchScore": An integer (0-100) representing their fit for the JD.
        - "contact": An object with "email" and "phone". If not found, use "Not Found".
        - "linkedin": Full LinkedIn URL. If not found, use "Not Found".
        - "summary": A 2-3 sentence AI summary of their profile *as it relates to the JD*.
        - "matchedRequirements": An array of strings. Each string is a *key requirement from the JD* that the candidate *meets*.
        - "missingRequirements": An array of strings. Each string is a *key requirement from the JD* that the candidate *appears to be missing*.
    
    2.  **"overallSuggestions"**: This MUST be an array of strings. 
        ${isSingleCandidate
          ? `Provide 3-4 actionable suggestions for the *candidate* to improve their resume for this specific job.`
          : `Provide 3-4 high-level, actionable suggestions for the *recruiter* based on the *entire batch* of candidates.`
        }

    Strictly adhere to this JSON schema. Do not add any commentary or markdown formatting outside of the JSON object.
  `;

  const userQuery = `
    **Job Description:**
    ${jd}

    **Resumes:**
    ${resumeTexts}
  `;

  try {
    // FIX: Updated generateContent call to align with Gemini API guidelines.
    // 'systemInstruction' is now a string inside the 'config' object.
    // 'contents' is simplified to a string.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        }
    });
    
    const jsonText = response.text;
    const parsedData: AnalysisResult = JSON.parse(jsonText);
    
    // Sort candidates by match score in descending order
    parsedData.candidates.sort((a, b) => b.matchScore - a.matchScore);
    
    return parsedData;

  } catch (err) {
    console.error('Gemini API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
    throw new Error(`Analysis failed. Please check the API key and try again. Details: ${errorMessage}`);
  }
};
