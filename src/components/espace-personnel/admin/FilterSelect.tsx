"use client";

import clsx from "clsx";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
	const { searchParams, setParams, isPending } = useUrlFilter();

	return (
		<div className="relative inline-flex items-center">
			<select
				value={searchParams.get(paramName) ?? ""}
				onChange={(event) => setParams({ [paramName]: event.target.value || undefined })}
				className={clsx(
					className ?? "rounded-lg px-3 py-1.5 pr-10 text-sm text-gray-700 bg-white border border-gray-300 focus:border-univers",
					isPending && "opacity-60"
				)}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{isPending && (
				<span className="absolute -right-6">
					<Spin indicator={<LoadingOutlined spin />} size="small" className="text-cohesion" />
				</span>
			)}
		</div>
	);
}
