"use client";

import { Building, Cpu, Menu, X } from "lucide-react";
import type { Company } from "@/types/chat";

interface HeaderProps {
	activeCompany: Company | null;
	isBackendOnline: boolean;
	onToggleSidebar: () => void;
	isSidebarOpen: boolean;
}

export default function Header({
	activeCompany,
	isBackendOnline,
	onToggleSidebar,
	isSidebarOpen,
}: HeaderProps) {
	return (
		<header className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 flex items-center justify-between shadow-sm z-30 shrink-0">
			<div className="flex items-center gap-3">
				{/* Toggle Sidebar Button for Mobile */}
				<button
					type="button"
					onClick={onToggleSidebar}
					className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden focus:outline-none"
					aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
				>
					{isSidebarOpen ? (
						<X className="w-5 h-5" />
					) : (
						<Menu className="w-5 h-5" />
					)}
				</button>

				{/* Company Title */}
				{activeCompany ? (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400 shrink-0">
							<Building className="w-4 h-4" />
						</div>
						<div>
							<h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
								{activeCompany.name}
							</h2>
							<p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
								<span>CNPJ: {activeCompany.cnpj}</span>
								<span className="w-1 h-1 rounded-full bg-slate-400"></span>
								<span>{activeCompany.regime}</span>
							</p>
						</div>
					</div>
				) : (
					<div>
						<h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
							Nenhuma empresa selecionada
						</h2>
						<p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
							Selecione uma empresa na barra lateral para começar
						</p>
					</div>
				)}
			</div>

			{/* Backend Status Connection */}
			<div className="flex items-center gap-4">
				<div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1 text-xs dark:bg-slate-950/40 dark:border-slate-800/80">
					<div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
						<Cpu className="w-3.5 h-3.5" />
						<span className="font-medium text-[11px]">
							Agente Local (Ollama):
						</span>
					</div>
					{isBackendOnline ? (
						<span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
							Qwen 3B Active
						</span>
					) : (
						<span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
							Mock Mode Active
						</span>
					)}
				</div>

				{/* Status Dot */}
				<div className="flex items-center gap-2">
					{isBackendOnline ? (
						<div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-400">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							<span>API Conectada</span>
						</div>
					) : (
						<div
							className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/20 dark:border-amber-800/30 dark:text-amber-400"
							title="Usando Simulação de Respostas Automáticas Local"
						>
							<span className="w-2 h-2 rounded-full bg-amber-500"></span>
							<span>Simulador Ativo</span>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
