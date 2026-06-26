"use client";

import { Cpu } from "lucide-react";

interface HeaderProps {
	isBackendOnline: boolean;
}

export default function Header({ isBackendOnline }: HeaderProps) {
	return (
		<header className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 flex items-center justify-between shadow-sm z-30 shrink-0">
			<div className="flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400 shrink-0">
					<Cpu className="w-4 h-4" />
				</div>
				<div>
					<h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
						LGN Contabilidade AI
					</h2>
					<p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
						Assistente Inteligente de Serviços Contábeis
					</p>
				</div>
			</div>

			{/* Status Badge */}
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
					<div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/20 dark:border-amber-800/30 dark:text-amber-400">
						<span className="w-2 h-2 rounded-full bg-amber-500"></span>
						<span>Backend Offline</span>
					</div>
				)}
			</div>
		</header>
	);
}
