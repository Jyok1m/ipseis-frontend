"use client";

// Compatibilité antd 5 <-> React 19 : réécrit les API impératives d'antd
// (message, notification, Modal.confirm) qui reposaient sur ReactDOM.render.
// L'import doit être évalué côté client avant tout rendu antd.
import "@ant-design/v5-patch-for-react-19";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// AntdRegistry collecte le CSS-in-JS d'antd pendant le rendu serveur et l'injecte
// dans le HTML : sans lui, les styles antd n'arrivent qu'à l'hydratation (flash).
export default function AntdProvider({ children }: { children: ReactNode }) {
	return <AntdRegistry>{children}</AntdRegistry>;
}
