import { createFileRoute } from "@tanstack/react-router";

import { DashboardSunPanel } from "@/features/sun/components/dashboard-sun-panel";
import { HomeBlueprints } from "@/routes/(dashboard)/components/home-blueprints";
import { LightGroupsPanel } from "@/routes/(dashboard)/components/light-groups-panel";

export const Route = createFileRoute("/(dashboard)/")({ component: Home });

function Home() {
	return (
		<div className="flex items-start gap-x-6">
			<HomeBlueprints />
			<div className="w-100 space-y-4">
				<DashboardSunPanel />
				<LightGroupsPanel />
			</div>
		</div>
	);
}
