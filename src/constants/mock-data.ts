import type { ChatSession, Company, Message } from "@/types/chat";

export const INITIAL_COMPANIES: Company[] = [
	{
		id: "1",
		name: "Alfa Soluções em Tecnologia LTDA",
		cnpj: "12.345.678/0001-90",
		regime: "Simples Nacional",
		status: "regular",
	},
	{
		id: "2",
		name: "TechDynamics Serviços S.A.",
		cnpj: "98.765.432/0001-21",
		regime: "Lucro Real",
		status: "regular",
	},
	{
		id: "3",
		name: "Livraria & Papelaria Progresso ME",
		cnpj: "45.678.901/0002-33",
		regime: "Simples Nacional",
		status: "pending",
	},
];

export const INITIAL_SESSIONS: ChatSession[] = [
	{
		id: "session_1",
		title: "Emissão de NFS-e Mensal",
		lastMessage: "NFS-e emitida com sucesso no valor de R$ 4.500,00",
		timestamp: "17:20",
		companyId: "1",
	},
	{
		id: "session_2",
		title: "Apuração e DAS Junho/2026",
		lastMessage: "Gerar a guia mensal do DAS...",
		timestamp: "Ontem",
		companyId: "1",
	},
	{
		id: "session_3",
		title: "Regularização e-CAC",
		lastMessage: "Consultar pendências fiscais...",
		timestamp: "Terça",
		companyId: "3",
	},
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
	session_1: [
		{
			id: "msg_1",
			role: "assistant",
			content:
				"Olá! Sou seu assistente de automação fiscal. Em que posso te ajudar hoje?",
			timestamp: "2026-06-25T20:20:00.000Z",
		},
		{
			id: "msg_2",
			role: "user",
			content:
				"Emitir nota fiscal de serviço para o Cliente TechSolutions no valor de R$ 4.500,00",
			timestamp: "2026-06-25T20:21:40.000Z",
		},
		{
			id: "msg_3",
			role: "assistant",
			content:
				"Perfeito! Iniciando processo de emissão da Nota Fiscal de Serviço (NFS-e) para TechSolutions Serviços de Tecnologia Ltda.",
			timestamp: "2026-06-25T20:22:30.000Z",
			automation: {
				type: "nf_emission",
				status: "success",
				title: "Emissão de Nota Fiscal de Serviço (NFS-e)",
				description:
					"A nota fiscal eletrônica foi transmitida e homologada com sucesso junto à prefeitura.",
				progress: 100,
				steps: [
					{
						id: "1",
						label: "Validando credenciais do emissor (Simples Nacional)",
						status: "completed",
					},
					{
						id: "2",
						label: "Consultando Alíquota ISS da prefeitura",
						status: "completed",
					},
					{
						id: "3",
						label: "Emitindo recibo provisório de serviço (RPS)",
						status: "completed",
					},
					{
						id: "4",
						label:
							"Transmitindo NFS-e para a prefeitura e assinando com certificado",
						status: "completed",
					},
				],
				result: {
					docNumber: "NFS-e #20260625",
					companyName: "Alfa Soluções em Tecnologia LTDA",
					recipient: "TechSolutions Serviços de Tecnologia Ltda",
					value: 4500.0,
					downloadUrl: "#",
					xmlUrl: "#",
				},
			},
		},
	],
	session_2: [
		{
			id: "msg_4",
			role: "assistant",
			content:
				"Olá! Posso ajudar com a apuração mensal ou emissão de guias do DAS. O que deseja fazer?",
			timestamp: "2026-06-25T19:20:00.000Z",
		},
	],
	session_3: [
		{
			id: "msg_5",
			role: "assistant",
			content:
				"Olá! Identifiquei pendências cadastrais na empresa Livraria & Papelaria Progresso ME. Gostaria que eu fizesse uma verificação completa no e-CAC?",
			timestamp: "2026-06-24T20:20:00.000Z",
		},
	],
};
