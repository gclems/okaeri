import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "shanty-ui";

import { turnOffLight } from "#/server/lighting/lighting-functions";
import { useLightGroups } from "@/features/lighting/use-light-groups";

import { LightGroupCard } from "./light-group-card";

export function LightGroupsPanel() {
	const lightGroups = useLightGroups();

	const turnAllGroupsOff = () => {
		lightGroups.forEach((g) => {
			turnOffLight({ data: { entityId: g.id } });
		});
	};

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
				<ul className="space-y-2">
					{lightGroups.map((group) => (
						<li key={group.id}>
							<LightGroupCard group={group} />
						</li>
					))}
				</ul>
			</Card.Body>
			<Card.Footer>
				<Button
					variant="light"
					color="destructive"
					className="w-full text-right"
					onClick={turnAllGroupsOff}
				>
					Tout éteindre&nbsp;
					<FontAwesomeIcon icon={faPowerOff} />
				</Button>
			</Card.Footer>
		</Card>
	);
}
