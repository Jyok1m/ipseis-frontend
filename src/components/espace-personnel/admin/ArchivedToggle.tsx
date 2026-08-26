"use client";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useUrlFilter } from "./useUrlFilter";

/**
 * Le filtre vit dans l'URL : la vue est partageable et c'est le serveur qui
 * rend la liste filtrée, sans refetch client.
 */
export default function ArchivedToggle() {
	const { searchParams, setParams, isPending } = useUrlFilter();
	const checked = searchParams.get("archived") === "true";

	return (
		<label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => setParams({ archived: event.target.checked ? "true" : undefined })}
				className="rounded border-gray-300 text-univers focus:ring-univers"
			/>
			Afficher les archivés
			{isPending && <Spin indicator={<LoadingOutlined spin />} size="small" className="text-cohesion" />}
		</label>
	);
}
