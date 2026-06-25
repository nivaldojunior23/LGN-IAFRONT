"use client";

import { useEffect, useState } from "react";
import {
	INITIAL_COMPANIES,
	INITIAL_MESSAGES,
	INITIAL_SESSIONS,
} from "@/constants/mock-data";
import type {
	AutomationStep,
	ChatSession,
	Company,
	Message,
	TaskType,
} from "@/types/chat";

const BACKEND_URL = "http://localhost:5195/api/chat";

export function useChat() {
	const [companies] = useState<Company[]>(INITIAL_COMPANIES);
	const [activeCompany, setActiveCompany] = useState<Company | null>(
		INITIAL_COMPANIES.length > 0 ? INITIAL_COMPANIES[0] : null,
	);
	const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
	const [activeSession, setActiveSession] = useState<ChatSession | null>(
		INITIAL_SESSIONS.length > 0 ? INITIAL_SESSIONS[0] : null,
	);
	const [sessionsMessages, setSessionsMessages] =
		useState<Record<string, Message[]>>(INITIAL_MESSAGES);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isBackendOnline, setIsBackendOnline] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Ping backend to check if C# app is running
	useEffect(() => {
		const checkBackend = async () => {
			try {
				const controller = new AbortController();
				const id = setTimeout(() => controller.abort(), 1000);
				await fetch(BACKEND_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ mensagem: "" }),
					signal: controller.signal,
				});
				clearTimeout(id);
				setIsBackendOnline(true);
			} catch (_e) {
				setIsBackendOnline(false);
			}
		};
		checkBackend();
		const interval = setInterval(checkBackend, 10000);
		return () => clearInterval(interval);
	}, []);

	const activeMessages = activeSession
		? sessionsMessages[activeSession.id] || []
		: [];

	const addMessageToActiveSession = (msg: Message) => {
		if (!activeSession) return;
		setSessionsMessages((prev) => {
			const currentMsgs = prev[activeSession.id] || [];
			return {
				...prev,
				[activeSession.id]: [...currentMsgs, msg],
			};
		});

		// Update last message in sessions list
		setSessions((prev) =>
			prev.map((s) =>
				s.id === activeSession.id
					? {
							...s,
							lastMessage: msg.content.substring(0, 60),
							timestamp: new Date().toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							}),
						}
					: s,
			),
		);
	};

	const handleSelectCompany = (company: Company) => {
		setActiveCompany(company);
		// Auto-select first session of that company if exists
		const companySession = sessions.find((s) => s.companyId === company.id);
		if (companySession) {
			setActiveSession(companySession);
		}
	};

	const handleSelectSession = (session: ChatSession) => {
		setActiveSession(session);
		// Sync active company
		const company = companies.find((c) => c.id === session.companyId);
		if (company) {
			setActiveCompany(company);
		}
		// Close sidebar on mobile
		setIsSidebarOpen(false);
	};

	const handleCreateNewSession = () => {
		if (!activeCompany) return;
		const newSessionId = `session_${Math.random().toString(36).substring(2, 9)}`;
		const newSession: ChatSession = {
			id: newSessionId,
			title: `Novo Atendimento #${sessions.length + 1}`,
			lastMessage: "Chat iniciado.",
			timestamp: new Date().toLocaleTimeString("pt-BR", {
				hour: "2-digit",
				minute: "2-digit",
			}),
			companyId: activeCompany.id,
		};
		setSessions((prev) => [newSession, ...prev]);
		setSessionsMessages((prev) => ({
			...prev,
			[newSessionId]: [
				{
					id: `msg_${Math.random()}`,
					role: "assistant",
					content: `Olá! Iniciamos um novo atendimento para ${activeCompany.name}. Como posso auxiliar na sua rotina contábil agora?`,
					timestamp: new Date().toISOString(),
				},
			],
		}));
		setActiveSession(newSession);
	};

	const handleDeleteSession = (sessionId: string) => {
		setSessions((prev) => prev.filter((s) => s.id !== sessionId));
		setSessionsMessages((prev) => {
			const updated = { ...prev };
			delete updated[sessionId];
			return updated;
		});

		if (activeSession?.id === sessionId) {
			const remainingSessions = sessions.filter(
				(s) => s.id !== sessionId && s.companyId === activeCompany?.id,
			);
			if (remainingSessions.length > 0) {
				setActiveSession(remainingSessions[0]);
			} else {
				setActiveSession(null);
			}
		}
	};

	// Execution flow simulation for automation requests
	const simulateAutomation = (type: TaskType, queryText: string) => {
		setIsLoading(true);

		const messageId = `msg_auto_${Math.random().toString(36).substring(2, 9)}`;

		let title = "";
		let description = "";
		let steps: AutomationStep[] = [];
		let successDetails: NonNullable<
			NonNullable<Message["automation"]>["result"]
		> = {};

		const companyName =
			activeCompany?.name || "Alfa Soluções em Tecnologia LTDA";
		const companyCnpj = activeCompany?.cnpj || "12.345.678/0001-90";

		if (type === "nf_emission") {
			title = "Emissão de Nota Fiscal de Serviço (NFS-e)";
			description =
				"Autenticando certificado digital e calculando base de cálculo de impostos.";
			steps = [
				{
					id: "1",
					label: "Conectando ao sistema emissor nacional da Prefeitura",
					status: "pending",
				},
				{
					id: "2",
					label: "Validando dados cadastrais e tributários do destinatário",
					status: "pending",
				},
				{
					id: "3",
					label: "Gerando prévia da Nota de Serviço (RPS)",
					status: "pending",
				},
				{
					id: "4",
					label:
						"Transmitindo NFS-e para a prefeitura e assinando com certificado",
					status: "pending",
				},
			];
			successDetails = {
				docNumber: `NFS-e #${Math.floor(100000 + Math.random() * 900000)}`,
				companyName: companyName,
				recipient: "TechSolutions Serviços de Tecnologia Ltda",
				value: 4500.0,
				downloadUrl: "#",
				xmlUrl: "#",
			};
		} else if (type === "das_generation") {
			title = "Emissão de Guia de Recolhimento DAS";
			description =
				"Calculando o valor do imposto do Simples Nacional com base no faturamento do mês anterior.";
			steps = [
				{
					id: "1",
					label: "Efetuando login no portal PGDAS-D da Receita Federal",
					status: "pending",
				},
				{
					id: "2",
					label: "Consolidando extrato de faturamento declarado",
					status: "pending",
				},
				{
					id: "3",
					label: "Apurando alíquota efetiva de tributação",
					status: "pending",
				},
				{
					id: "4",
					label: "Emitindo guia de arrecadação do DAS com código Pix",
					status: "pending",
				},
			];
			successDetails = {
				docNumber: `DAS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
				companyName: companyName,
				value: 270.0,
				dueDate: `20/${String(new Date().getMonth() + 2).padStart(2, "0")}/${new Date().getFullYear()}`,
				downloadUrl: "#",
				xmlUrl: "#",
			};
		} else {
			title = "Verificação de Pendências Fiscais - CNPJ";
			description =
				"Realizando varredura em portais federais, estaduais e previdenciários.";
			steps = [
				{
					id: "1",
					label: "Autenticando via e-CAC (Certificado Digital)",
					status: "pending",
				},
				{
					id: "2",
					label: "Verificando situação fiscal na Receita Federal",
					status: "pending",
				},
				{
					id: "3",
					label:
						"Checando pendências na Procuradoria Geral da Fazenda Nacional (PGFN)",
					status: "pending",
				},
				{
					id: "4",
					label: "Varrendo restrições de FGTS e débitos previdenciários",
					status: "pending",
				},
			];
			successDetails = {
				docNumber: `CND-${Math.floor(10000 + Math.random() * 90000)}/2026`,
				companyName: companyName,
				cnpj: companyCnpj,
				description:
					"CNPJ pesquisado com sucesso. Não constam débitos tributários nem previdenciários. Emitida Certidão Negativa de Débitos (CND).",
				dueDate: `Válida até ${new Date(Date.now() + 180 * 24 * 3600 * 1000).toLocaleDateString("pt-BR")}`,
				downloadUrl: "#",
			};
		}

		const initialAutomationMsg: Message = {
			id: messageId,
			role: "assistant",
			content: `Iniciando automação solicitada: "${queryText}". Acompanhe o progresso em tempo real no painel abaixo.`,
			timestamp: new Date().toISOString(),
			automation: {
				type,
				status: "running",
				title,
				description,
				progress: 0,
				steps: steps.map((s, idx) =>
					idx === 0 ? { ...s, status: "running" as const } : s,
				),
			},
		};

		addMessageToActiveSession(initialAutomationMsg);

		let progressVal = 0;
		let activeStepIdx = 0;

		const interval = setInterval(() => {
			progressVal += 10;

			if (progressVal >= 25 && activeStepIdx === 0) {
				steps[0].status = "completed";
				steps[1].status = "running";
				activeStepIdx = 1;
			} else if (progressVal >= 50 && activeStepIdx === 1) {
				steps[1].status = "completed";
				steps[2].status = "running";
				activeStepIdx = 2;
			} else if (progressVal >= 75 && activeStepIdx === 2) {
				steps[2].status = "completed";
				steps[3].status = "running";
				activeStepIdx = 3;
			}

			setSessionsMessages((prev) => {
				if (!activeSession) return prev;
				const currentMsgs = prev[activeSession.id] || [];
				return {
					...prev,
					[activeSession.id]: currentMsgs.map((m) => {
						if (m.id === messageId && m.automation) {
							return {
								...m,
								automation: {
									...m.automation,
									progress: Math.min(progressVal, 95),
									steps: [...steps],
								},
							};
						}
						return m;
					}),
				};
			});

			if (progressVal >= 100) {
				clearInterval(interval);
				steps[3].status = "completed";

				setSessionsMessages((prev) => {
					if (!activeSession) return prev;
					const currentMsgs = prev[activeSession.id] || [];
					return {
						...prev,
						[activeSession.id]: currentMsgs.map((m) => {
							if (m.id === messageId && m.automation) {
								return {
									...m,
									content:
										"A automação contábil foi executada com sucesso! Todos os comprovantes e guias foram anexados.",
									automation: {
										...m.automation,
										status: "success",
										progress: 100,
										steps: [...steps],
										result: successDetails,
									},
								};
							}
							return m;
						}),
					};
				});

				setIsLoading(false);
			}
		}, 1000);
	};

	const triggerSimulatedChatbotResponse = (content: string) => {
		let reply = "";
		const lower = content.toLowerCase();

		if (lower.includes("cep") || lower.includes("endereço")) {
			reply =
				"Olá! Identifiquei que você está solicitando uma consulta de CEP. Para realizar essa consulta com o plugin oficial do ViaCEP, por favor inicie o backend C# localizado no diretório C:\\Users\\nival\\Desktop\\projetos\\LGN-IA. O agente local de Semantic Kernel poderá responder automaticamente!";
		} else if (
			lower.includes("olá") ||
			lower.includes("oi") ||
			lower.includes("bom dia") ||
			lower.includes("boa tarde")
		) {
			reply = `Olá! Sou a LGN Inteligência Artificial, focada em automações contábeis para ${activeCompany?.name || "sua empresa"}. \n\nPosso te ajudar a automatizar tarefas repetitivas. Experimente atalhos rápidos acima como "Emitir Nota" ou "Gerar Guia DAS"!`;
		} else {
			reply = `Recebi sua mensagem: "${content}". Para processar essa solicitação utilizando inteligência artificial generativa real (Ollama local), ative o servidor C# localizado na pasta C:\\Users\\nival\\Desktop\\projetos\\LGN-IA. \n\nPor enquanto, você pode testar as simulações de cliques de automação contábil usando os botões acima da caixa de digitação.`;
		}

		const assistantMessage: Message = {
			id: `msg_assistant_${Date.now()}`,
			role: "assistant",
			content: reply,
			timestamp: new Date().toISOString(),
		};
		addMessageToActiveSession(assistantMessage);
	};

	const handleSendMessage = async (content: string, files: File[]) => {
		if (!content.trim() && files.length === 0) return;
		if (!activeSession) return;

		const formattedAttachments = files.map((f) => ({
			id: Math.random().toString(36).substring(2, 9),
			name: f.name,
			size: f.size,
			type: f.type,
			url: "#",
		}));

		const userMessage: Message = {
			id: `msg_user_${Date.now()}`,
			role: "user",
			content,
			timestamp: new Date().toISOString(),
			files: formattedAttachments.length > 0 ? formattedAttachments : undefined,
		};

		addMessageToActiveSession(userMessage);

		const lowerContent = content.toLowerCase();

		if (
			lowerContent.includes("emitir nota") ||
			lowerContent.includes("emitir nfs") ||
			lowerContent.includes("nf-e")
		) {
			simulateAutomation("nf_emission", content);
			return;
		}
		if (
			lowerContent.includes("gerar guia") ||
			lowerContent.includes("das") ||
			lowerContent.includes("simples nacional")
		) {
			simulateAutomation("das_generation", content);
			return;
		}
		if (
			lowerContent.includes("consultar cnpj") ||
			lowerContent.includes("pendencias") ||
			lowerContent.includes("situação fiscal")
		) {
			simulateAutomation("cnpj_consultation", content);
			return;
		}

		setIsLoading(true);

		if (isBackendOnline) {
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
					const assistantMessage: Message = {
						id: `msg_assistant_${Date.now()}`,
						role: "assistant",
						content:
							data.resposta || "Não foi possível obter uma resposta adequada.",
						timestamp: new Date().toISOString(),
					};
					addMessageToActiveSession(assistantMessage);
				} else {
					throw new Error("Falha na resposta do servidor");
				}
			} catch (_err) {
				triggerSimulatedChatbotResponse(content);
			} finally {
				setIsLoading(false);
			}
		} else {
			setTimeout(() => {
				triggerSimulatedChatbotResponse(content);
				setIsLoading(false);
			}, 1200);
		}
	};

	const handleRetryTask = (messageId: string) => {
		const originalMsg = activeMessages.find((m) => m.id === messageId);
		if (!originalMsg) return;

		setSessionsMessages((prev) => {
			if (!activeSession) return prev;
			return {
				...prev,
				[activeSession.id]: prev[activeSession.id].filter(
					(m) => m.id !== messageId,
				),
			};
		});

		if (originalMsg.automation) {
			simulateAutomation(originalMsg.automation.type, originalMsg.content);
		}
	};

	return {
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
	};
}
