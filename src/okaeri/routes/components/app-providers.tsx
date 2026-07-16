// app/okaeri/app/providers.tsx

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShantyRoot } from "shanty-ui";

import { useDomoSync } from "@/features/domo-sync";
import { useTheme } from "@/themes/use-theme";

import { AppScreensaver } from "./app-screensaver";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 0,
			staleTime: 0,
			gcTime: 0,
		},
	},
});

export function AppProviders({ children }: { children: ReactNode }) {
	useDomoSync();

	useTheme();

	return (
		<QueryClientProvider client={queryClient}>
			<ShantyRoot toast tooltip sidebar={{ defaultOpen: false }}>
				{children}
				<AppScreensaver />
			</ShantyRoot>
		</QueryClientProvider>
	);
}
