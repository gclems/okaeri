// app/okaeri/app/providers.tsx

import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShantyRoot } from "shanty-ui";

import { useTheme } from "./themes/use-theme";

export function AppProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	// useDomoRealtime();
	useTheme();

	return (
		<QueryClientProvider client={queryClient}>
			<ShantyRoot toast tooltip sidebar>
				{children}
			</ShantyRoot>
		</QueryClientProvider>
	);
}
