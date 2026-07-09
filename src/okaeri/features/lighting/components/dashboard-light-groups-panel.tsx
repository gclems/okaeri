import { useEffect, useState } from "react";

import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "shanty-ui";

import { getLightingSnapshot } from "@/domo/server/lighting/lighting-functions";
import type { LightingSnapshot } from "@/domo/shared/lighting";

import { DashboardLightGroupCard } from "./dashboard-light-group-card";

export function DashboardLightGroupsPanel() {
	const [snapshot, setSnapshot] = useState<LightingSnapshot | null>(null);

	useEffect(() => {
		const load = async () => {
			setSnapshot(await getLightingSnapshot());
		};

		load();
	}, []);

	async function turnOffAllLights() {}

	const groups = Object.values(snapshot?.lightGroups || {});

	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center gap-2">
						<span className="text-energy">
							<FontAwesomeIcon icon={faLightbulb} />
						</span>
						Éclairage
					</div>
				}
			/>
			<Card.Body>
				<div>
					<Button
						onClick={async () => {
							const nextSnaps = await getLightingSnapshot();
							setSnapshot(nextSnaps);
							console.log("nextSnaps", nextSnaps);
						}}
					>
						Update
					</Button>
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{groups.map((group) => (
						<DashboardLightGroupCard key={group.id} group={group} />
					))}
				</div>
			</Card.Body>
			<Card.Footer>
				<Button
					variant="light"
					color="destructive"
					className="w-full text-right"
					onClick={turnOffAllLights}
				>
					Tout éteindre&nbsp;
					<FontAwesomeIcon icon={faPowerOff} />
				</Button>
			</Card.Footer>
		</Card>
	);
}
