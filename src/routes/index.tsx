import { createFileRoute } from "@tanstack/react-router";

import { DashboardLightGroupsPanel } from "#/okaeri/features/lighting/components/dashboard-light-groups-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			<DashboardLightGroupsPanel />
		</div>
	);
}
