"use client";

import { Cpu } from "lucide-react";
import { useEffect, useRef } from "react";
import ChatBubble from "@/components/chat/chat-bubble";
import ChatInput from "@/components/chat/chat-input";
import Header from "@/components/chat/header";
import Sidebar from "@/components/chat/sidebar";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
	const {
		companies,
		activeCompany,
		sessions,
		activeSession,
		activeMessages,
		isSidebarOpen,
		setIsSidebarOpen,
		isBackendOnline,
		isLoading,
		handleSendMessage,
		handleCreateNewSession,
		handleDeleteSession,
		handleRetryTask,
		handleSelectCompany,
		handleSelectSession,
	} = useChat();

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom whenever messages change or loading state changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll dependency
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeMessages, isLoading]);

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
			{/* Sidebar panel */}
			<Sidebar
				companies={companies}
				activeCompany={activeCompany}
				onSelectCompany={handleSelectCompany}
				sessions={sessions}
				activeSession={activeSession}
				onSelectSession={handleSelectSession}
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				onCreateSession={handleCreateNewSession}
				onDeleteSession={handleDeleteSession}
			/>

			{/* Main chat window container */}
			<div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900/60 relative h-full">
				{/* Header bar */}
				<Header
					activeCompany={activeCompany}
					isBackendOnline={isBackendOnline}
					onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
					isSidebarOpen={isSidebarOpen}
				/>

				{/* Backdrop for mobile sidebar */}
				{isSidebarOpen && (
					<button
						type="button"
						onClick={() => setIsSidebarOpen(false)}
						className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden cursor-default w-full h-full text-left"
						aria-label="Fechar menu lateral"
					/>
				)}

				{/* Message scroll area */}
				<div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 custom-scrollbar flex flex-col">
					{activeMessages.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
							<div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-4 animate-bounce">
								<Cpu className="w-6 h-6" />
							</div>
							<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
								Sem mensagens no histórico
							</h3>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
								Inicie a conversa enviando uma pergunta ou executando uma das
								automações contábeis disponíveis abaixo.
							</p>
						</div>
					) : (
						<div className="flex-1 flex flex-col">
							{activeMessages.map((msg) => (
								<ChatBubble
									key={msg.id}
									message={msg}
									onRetryTask={handleRetryTask}
								/>
							))}

							{/* Typing indicator bubble */}
							{isLoading && (
								<div className="flex gap-3 max-w-3xl mr-auto mb-6">
									<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
										<Cpu className="w-4 h-4 animate-spin" />
									</div>
									<div className="flex flex-col">
										<span className="font-semibold text-[10px] text-slate-500 mb-1">
											LGN Contábil AI
										</span>
										<div className="p-3.5 bg-slate-150 dark:bg-slate-800/80 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800 flex items-center gap-1.5 min-w-[60px]">
											<span
												className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
												style={{ animationDelay: "0ms" }}
											></span>
											<span
												className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
												style={{ animationDelay: "150ms" }}
											></span>
											<span
												className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
												style={{ animationDelay: "300ms" }}
											></span>
										</div>
									</div>
								</div>
							)}

							{/* Scroll anchor */}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				<ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
			</div>
		</div>
	);
}
