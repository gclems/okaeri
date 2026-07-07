import { faLightbulb, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from "shanty-ui";

export function DashboardLightGroupsPanel() {
	// const groupsIds = useLightingStore((state) => state.groups);

	// const groups = useMemo(() => {
	// 	return Object.values(groupsIds);
	// }, [groupsIds]);

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
					<div className="size-20 bg-primary rounded-md" />
					{/* {groups.map((group) => (
						<DashboardLightGroupCard key={group.entityId} group={group} />
					))} */}
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
