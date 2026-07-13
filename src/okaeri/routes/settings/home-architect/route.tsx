import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/home-architect")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
