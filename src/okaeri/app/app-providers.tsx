// app/okaeri/app/providers.tsx

import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShantyRoot } from "shanty-ui";

export function AppProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ShantyRoot toast tooltip sidebar>
				{children}
			</ShantyRoot>
		</QueryClientProvider>
	);
}
