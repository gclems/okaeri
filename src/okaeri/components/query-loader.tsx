import type { ReactNode } from "react";

import type { UseQueryResult } from "@tanstack/react-query";

function QueryLoader({
	queries,
	children,
}: {
	queries: UseQueryResult<NoInfer<unknown>, Error>[];
	children: (data: unknown[]) => ReactNode;
}) {
	const isLoading = queries.some((query) => query.isLoading);
	const isError = queries.some((query) => query.isError);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred</div>;
	}

	return <>{children(queries.map((q) => q.data))}</>;
}

export { QueryLoader };
