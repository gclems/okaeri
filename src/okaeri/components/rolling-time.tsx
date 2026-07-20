import { cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";

export function RollingTime({
	className,
	date,
}: {
	className?: string;
	date: Date;
}) {
	return (
		<time className={cn("text-metric", className)}>
			<RollingNumber
				number={date.getHours()}
				formatter={(value) => Math.round(value).toString().padStart(2, "0")}
			/>
			<span>:</span>
			<RollingNumber
				number={date.getMinutes()}
				formatter={(value) => Math.round(value).toString().padStart(2, "0")}
			/>
		</time>
	);
}
