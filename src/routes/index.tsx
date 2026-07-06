import { createFileRoute } from "@tanstack/react-router";

import { LightGroupsPanel } from "#/okaeri/features/lighting/components/light-groups-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			<LightGroupsPanel />
		</div>
	);
}
