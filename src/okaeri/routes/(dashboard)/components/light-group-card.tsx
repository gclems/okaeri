import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Popover, Switch, cn } from "shanty-ui";

import type { DomoLightGroup } from "#/interfaces/lighting";
import { toggleLight } from "#/server/lighting/lighting-functions";
import { AnimatedNumber } from "@/components/animated-number";
import { QueryLoader } from "@/components/query-loader";
import { useRooms } from "@/features/architect/use-rooms";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";
import { LightModifier } from "@/routes/components/light-modifier";

function LightGroupCard({ group }: { group: DomoLightGroup }) {
	const lights = useLightBulbs(group);
	const roomsQuery = useRooms();

	const handleClick = () => {
		toggleLight({ data: { entityId: group.id } });
	};

	return (
		<Card
			size="xs"
			className={cn("transition-color duration-300", {
				"bg-surface/20": !group.isOn,
			})}
		>
			<Card.Body>
				<div className="flex items-center gap-x-2">
					<div
						className={cn(" text-3xl", {
							"text-energy": group.isOn,
						})}
					>
						<FontAwesomeIcon icon={group.isOn ? faLightbulb : farLightbulb} />
						<Switch
							color={group.isOn ? "warning" : "neutral"}
							checked={group.isOn}
							onCheckedChange={() => handleClick()}
						/>
					</div>
					<div className="flex-1">
						<div className="text-heading truncate">
							<QueryLoader queries={[roomsQuery]}>
								{([rooms]) => {
									const room = rooms.find((room) => room.haAreaId === group.areaId);

									return room?.name || group.name;
								}}
							</QueryLoader>
						</div>

						<div className="flex justify-end items-center mt-2">
							{lights.map((light) => {
								const isOn = light.isOn && !!light.color;
								return (
									<Popover key={light.id}>
										<Popover.Trigger
											render={<div />}
											nativeButton={false}
											className="w-6 flex flex-col items-center cursor-pointer"
										>
											<div
												key={isOn ? "on" : "off"}
												className="size-4 border-2 border-foreground rounded-xl flex items-center justify-center"
												style={
													isOn
														? {
																backgroundColor: `rgb(${light.color?.red},${light.color?.green},${light.color?.blue})`,
																borderColor: "var(--foreground)",
															}
														: {
																backgroundColor: "var(--surface)",
																borderColor: "var(--border)",
															}
												}
											>
												{!light.isOn && <span className="rotate-45">|</span>}
											</div>
											<div className="text-xs text-metric">
												<AnimatedNumber
													number={(light.brightness || 0) * 100}
													formatter={(value) => String(Math.ceil(value))}
												/>
												%
											</div>
										</Popover.Trigger>
										<Popover.Popup>
											<LightModifier lightBulb={light} />
										</Popover.Popup>
									</Popover>
								);
							})}
						</div>
					</div>
				</div>
			</Card.Body>
		</Card>
	);
}

export { LightGroupCard };
