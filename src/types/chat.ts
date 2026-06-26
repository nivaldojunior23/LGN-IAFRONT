export type MessageRole = "user" | "assistant";

export interface AutomationMetadata {
	type: string;
	status: string;
	title: string;
	description?: string;
	progress: number;
	steps?: Array<{
		id: string;
		label: string;
		status: "pending" | "running" | "completed" | "failed";
	}>;
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
	size: number;
	type: string;
	url?: string;
}

export interface Message {
	id: string;
	role: MessageRole;
	content: string;
	timestamp: string;
	files?: FileAttachment[];
	automation?: AutomationMetadata;
}
