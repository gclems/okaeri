import { createFileRoute } from "@tanstack/react-router";

import { DashboardLightGroupsPanel } from "#/okaeri/features/lighting/components/dashboard-light-groups-panel";
import { DashboardSunPanel } from "#/okaeri/features/sun/components/dashboard-sun-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="w-100 space-y-4">
			<DashboardSunPanel />
			<DashboardLightGroupsPanel />
		</div>
	);
}
