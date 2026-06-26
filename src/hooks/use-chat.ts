"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/types/chat";

const BACKEND_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5195/api/chat";

export function useChat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBackendOnline, setIsBackendOnline] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Check backend status
	useEffect(() => {
		const checkBackend = async () => {
			try {
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), 1000);
				const res = await fetch(BACKEND_URL.replace("/chat", ""), {
					signal: controller.signal,
				});
				clearTimeout(id);
				setIsBackendOnline(res.ok || res.status === 404 || res.status === 200);
			} catch {
				setIsBackendOnline(false);
			}
		};

		checkBackend();
		const interval = setInterval(checkBackend, 5000);
		return () => clearInterval(interval);
	}, []);

	const handleSendMessage = async (content: string) => {
		if (!content.trim()) return;

		const userMessage: Message = {
			id: `msg_user_${Date.now()}`,
			role: "user",
			content,
			timestamp: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const response = await fetch(BACKEND_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ mensagem: content }),
			});

			if (response.ok) {
				const data = await response.json();

				// Handle both raw string response and structured JSON response
				const assistantMessage: Message = {
					id: `msg_assistant_${Date.now()}`,
					role: "assistant",
					content:
						data.resposta ||
						(typeof data === "string" ? data : JSON.stringify(data)),
					timestamp: new Date().toISOString(),
					automation: data.automation || undefined,
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				throw new Error("Erro na resposta do servidor");
			}
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
			const errorMessage: Message = {
				id: `msg_error_${Date.now()}`,
				role: "assistant",
				content:
					"Desculpe, ocorreu um erro ao conectar com o backend. Certifique-se de que o servidor C# está rodando.",
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		messages,
		isBackendOnline,
		isLoading,
		handleSendMessage,
	};
}
