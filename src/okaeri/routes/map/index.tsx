import { createFileRoute } from "@tanstack/react-router";

import { HomeBlueprints } from "@/routes/map/components/home-blueprints";

export const Route = createFileRoute("/map/")({ component: Home });

function Home() {
	return (
		<div className="flex items-start gap-x-6">
			<HomeBlueprints />
		</div>
	);
}
