import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "shanty-ui";

import { useLightGroups } from "../use-light-groups";
import { LightGroupCard } from "./light-group-card";

export function LightGroupsPanel() {
	const groupsQuery = useLightGroups();

	if (groupsQuery.isLoading) {
		return <p>Chargement des lumières...</p>;
	}

	if (groupsQuery.isError) {
		return <p>Impossible de récupérer les lumières.</p>;
	}

	const groups = groupsQuery.data ?? [];

	async function turnOffAllLights() {
		// const lightEntityIds: string[] = [];
		// lightGroups.forEach((group) => {
		// 	if (group.isOn) {
		// 		lightEntityIds.push(group.id);
		// 	}
		// });
		// useHaStore.getState().markEntityAsPending(lightEntityIds);
		// try {
		// 	await callHaService("light", "turn_off", { entity_id: lightEntityIds });
		// } catch (error) {
		// 	useHaStore.getState().clearEntityPending(lightEntityIds);
		// 	throw error;
		// }
	}

	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faLightbulb} />
						Éclairage
					</div>
				}
			/>
			<Card.Body>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{groups.map((group) => (
						<LightGroupCard key={group.entityId} group={group} />
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
