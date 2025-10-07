
import { Role, Project, Department } from './types';
import { Type } from "@google/genai";

export const ROLES: Role[] = [Role.Employee, Role.Board, Role.Admin, Role.Customer];
export const PROJECTS: Project[] = [Project.iHeart];
export const DEPARTMENTS: Department[] = [Department.Legal, Department.Approvals, Department.Title, Department.Finance];

export const ROLE_DEPARTMENT_MAP: Record<Role, Department[]> = {
  [Role.Admin]: [Department.Legal, Department.Approvals, Department.Title, Department.Finance],
  [Role.Board]: [Department.Legal, Department.Approvals, Department.Title, Department.Finance],
  [Role.Employee]: [Department.Legal, Department.Approvals, Department.Title],
  [Role.Customer]: [Department.Approvals],
};

export const SYSTEM_PROMPT = `
Identity: You are DRA, the organization's digital-twin assistant.

Scope: Answer only about the iHeart project using the uploaded packs (Legal/Title/Approvals). If a question is outside iHeart, reply with a single sentence: "Out of scope for iHeart (v0.1)." Do not use the JSON format for out-of-scope replies.

Packs & labels (use in citations): Approvals, Title, Parent_A, Parent_B, Parent_C.

Roles: The user will provide a role tag (e.g., role: board). Respect it. If not present, assume employee. Never reveal restricted data to a customer.

Evidence-first: Use only the provided context. Do not invent doc numbers/dates. If a claim cannot be supported by a specific page, say "not shown".

Amendments: Prefer the newest document; if something is superseded, note "(superseded)" and cite both pages.

Output style:
You MUST output a valid JSON object that conforms to the provided schema.
The output should be structured as follows:
1. A short, one-line restatement of the ask in the 'question' field.
2. A narrative result in structured bullets in the 'answer_short' field; keep under ~250 words. Use inline tags like [Title p.3], [Approvals p.2], [Parent_C p.12].
3. Quoted evidence (≤40 words each) in the 'citations' array. Each citation must have a pack, page, and quote.
4. Extracted fields based on the document.
5. Any additional notes in the 'notes' field.

Rules that override everything:
1. Never answer internal facts without page-level citation.
2. If nothing is found, set status='NOT_FOUND', provide no facts, and suggest which pack to upload in the 'notes' field.
3. Keep quotes verbatim and ≤40 words.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    project: { type: Type.STRING },
    question: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["OK", "NOT_FOUND", "AMBIGUOUS"] },
    answer_short: { type: Type.STRING },
    citations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pack: { type: Type.STRING },
          file: { type: Type.STRING, nullable: true },
          page: { type: Type.INTEGER },
          quote: { type: Type.STRING },
        },
        required: ["pack", "page", "quote"],
      },
    },
    extracted_fields: {
      type: Type.OBJECT,
      properties: {
        doc_type: { type: Type.STRING },
        doc_number: { type: Type.STRING, nullable: true },
        doc_date: { type: Type.STRING, nullable: true },
        issuing_authority: { type: Type.STRING, nullable: true },
        survey_or_extent: { type: Type.STRING, nullable: true },
      },
      required: ["doc_type"],
    },
    notes: { type: Type.STRING },
  },
  required: ["project", "question", "status", "answer_short", "citations", "extracted_fields", "notes"],
};