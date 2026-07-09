// app/okaeri/app/providers.tsx

import type { ReactNode } from "react";

import { ShantyRoot } from "shanty-ui";

import { useTheme } from "./themes/use-theme";

export function AppProviders({ children }: { children: ReactNode }) {
	// const [queryClient] = useState(() => new QueryClient());

	useTheme();

	return (
		// <QueryClientProvider client={queryClient}>
		<ShantyRoot toast tooltip sidebar>
			{children}
		</ShantyRoot>
		// </QueryClientProvider>
	);
}
