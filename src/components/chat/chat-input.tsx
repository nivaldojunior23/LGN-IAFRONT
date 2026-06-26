"use client";

import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";

interface ChatInputProps {
	onSendMessage: (content: string) => void;
	isLoading: boolean;
}

export default function ChatInput({
	onSendMessage,
	isLoading,
}: ChatInputProps) {
	const [content, setContent] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!content.trim() || isLoading) return;

		onSendMessage(content);
		setContent("");
	};

	return (
		<div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-lg z-20 shrink-0">
			<form
				onSubmit={handleSubmit}
				className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl p-1.5 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all"
			>
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					disabled={isLoading}
					placeholder={isLoading ? "Processando..." : "Digite sua mensagem..."}
					className="flex-1 bg-transparent border-none py-2 px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-slate-100 min-h-[38px] focus:ring-0 focus:ring-offset-0"
				/>

				<button
					type="submit"
					disabled={isLoading || !content.trim()}
					className={`
            p-2.5 rounded-lg text-white font-medium shadow-md transition-all shrink-0 focus:outline-none
            ${
							isLoading || !content.trim()
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
