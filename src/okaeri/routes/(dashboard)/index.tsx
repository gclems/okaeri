import { createFileRoute } from "@tanstack/react-router";

import { CarPanel } from "@/routes/(dashboard)/components/car-panel";
import { ComfortPanel } from "@/routes/(dashboard)/components/comfort-panel";
import { LightGroupsPanel } from "@/routes/(dashboard)/components/light-groups-panel";
import { WeatherPanel } from "@/routes/(dashboard)/components/weather-panel";

export const Route = createFileRoute("/(dashboard)/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-6 @container">
			<div className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
				<LightGroupsPanel />
				<ComfortPanel />
				<WeatherPanel />
				<CarPanel />
			</div>
		</div>
	);
}
