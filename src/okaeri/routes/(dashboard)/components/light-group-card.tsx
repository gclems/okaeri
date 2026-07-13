import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";

import type { DomoLightGroup } from "#/shared/lighting-types";

function LightGroupCard({ group }: { group: DomoLightGroup }) {
	const handleClick = () => {
		// toggleLight({ entityId: group.id });
		alert(`toggle: ${group.id}`);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="flex items-center gap-x-2 w-full justify-start text-left cursor-pointer hover:bg-accent px-4 py-0.5 rounded-sm"
		>
			<div className="flex-1">
				<div className="font-semibold">{group.name}</div>
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
							{group.state === "on" ? "allumée" : "éteinte"}
						</motion.span>
					</AnimatePresence>
				</div>
			</div>
			<div className="w-8 text-center text-xl">
				{group.state === "on" && (
					<div
						style={{
							color: group.color
								? `rgb(${group.color.red},${group.color.green},${group.color.blue})`
								: "yellow",
						}}
					>
						<FontAwesomeIcon icon={faLightbulb} />
					</div>
				)}
				{group.state === "off" && (
					<div className="text-muted">
						<FontAwesomeIcon icon={farLightbulb} />
					</div>
				)}
				<div className="text-xs">
					{group.state === "on" && <>{Math.ceil((group.brightness || 0) * 100)}%</>}
					{group.state === "off" && <span className="text-transparent">0%</span>}
				</div>
			</div>
		</button>
	);
}

export { LightGroupCard };
