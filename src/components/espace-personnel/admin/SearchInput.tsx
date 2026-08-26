"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useUrlFilter } from "./useUrlFilter";

/**
 * Champ de recherche debouncé qui écrit dans l'URL. Le délai de 300 ms est
 * conservé de l'implémentation précédente : il évite une navigation serveur
 * à chaque frappe.
 */
export default function SearchInput({ placeholder, paramName = "search" }: { placeholder: string; paramName?: string }) {
	const { searchParams, setParams } = useUrlFilter();
	const currentValue = searchParams.get(paramName) ?? "";
	const [value, setValue] = useState(currentValue);

	useEffect(() => {
		if (value === currentValue) return;
		const timer = setTimeout(() => setParams({ [paramName]: value || undefined }), 300);
		return () => clearTimeout(timer);
	}, [value, currentValue, paramName, setParams]);

	return (
		<div className="relative mb-4 sticky top-0 z-10 bg-white py-1">
			<MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
			<input
				type="text"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder={placeholder}
				className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:border-univers focus:ring-2 focus:ring-univers/20 transition-all duration-200"
			/>
		</div>
	);
}
