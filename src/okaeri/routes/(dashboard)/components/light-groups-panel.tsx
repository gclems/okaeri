import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "shanty-ui";

import { useLightGroups } from "@/features/lighting/use-light-groups";

import { LightGroupCard } from "./light-group-card";

export function LightGroupsPanel() {
	const lightGroups = useLightGroups();

	async function turnOffAllLights() {}

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
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{lightGroups.map((group) => (
						<LightGroupCard key={group.id} group={group} />
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
