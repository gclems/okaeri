import type { ComponentProps } from "react";

import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";

import type { Sun } from "#/shared/sun-types";
import { QueryLoader } from "@/components/query-loader";
import { useSun } from "@/features/sun/use-sun";
import { useSunPhase } from "@/features/sun/use-sun-phase";

function SunPhaseIcon({
	size,
	...props
}: { size?: string | number } & ComponentProps<"div">) {
	const sunQuery = useSun();

	return (
		<div {...props}>
			<QueryLoader queries={[sunQuery]}>
				{([sun]) => {
					if (!sun) return null;
					return <Renderer sun={sun} iconSize={size} />;
				}}
			</QueryLoader>
		</div>
	);
}

function Renderer({ sun, iconSize }: { sun: Sun; iconSize?: string | number }) {
	const phase = useSunPhase(sun);
	switch (phase) {
		case "day": {
			return <SunIcon size={iconSize} />;
		}
		case "night": {
			return <MoonIcon size={iconSize} />;
		}
		case "sunrise": {
			return <SunriseIcon size={iconSize} />;
		}
		case "sunset": {
			return <SunsetIcon size={iconSize} />;
		}
	}
}

export { SunPhaseIcon };
