"use client";

import { useUrlFilter } from "./useUrlFilter";

/** Select de filtrage qui écrit sa valeur dans l'URL. */
export default function FilterSelect({
	paramName,
	options,
	className,
}: {
	paramName: string;
	options: Array<{ value: string; label: string }>;
	className?: string;
}) {
	const { searchParams, setParams } = useUrlFilter();

	return (
		<select
			value={searchParams.get(paramName) ?? ""}
			onChange={(event) => setParams({ [paramName]: event.target.value || undefined })}
			className={className ?? "rounded-lg px-3 py-1.5 pr-10 text-sm text-gray-700 bg-white border border-gray-300 focus:border-univers"}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}
