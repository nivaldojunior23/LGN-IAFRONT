export type MessageRole = "user" | "assistant" | "system";

export type TaskType =
	| "nf_emission"
	| "das_generation"
	| "cnpj_consultation"
	| "generic";

export type TaskStatus = "idle" | "running" | "success" | "error";

export interface AutomationStep {
	id: string;
	label: string;
	status: "pending" | "running" | "completed" | "failed";
}

export interface AutomationMetadata {
	type: TaskType;
	status: TaskStatus;
	title: string;
	description?: string;
	progress: number; // 0 to 100
	steps?: AutomationStep[];
	result?: {
		downloadUrl?: string;
		docNumber?: string;
		value?: number;
		dueDate?: string;
		cnpj?: string;
		companyName?: string;
		recipient?: string;
		xmlUrl?: string;
		error?: string;
		description?: string;
	};
}

export interface FileAttachment {
	id: string;
	name: string;
	size: number; // in bytes
	type: string; // mime-type
	url?: string;
}

export interface Message {
	id: string;
	role: MessageRole;
	content: string;
	timestamp: string; // ISO date string
	files?: FileAttachment[];
	automation?: AutomationMetadata;
}

export interface Company {
	id: string;
	name: string;
	cnpj: string;
	regime: "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
	status: "regular" | "pending";
}

export interface ChatSession {
	id: string;
	title: string;
	lastMessage: string;
	timestamp: string;
	companyId: string;
}
