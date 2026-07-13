import type { ReactNode } from "react";

import type { UseQueryResult } from "@tanstack/react-query";

type QueryResult = UseQueryResult<unknown, Error>;

type QueryDataTuple<TQueries extends readonly QueryResult[]> = {
	-readonly [Index in keyof TQueries]: Exclude<
		TQueries[Index]["data"],
		undefined
	>;
};

type QueryLoaderProps<TQueries extends readonly QueryResult[]> = {
	queries: TQueries;
	children: (data: QueryDataTuple<TQueries>) => ReactNode;
};

function QueryLoader<const TQueries extends readonly QueryResult[]>({
	queries,
	children,
}: QueryLoaderProps<TQueries>) {
	const isLoading = queries.some((query) => query.isLoading || query.isPending);
	const isError = queries.some((query) => query.isError);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error occurred</div>;
	}

	const data = queries.map((query) => query.data) as QueryDataTuple<TQueries>;
	return <>{children(data)}</>;
}

export { QueryLoader };
