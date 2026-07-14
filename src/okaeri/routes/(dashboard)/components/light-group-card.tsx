import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { Card, Switch, cn } from "shanty-ui";

import { toggleLight } from "#/server/lighting/lighting-functions";
import type { DomoLightGroup } from "#/shared/lighting-types";
import { AnimatedNumber } from "@/components/animated-number";
import { QueryLoader } from "@/components/query-loader";
import { useRooms } from "@/features/architect/use-rooms";
import { useLightBulbs } from "@/features/lighting/use-light-bulbs";

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
				"bg-surface/20": group.state !== "on",
			})}
		>
			<Card.Body>
				<div className="flex gap-x-2 items-baseline">
					<div
						className={cn("w-8 text-xl", {
							"text-energy": group.state === "on",
						})}
					>
						<FontAwesomeIcon
							icon={group.state === "on" ? faLightbulb : farLightbulb}
						/>
					</div>
					<div className="flex-1 flex gap-x-2 items-baseline">
						<div className="text-heading">
							<QueryLoader queries={[roomsQuery]}>
								{([rooms]) => {
									const room = rooms.find((room) => room.haAreaId === group.area_id);

									return room?.name || group.name;
								}}
							</QueryLoader>
						</div>
						<div className="text-xs overflow-hidden">
							<AnimatePresence mode="popLayout" initial={false}>
								<motion.span
									key={group.state === "on" ? "on" : "off"}
									className="block"
									initial={{ y: "100%", opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: "-100%", opacity: 0 }}
									transition={{ duration: 0.15 }}
								>
									{group.state === "on" ? "allumé" : "éteint"}
								</motion.span>
							</AnimatePresence>
						</div>
					</div>
					<div>
						<Switch
							color={group.state === "on" ? "warning" : "neutral"}
							checked={group.state === "on"}
							onCheckedChange={() => handleClick()}
						/>
					</div>
				</div>

				<div className="flex justify-end items-center mt-2 gap-x-1">
					{lights.map((light) => {
						const isOn = light.state === "on" && !!light.color;
						return (
							<div key={light.id} className="w-8 flex flex-col items-center">
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
									{light.state !== "on" && <span className="rotate-45">|</span>}
								</div>
								<div className="text-xs text-metric">
									<AnimatedNumber
										number={(light.brightness || 0) * 100}
										formatter={(value) => String(Math.ceil(value))}
									/>
									%
								</div>
							</div>
						);
					})}
				</div>
			</Card.Body>
		</Card>
	);
}

export { LightGroupCard };
