
import { GoogleGenAI, Type } from "@google/genai";
import { Service, AIJobPlan, InventoryItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const responseSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The step type, e.g., 'prep', 'chemical_mix', 'application'."},
                    title: { type: Type.STRING, description: "A short title for the step." },
                    details: { type: Type.STRING, description: "Detailed instructions for the technician." },
                    completed: { type: Type.BOOLEAN, description: "Default to false." },
                    ingredients: {
                        type: Type.ARRAY,
                        description: "List of chemical ingredients for a mixing step.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "The inventory ID of the ingredient." },
                                name: { type: Type.STRING, description: "The name of the ingredient." },
                                unit: { type: Type.STRING, description: "The unit of measurement for the ingredient (e.g., 'gallons', 'lbs')." }
                            },
                            required: ["id", "name", "unit"]
                        }
                    },
                    mixRatio: { type: Type.STRING, description: "The mixing ratio instructions, e.g., '1 gallon of Sodium Hypochlorite and 4 oz of Eco Surfactant to 4 gallons of water'." },
                },
                required: ["type", "title", "details", "completed"]
            }
        }
    }
};


export const generateJobPlan = async (services: Service[], ingredients: InventoryItem[]): Promise<AIJobPlan | null> => {

    const serviceList = services.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
    const ingredientList = ingredients.map(i => `- ${i.name} (ID: ${i.id}, Unit: ${i.unit})`).join('\n');

    const prompt = `
        ROLE: Expert operations planner for "Surface Rejuvenators LLC", an eco-friendly pressure washing company.

        TASK: Generate a structured, step-by-step job plan in JSON format that strictly adheres to the provided schema.

        CONTEXT:
        - The company uses only non-toxic, biodegradable chemicals.
        - Safety (PPE, situational awareness) and property protection (pre-wetting plants, covering outlets) are top priorities.

        INPUT DATA:
        1. Services to be performed for this job:
        ${serviceList}

        2. Chemical ingredients available for mixing:
        ${ingredientList}

        INSTRUCTIONS:
        1.  Create a logical sequence of steps for the job.
        2.  The sequence should generally follow: 'prep', 'protection', 'equipment', 'chemical_mix', 'application', 'cleanup', 'walkthrough', 'payment'.
        3.  Create a 'chemical_mix' step for each service that requires a chemical application.
        4.  For each 'chemical_mix' step, you MUST populate the 'ingredients' array with the correct objects from the "Chemical ingredients available" list. Use the provided IDs.
        5.  Provide clear, concise instructions in the 'details' and 'mixRatio' fields for the technician.
        6.  Ensure the final output is a valid JSON object matching the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            console.error("Error generating job plan: Empty response from API.");
            return null;
        }
        const parsedPlan = JSON.parse(jsonText) as AIJobPlan;
        
        if (parsedPlan && parsedPlan.steps) {
            // Ensure 'completed' property is set
            parsedPlan.steps.forEach(step => {
                if (step.completed === undefined) {
                    step.completed = false;
                }
            });
        }

        return parsedPlan;

    } catch (error) {
        console.error("Error generating job plan:", error);
        return null;
    }
};