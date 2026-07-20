import { useState } from "react";

import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { Button, Fieldset } from "shanty-ui";

import { turnOffLight } from "#/server/lighting/lighting-functions";
import { useLightGroups } from "@/features/lighting/use-light-groups";

import { LightGroupCard } from "./light-group-card";

export function LightGroupsPanel() {
	const [switchOffButtonHovered, setSwitchOffButtonHovered] = useState(false);

	const lightGroups = useLightGroups();

	const turnAllGroupsOff = () => {
		lightGroups.forEach((g) => {
			turnOffLight({ data: { entityId: g.id } });
		});
	};

	return (
		<Fieldset
			legend={
				<div className="flex items-center justify-between">
					<div>Éclairage</div>
					<Button
						variant="ghost"
						color="destructive"
						onClick={turnAllGroupsOff}
						onMouseEnter={() => setSwitchOffButtonHovered(true)}
						onMouseLeave={() => setSwitchOffButtonHovered(false)}
					>
						<AnimatePresence>
							{switchOffButtonHovered && (
								<motion.span
									className="overflow-hidden whitespace-nowrap"
									initial={{ width: 0 }}
									animate={{ width: "auto" }}
									exit={{ width: 0 }}
								>
									Tout éteindre&nbsp;
								</motion.span>
							)}
						</AnimatePresence>
						<FontAwesomeIcon icon={faPowerOff} />
					</Button>
				</div>
			}
		>
			<div>
				<ul className="grid grid-cols-2 gap-4">
					{lightGroups.map((group) => (
						<li key={group.id}>
							<LightGroupCard group={group} />
						</li>
					))}
				</ul>
			</div>
		</Fieldset>
	);
}
