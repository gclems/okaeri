import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";

import type { DomoLightGroup } from "#/domo/lighting/lighting.types";

function DashboardLightGroupCard({ group }: { group: DomoLightGroup }) {
	return (
		<button
			type="button"
			onClick={() => {
				// if (!pending) {
				// 	toggleLight(group.id);
				// }
			}}
			className="flex items-center gap-x-2 w-full justify-start text-left cursor-pointer hover:bg-accent px-4 py-0.5 rounded-sm"
		>
			<div className="flex-1">
				<div className="font-semibold">{group.name}</div>
				<div className="text-xs overflow-hidden">
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.span
							key={group.isOn ? "on" : "off"}
							className="block"
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: "-100%", opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							{group.isOn ? "allumée" : "éteinte"}
						</motion.span>
					</AnimatePresence>
				</div>
			</div>
			<div className="w-8 text-center text-xl">
				{group.isOn && (
					<div
						style={{
							color: group.color ? `rgb(${group.color.join(",")})` : "yellow",
						}}
					>
						<FontAwesomeIcon icon={faLightbulb} />
					</div>
				)}
				{!group.isOn && (
					<div className="text-muted">
						<FontAwesomeIcon icon={farLightbulb} />
					</div>
				)}
				<div className="text-xs">
					{group.isOn && <>{group.brightness}%</>}
					{!group.isOn && <span className="text-transparent">0%</span>}
				</div>
			</div>
		</button>
	);
}

export { DashboardLightGroupCard };
