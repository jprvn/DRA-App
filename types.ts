
export enum Role {
  Admin = "Admin",
  Board = "Board",
  Employee = "Employee",
  Customer = "Customer",
}

export enum Project {
  iHeart = "iHeart",
}

export enum Department {
  Legal = "Legal",
  Approvals = "Approvals",
  Title = "Title",
  Finance = "Finance",
}

export enum CloudConnectionStatus {
  DISCONNECTED = "Disconnected",
  CONNECTING = "Connecting...",
  CONNECTED = "Connected",
}

export interface Citation {
  pack: string;
  file: string | null;
  page: number;
  quote: string;
}

export interface ExtractedFields {
  doc_type: string;
  doc_number: string | null;
  doc_date: string | null;
  issuing_authority: string | null;
  survey_or_extent: string | null;
}

export interface DraResponse {
  project: string;
  question: string;
  status: "OK" | "NOT_FOUND" | "AMBIGUOUS";
  answer_short: string;
  citations: Citation[];
  extracted_fields: ExtractedFields;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  data?: DraResponse;
  isLoading?: boolean;
}