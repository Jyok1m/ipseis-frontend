"use client";

import { useState } from "react";
import type { ThemeWithTrainings } from "@/lib/types";

/**
 * Sélection multiple de formations pour les formulaires publics.
 *
 * Les valeurs retenues sont dupliquées en <input type="hidden">, ce qui les
 * fait remonter dans le FormData de la server action via getAll(name) — sans
 * avoir à remonter l'état jusqu'au parent.
 */
export default function TrainingMultiSelect({
	themes,
	name = "interestedFormations",
	disabled,
}: {
	themes: ThemeWithTrainings[];
	name?: string;
	disabled?: boolean;
}) {
	const [selected, setSelected] = useState<string[]>([]);

	return (
		<div className="space-y-3">
			{selected.map((value) => (
				<input key={value} type="hidden" name={name} value={value} />
			))}

			<select
				value=""
				disabled={disabled}
				onChange={(event) => {
					const value = event.target.value;
					if (value && !selected.includes(value)) setSelected((prev) => [...prev, value]);
				}}
				className="block w-full rounded-lg px-3.5 py-2 sm:py-2.5 text-univers bg-white border border-support/20 focus:border-cohesion focus:ring-2 focus:ring-cohesion/20 shadow-sm text-sm sm:text-base font-medium transition-all duration-200"
			>
				<option value="">Sélectionnez une ou plusieurs formations</option>
				{themes.map((theme) => (
					<optgroup key={theme._id} label={theme.title}>
						{theme.trainings.map((training) => (
							<option key={training._id} value={training.title} disabled={selected.includes(training.title)}>
								{training.title} {selected.includes(training.title) ? "(déjà sélectionné)" : ""}
							</option>
						))}
					</optgroup>
				))}
			</select>

			{selected.length > 0 && (
				<div className="space-y-2">
					<p className="text-sm text-support/70 font-medium">Formations sélectionnées :</p>
					<div className="flex flex-wrap gap-1.5">
						{selected.map((value) => (
							<span
								key={value}
								className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cohesion/10 text-support border border-cohesion/30 rounded-full text-sm font-medium"
							>
								{value}
								<button
									type="button"
									onClick={() => setSelected((prev) => prev.filter((v) => v !== value))}
									disabled={disabled}
									className="text-cohesion hover:text-cohesion/70 font-bold text-base leading-none disabled:opacity-50"
								>
									×
								</button>
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
