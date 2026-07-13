import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lighting")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
