"use client";

import {
	AlertTriangle,
	Bot,
	CheckCircle2,
	Download,
	FileCode,
	FileText,
	Loader2,
	User,
} from "lucide-react";
import type { AutomationMetadata, FileAttachment, Message } from "@/types/chat";

interface ChatBubbleProps {
	message: Message;
	onRetryTask?: (messageId: string) => void;
}

export default function ChatBubble({ message, onRetryTask }: ChatBubbleProps) {
	const isUser = message.role === "user";

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	const formatCurrency = (value?: number): string => {
		if (value === undefined) return "";
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	};

	const renderAttachments = (files?: FileAttachment[]) => {
		if (!files || files.length === 0) return null;
		return (
			<div className="mt-3 space-y-2 max-w-sm">
				{files.map((file) => (
					<div
						key={file.id}
						className={`
              flex items-center gap-3 p-2.5 rounded-lg border text-xs
              ${
								isUser
									? "bg-indigo-700/40 border-indigo-500/30 text-indigo-100"
									: "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
							}
            `}
					>
						<FileText className="w-5.5 h-5.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="font-semibold truncate">{file.name}</p>
							<span className="opacity-70">{formatFileSize(file.size)}</span>
						</div>
						{file.url && (
							<a
								href={file.url}
								download
								className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0"
							>
								<Download className="w-4 h-4" />
							</a>
						)}
					</div>
				))}
			</div>
		);
	};

	const renderAutomationCard = (automation: AutomationMetadata) => {
		const isRunning = automation.status === "running";
		const isSuccess = automation.status === "success";
		const isError = automation.status === "error";

		return (
			<div
				className={`
        mt-4 rounded-xl border p-5 shadow-lg max-w-lg transition-all duration-300 w-full
        ${isRunning && "bg-slate-900/40 border-indigo-500/30 shadow-indigo-950/10"}
        ${isSuccess && "bg-slate-900/60 border-emerald-500/30 shadow-emerald-950/10"}
        ${isError && "bg-slate-900/60 border-rose-500/30 shadow-rose-950/10"}
      `}
			>
				{/* Card Header */}
				<div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
					<div className="flex items-center gap-2.5">
						{isRunning && (
							<Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
						)}
						{isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
						{isError && <AlertTriangle className="w-5 h-5 text-rose-400" />}
						<span className="font-bold text-sm text-slate-200">
							{automation.title}
						</span>
					</div>
					<span
						className={`
            text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
            ${isRunning && "bg-indigo-950/80 border border-indigo-500/20 text-indigo-400"}
            ${isSuccess && "bg-emerald-950/80 border border-emerald-500/20 text-emerald-400"}
            ${isError && "bg-rose-950/80 border border-rose-500/20 text-rose-400"}
          `}
					>
						{isRunning && "Processando"}
						{isSuccess && "Sucesso"}
						{isError && "Falha"}
					</span>
				</div>

				{/* Progress & Steps Tracker (for running state) */}
				{isRunning && (
					<div className="space-y-4">
						<p className="text-xs text-slate-400 leading-normal">
							{automation.description}
						</p>

						{/* Progress Bar */}
						<div className="space-y-1">
							<div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
								<div
									className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
									style={{ width: `${automation.progress}%` }}
								></div>
							</div>
							<div className="text-[10px] text-slate-500 text-right font-medium">
								{automation.progress}% concluído
							</div>
						</div>

						{/* Step list */}
						{automation.steps && (
							<div className="space-y-2 border-t border-slate-800/60 pt-3">
								{automation.steps.map((step) => (
									<div
										key={step.id}
										className="flex items-center justify-between text-xs"
									>
										<span
											className={`
                      font-medium
                      ${step.status === "completed" && "text-slate-300"}
                      ${step.status === "running" && "text-indigo-400 animate-pulse font-semibold"}
                      ${step.status === "pending" && "text-slate-500"}
                      ${step.status === "failed" && "text-rose-400 font-semibold"}
                    `}
										>
											{step.label}
										</span>
										<span className="text-[10px]">
											{step.status === "completed" && (
												<span className="text-emerald-400 font-bold">
													Concluído
												</span>
											)}
											{step.status === "running" && (
												<span className="text-indigo-400 animate-pulse">
													Processando...
												</span>
											)}
											{step.status === "pending" && (
												<span className="text-slate-600">Aguardando</span>
											)}
											{step.status === "failed" && (
												<span className="text-rose-400 font-bold">Erro</span>
											)}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Success Card details and downloads */}
				{isSuccess && automation.result && (
					<div className="space-y-4">
						<p className="text-xs text-slate-300 leading-relaxed">
							{automation.description ||
								"A automação contábil foi executada com sucesso. Veja os detalhes abaixo:"}
						</p>

						{/* Summary Details Grid */}
						<div className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-800 space-y-2">
							{automation.result.docNumber && (
								<div className="flex justify-between items-center text-xs">
									<span className="text-slate-500 font-medium">
										Nº do Documento:
									</span>
									<span className="text-slate-200 font-bold font-mono">
										{automation.result.docNumber}
									</span>
								</div>
							)}
							{automation.result.companyName && (
								<div className="flex justify-between items-start text-xs">
									<span className="text-slate-500 font-medium">
										Emitente/Empresa:
									</span>
									<span className="text-slate-200 font-bold text-right max-w-[200px] truncate">
										{automation.result.companyName}
									</span>
								</div>
							)}
							{automation.result.recipient && (
								<div className="flex justify-between items-start text-xs">
									<span className="text-slate-500 font-medium">
										Destinatário:
									</span>
									<span className="text-slate-200 font-bold text-right max-w-[200px] truncate">
										{automation.result.recipient}
									</span>
								</div>
							)}
							{automation.result.value !== undefined && (
								<div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2 mt-1">
									<span className="text-slate-500 font-medium">
										Valor Total:
									</span>
									<span className="text-indigo-400 font-bold text-sm">
										{formatCurrency(automation.result.value)}
									</span>
								</div>
							)}
							{automation.result.dueDate && (
								<div className="flex justify-between items-center text-xs">
									<span className="text-slate-500 font-medium">
										Vencimento:
									</span>
									<span className="text-amber-400 font-bold">
										{automation.result.dueDate}
									</span>
								</div>
							)}
						</div>

						{/* Action buttons (Downloads) */}
						<div className="flex flex-col sm:flex-row gap-2 pt-2">
							{automation.result.downloadUrl && (
								<a
									href={automation.result.downloadUrl}
									download
									className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-md transition-all"
								>
									<Download className="w-4 h-4" />
									<span>Download PDF</span>
								</a>
							)}
							{automation.result.xmlUrl && (
								<a
									href={automation.result.xmlUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all"
								>
									<FileCode className="w-4 h-4 text-indigo-400" />
									<span>Visualizar XML</span>
								</a>
							)}
						</div>
					</div>
				)}

				{/* Error Card layout */}
				{isError && (
					<div className="space-y-4">
						<p className="text-xs text-rose-300 leading-relaxed">
							{automation.result?.error ||
								"Ocorreu um erro inesperado durante o processamento da automação."}
						</p>
						<div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 flex items-start gap-2.5">
							<AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
							<div className="text-[11px] text-slate-400 leading-normal">
								Verifique se os dados estão completos ou se o portal
								e-CAC/Prefeitura está online.
							</div>
						</div>

						{onRetryTask && (
							<button
								type="button"
								onClick={() => onRetryTask(message.id)}
								className="w-full flex items-center justify-center gap-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98]"
							>
								<span>Tentar Novamente</span>
							</button>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className={`flex gap-3 max-w-3xl w-full mb-6 ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
		>
			{/* Avatar */}
			<div
				className={`
        w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
        ${
					isUser
						? "bg-indigo-600 text-white font-medium text-xs"
						: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400"
				}
      `}
			>
				{isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
			</div>

			{/* Bubble Content Area */}
			<div
				className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%]`}
			>
				{/* Name and time */}
				<div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-500 dark:text-slate-400">
					<span className="font-semibold">
						{isUser ? "Você" : "LGN Contábil AI"}
					</span>
					<span>•</span>
					<span>
						{new Date(message.timestamp).toLocaleTimeString("pt-BR", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>

				{/* Text bubble */}
				{message.content && (
					<div
						className={`
            p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
							isUser
								? "bg-indigo-600 text-white rounded-tr-none"
								: "bg-slate-150 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-800"
						}
          `}
					>
						{message.content}
					</div>
				)}

				{/* File Attachments block */}
				{renderAttachments(message.files)}

				{/* Automation Card block */}
				{message.automation && renderAutomationCard(message.automation)}
			</div>
		</div>
	);
}
