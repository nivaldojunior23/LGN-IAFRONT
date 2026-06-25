"use client";

import {
	Building,
	ChevronDown,
	Layers,
	MessageSquare,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChatSession, Company } from "@/types/chat";

interface SidebarProps {
	companies: Company[];
	activeCompany: Company | null;
	onSelectCompany: (company: Company) => void;
	sessions: ChatSession[];
	activeSession: ChatSession | null;
	onSelectSession: (session: ChatSession) => void;
	isOpen: boolean;
	onClose: () => void;
	onCreateSession: () => void;
	onDeleteSession: (sessionId: string) => void;
}

export default function Sidebar({
	companies,
	activeCompany,
	onSelectCompany,
	sessions,
	activeSession,
	onSelectSession,
	isOpen,
	onClose,
	onCreateSession,
	onDeleteSession,
}: SidebarProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredCompanies = companies.filter(
		(c) =>
			c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.cnpj.includes(searchTerm),
	);

	// Filter sessions to only show the ones belonging to the selected company
	const companySessions = sessions.filter(
		(s) => s.companyId === activeCompany?.id,
	);

	return (
		<aside
			className={`
      fixed inset-y-0 left-0 z-40 w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out
      lg:static lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
		>
			{/* Logo / Header */}
			<div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
				<div className="flex items-center gap-2.5">
					<div className="bg-slate-800 p-2 rounded-lg text-slate-200 border border-slate-700">
						<Layers className="w-5 h-5 text-indigo-400" />
					</div>
					<div>
						<h1 className="font-bold text-sm tracking-tight text-white">
							LGN Hub
						</h1>
						<span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">
							Portal de Automação
						</span>
					</div>
				</div>

				{/* Mobile Close */}
				<button
					type="button"
					onClick={onClose}
					className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden focus:outline-none"
					aria-label="Fechar menu lateral"
				>
					<X className="w-5 h-5" />
				</button>
			</div>

			{/* Company Switcher */}
			<div
				className="p-4 border-b border-slate-800 shrink-0 relative"
				ref={dropdownRef}
			>
				<div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
					Empresa Cliente
				</div>

				{activeCompany ? (
					<button
						type="button"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className={`
              w-full p-2.5 rounded-xl border bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700/60 transition-all flex items-center justify-between text-left
              ${isDropdownOpen && "border-indigo-500/50 bg-slate-800/30"}
            `}
					>
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
								<Building className="w-3.5 h-3.5" />
							</div>
							<div className="min-w-0">
								<div className="font-semibold text-xs text-slate-200 truncate flex items-center gap-1.5">
									{activeCompany.name}
									{activeCompany.status === "regular" ? (
										<span
											className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
											title="Status Regular"
										/>
									) : (
										<span
											className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
											title="Pendências"
										/>
									)}
								</div>
								<div className="text-[9px] text-slate-500 font-mono mt-0.5">
									{activeCompany.cnpj}
								</div>
							</div>
						</div>
						<ChevronDown
							className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen && "rotate-180"}`}
						/>
					</button>
				) : (
					<button
						type="button"
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="w-full p-2.5 rounded-xl border border-dashed border-slate-800 text-slate-400 hover:bg-slate-800/20 text-xs font-semibold text-center"
					>
						Selecionar Empresa
					</button>
				)}

				{/* Dropdown Popover Options */}
				{isDropdownOpen && (
					<div className="absolute left-4 right-4 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
						<div className="relative p-1">
							<Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
							<input
								type="text"
								placeholder="Buscar empresa..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full bg-slate-900 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
							/>
						</div>

						<div className="space-y-1">
							{filteredCompanies.map((company) => {
								const isSelected = activeCompany?.id === company.id;
								return (
									<button
										key={company.id}
										type="button"
										onClick={() => {
											onSelectCompany(company);
											setIsDropdownOpen(false);
											setSearchTerm("");
										}}
										className={`
                      w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between
                      ${isSelected ? "bg-indigo-600/20 text-indigo-200 font-semibold" : "hover:bg-slate-900 text-slate-400 hover:text-slate-200"}
                    `}
									>
										<div className="min-w-0 flex-1 pr-2">
											<div className="truncate">{company.name}</div>
											<div className="text-[9px] text-slate-500 mt-0.5">
												{company.cnpj}
											</div>
										</div>
										<span className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400 uppercase font-bold shrink-0">
											{company.regime.split(" ")[0]}
										</span>
									</button>
								);
							})}
							{filteredCompanies.length === 0 && (
								<p className="text-[10px] text-slate-500 text-center py-2">
									Nenhuma empresa encontrada
								</p>
							)}
						</div>
					</div>
				)}

				{/* Sleek Action: New Chat */}
				<button
					type="button"
					onClick={onCreateSession}
					className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer border border-indigo-500/10"
				>
					<Plus className="w-4 h-4" />
					<span>Novo Atendimento</span>
				</button>
			</div>

			{/* Recent Chats list */}
			<div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
				<h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1 flex justify-between items-center shrink-0">
					<span>Atendimentos Recentes</span>
					<span className="bg-slate-850 text-[9px] px-2 py-0.5 rounded-full font-semibold text-slate-400 border border-slate-800">
						{companySessions.length}
					</span>
				</h3>

				<div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar pr-1">
					{companySessions.map((session) => {
						const isActive = activeSession?.id === session.id;
						return (
							<div key={session.id} className="relative group">
								<button
									type="button"
									onClick={() => onSelectSession(session)}
									className={`
                    w-full text-left p-3 pr-10 rounded-xl flex items-start gap-3 transition-all border
                    ${
											isActive
												? "bg-slate-800 border-slate-700 text-white font-medium shadow-sm"
												: "bg-slate-950/10 border-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:border-slate-800/60"
										}
                  `}
								>
									<MessageSquare
										className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-350"}`}
									/>
									<div className="min-w-0 flex-1">
										<div
											className={`text-xs ${isActive ? "text-slate-100 font-semibold" : "text-slate-300"}`}
										>
											{session.title}
										</div>
										<div
											className={`text-[10px] truncate mt-0.5 ${isActive ? "text-slate-400" : "text-slate-500 group-hover:text-slate-400"}`}
										>
											{session.lastMessage}
										</div>
									</div>
								</button>

								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onDeleteSession(session.id);
									}}
									className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-750/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
									title="Excluir atendimento"
									aria-label="Excluir atendimento"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							</div>
						);
					})}

					{companySessions.length === 0 && (
						<div className="text-center py-8 text-slate-600 flex flex-col items-center justify-center border border-dashed border-slate-800/50 rounded-xl">
							<MessageSquare className="w-5 h-5 mb-2 opacity-30 text-slate-500" />
							<span className="text-[10px] text-slate-500">
								Nenhum histórico ativo
							</span>
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}
