// app/okaeri/app/providers.tsx

import type { ReactNode } from "react";

import { ShantyRoot } from "shanty-ui";

import { useTheme } from "./themes/use-theme";

export function AppProviders({ children }: { children: ReactNode }) {
	useTheme();

	return (
		<ShantyRoot toast tooltip sidebar={{ defaultOpen: false }}>
			{children}
		</ShantyRoot>
	);
}
