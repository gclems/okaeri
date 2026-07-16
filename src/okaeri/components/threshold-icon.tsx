import {
	faCircleExclamation,
	faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
	FontAwesomeIcon,
	type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { cn } from "shanty-ui";

import type { ThresholdLevel } from "@/features/environment/environment-thresholds";

function ThresholdIcon({
	level,
	className,
	...props
}: { level: ThresholdLevel } & Omit<FontAwesomeIconProps, "icon">) {
	switch (level) {
		case "critical_low":
			return (
				<FontAwesomeIcon
					icon={faTriangleExclamation}
					className={cn("text-info", className)}
					{...props}
				/>
			);
		case "warning_low":
			return (
				<FontAwesomeIcon
					icon={faCircleExclamation}
					className={cn("text-warning", className)}
					{...props}
				/>
			);
		case "warning_high":
			return (
				<FontAwesomeIcon
					icon={faCircleExclamation}
					className={cn("text-warning", className)}
					{...props}
				/>
			);
		case "critical_high":
			return (
				<FontAwesomeIcon
					icon={faTriangleExclamation}
					className={cn("text-destructive", className)}
					{...props}
				/>
			);
		default:
			return null;
	}
}

export { ThresholdIcon };
