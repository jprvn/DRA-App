import { GoogleGenAI } from "@google/genai";
import { DraResponse, Role, Department } from '../types';
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from '../constants';

// A mock function to simulate data retrieval for the pilot.
// In a real app, this would be a RAG system that filters data based on user role and selected departments.
const getContextForQuery = (question: string, role: Role, departments: Set<Department>): string => {
  // Financial data is restricted to Admin and Board roles.
  const canSeeFinancials = role === Role.Admin || role === Role.Board;
  const contextParts: string[] = [];

  const approvalsContext = `
  Document: ApprovalsPack.pdf
  Page 2: Final approval for phase 1 was granted by the 'City Planning Commission' on 2023-11-05.${canSeeFinancials ? `
  Page 7: The preliminary budget approval is noted as $5,000,000.` : ''}`;

  const titleContext = `
  Document: TitlePack.pdf
  Page 3: The primary agreement for iHeart project was signed on 2023-10-15. The document number is IH-TP-001.`;

  const legalContext = `
  Document: Parent_C.pdf
  Page 12: Section 4.2 states that all subsidiaries must adhere to the primary agreement clauses. This document supersedes Parent_B.pdf.`;
  
  const financeContext = `
  Document: FinancePack.pdf
  Page 5: Q4 2023 Financial report indicates a total project spend of $1,200,000 against the allocated budget.
  Page 6: Projected Q1 2024 spend is estimated to be $850,000.`;

  if (departments.has(Department.Approvals)) {
    contextParts.push(approvalsContext);
  }
  if (departments.has(Department.Title)) {
    contextParts.push(titleContext);
  }
  if (departments.has(Department.Legal)) {
    contextParts.push(legalContext);
  }
  if (departments.has(Department.Finance) && canSeeFinancials) {
    contextParts.push(financeContext);
  }

  return `
  --- MOCK DOCUMENT CONTEXT ---
  This is a mock context for the iHeart project, filtered by selected departments. In a real application, this context would be dynamically retrieved from a vector database based on the user's query: "${question}" and filtered for: ${[...departments].join(', ')}.

  ${contextParts.join('\n')}
  --- END MOCK DOCUMENT CONTEXT ---
  `;
};

export const getDraResponse = async (question: string, role: Role, departments: Set<Department>): Promise<DraResponse | string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  
  if (departments.size === 0) {
    return "Please select at least one department to search for information.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // For v0.1, we hardcode the check. A real system would use a router.
  if (!question.toLowerCase().includes('iheart')) {
    return "Out of scope for iHeart (v0.1).";
  }

  try {
    // The context is filtered based on the user's role and selected departments before being sent to the model.
    const context = getContextForQuery(question, role, departments);
    const augmentedPrompt = `
    Role: ${role.toLowerCase()}
    Context from project files (filtered by ${[...departments].join(', ')} departments):
    ${context}

    User Question: ${question}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: augmentedPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText) as DraResponse;
    return parsedJson;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Check if the error is due to a non-JSON response, which might be the out-of-scope message.
    if (error instanceof SyntaxError) {
        // A real implementation would inspect the raw response if possible.
        // For this demo, we assume parsing errors might relate to simple text replies.
        return "An error occurred while processing the response. It might be out of scope or malformed.";
    }
    throw new Error("Failed to get response from DRA.");
  }
};