import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lighting/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/lighting/"!</div>;
}
