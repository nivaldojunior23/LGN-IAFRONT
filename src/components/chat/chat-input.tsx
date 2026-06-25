"use client";

import {
	Calculator,
	FileSpreadsheet,
	FileText,
	Paperclip,
	Send,
	ShieldAlert,
	X,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

interface ChatInputProps {
	onSendMessage: (content: string, files: File[]) => void;
	isLoading: boolean;
}

interface StagedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	fileObject: File;
}

export default function ChatInput({
	onSendMessage,
	isLoading,
}: ChatInputProps) {
	const [content, setContent] = useState("");
	const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!content.trim() && stagedFiles.length === 0) return;
		if (isLoading) return;

		const filesToSend = stagedFiles.map((sf) => sf.fileObject);
		onSendMessage(content, filesToSend);

		// Clear inputs
		setContent("");
		setStagedFiles([]);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles: StagedFile[] = Array.from(e.target.files).map((file) => ({
			id: Math.random().toString(36).substring(2, 9),
			name: file.name,
			size: file.size,
			type: file.type,
			fileObject: file,
		}));
		setStagedFiles((prev) => [...prev, ...newFiles]);
		// Reset file input value so same file can be selected again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeStagedFile = (id: string) => {
		setStagedFiles((prev) => prev.filter((f) => f.id !== id));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	// Quick prompt suggestions
	const handleShortcutClick = (text: string) => {
		setContent(text);
	};

	const shortcuts = [
		{
			label: "Emitir Nota Fiscal",
			icon: Calculator,
			prompt:
				"Emitir nota fiscal de serviço para o Cliente TechSolutions no valor de R$ 4.500,00",
			color:
				"hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400",
		},
		{
			label: "Gerar Guia DAS",
			icon: FileSpreadsheet,
			prompt:
				"Gerar a guia mensal do DAS (Simples Nacional) para competência atual",
			color:
				"hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-600 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400",
		},
		{
			label: "Consultar CNPJ",
			icon: ShieldAlert,
			prompt:
				"Consultar pendências fiscais e situação cadastral do CNPJ no portal e-CAC",
			color:
				"hover:border-amber-500 hover:bg-amber-50/50 hover:text-amber-600 dark:hover:bg-amber-950/20 dark:hover:text-amber-400",
		},
	];

	return (
		<div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 space-y-3 shadow-lg z-20 shrink-0">
			{/* Shortcut buttons */}
			<div className="flex flex-wrap gap-2">
				{shortcuts.map((shortcut) => {
					const Icon = shortcut.icon;
					return (
						<button
							key={shortcut.label}
							type="button"
							disabled={isLoading}
							onClick={() => handleShortcutClick(shortcut.prompt)}
							className={`
                flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full text-xs font-medium text-slate-600 transition-all cursor-pointer select-none
                dark:border-slate-800 dark:text-slate-400 dark:bg-slate-950/20
                ${shortcut.color}
                disabled:opacity-50 disabled:pointer-events-none
              `}
						>
							<Icon className="w-3.5 h-3.5" />
							<span>{shortcut.label}</span>
						</button>
					);
				})}
			</div>

			{/* Selected/Staged Files Preview list */}
			{stagedFiles.length > 0 && (
				<div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-950/40 p-2 border border-slate-200 dark:border-slate-800/80 rounded-lg">
					{stagedFiles.map((file) => (
						<div
							key={file.id}
							className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-md text-xs text-slate-700 dark:text-slate-300"
						>
							<FileText className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
							<div className="max-w-[150px] min-w-0">
								<p className="font-semibold truncate leading-none">
									{file.name}
								</p>
								<span className="text-[10px] text-slate-500 leading-none">
									{formatFileSize(file.size)}
								</span>
							</div>
							<button
								type="button"
								onClick={() => removeStagedFile(file.id)}
								className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors ml-1 focus:outline-none"
							>
								<X className="w-3.5 h-3.5" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Main input form */}
			<form
				onSubmit={handleSubmit}
				className="flex items-end gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl p-1.5 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all"
			>
				{/* Attachment upload trigger */}
				<button
					type="button"
					disabled={isLoading}
					onClick={() => fileInputRef.current?.click()}
					className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
					title="Anexar arquivos (XML, PDF)"
				>
					<Paperclip className="w-5 h-5" />
				</button>

				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					multiple
					accept=".pdf,.xml,.json,.txt,.png,.jpeg,.jpg"
					className="hidden"
				/>

				{/* Text Area Input */}
				<textarea
					rows={1}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit(e);
						}
					}}
					disabled={isLoading}
					placeholder={
						isLoading
							? "Aguardando conclusão da automação..."
							: "Pergunte algo ou solicite uma automação contábil..."
					}
					className="flex-1 bg-transparent resize-none border-none py-2 px-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-slate-100 max-h-24 min-h-[38px] custom-scrollbar focus:ring-0 focus:ring-offset-0"
				/>

				{/* Submit action */}
				<button
					type="submit"
					disabled={isLoading || (!content.trim() && stagedFiles.length === 0)}
					className={`
            p-2.5 rounded-lg text-white font-medium shadow-md transition-all shrink-0 focus:outline-none
            ${
							isLoading || (!content.trim() && stagedFiles.length === 0)
								? "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
								: "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20 active:scale-95"
						}
          `}
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-indigo-200 border-t-white rounded-full animate-spin"></div>
					) : (
						<Send className="w-5 h-5" />
					)}
				</button>
			</form>
		</div>
	);
}
