import { SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { Card } from "shanty-ui";

import type { Sun } from "#/shared/sun-types";
import { QueryLoader } from "@/components/query-loader";
import { SunPhaseIcon } from "@/components/sun-phase-icon";
import { useSun } from "@/features/sun/use-sun";

function SunPanel() {
	// const sun = useSunStore();
	const sunQuery = useSun();

	return (
		<Card size="sm">
			<Card.Body>
				<QueryLoader queries={[sunQuery]}>
					{([sun]) => {
						if (!sun) return null;
						return <SunPanelContent sun={sun} />;
					}}
				</QueryLoader>
			</Card.Body>
		</Card>
	);
}

function SunPanelContent({ sun }: { sun: Sun }) {
	return (
		<div className="grid grid-cols-4 items-center justify-center">
			<div className="text-energy place-self-center">
				<SunPhaseIcon size="3rem" />
			</div>
			<SunValue icon={<SunriseIcon />} value={sun?.sunrise_at.toISOString()} />
			<SunValue icon={<SunIcon />} value={sun?.solarnoon_at.toISOString()} />
			<SunValue icon={<SunsetIcon />} value={sun?.sunset_at.toISOString()} />
			<div className="text-heading text-center">
				{new Date().toLocaleDateString("fr-FR", {
					weekday: "short",
					day: "2-digit",
					month: "short",
				})}
			</div>
			<SunTomorrowValue value={sun?.tomorrow?.sunrise_at.toISOString()} />
			<SunTomorrowValue value={sun?.tomorrow?.solarnoon_at.toISOString()} />
			<SunTomorrowValue value={sun?.tomorrow?.sunset_at.toISOString()} />
		</div>
	);
}

function SunValue({ icon, value }: { icon?: React.ReactNode; value?: string }) {
	return (
		<div className="flex flex-col items-center">
			{icon}
			{!value && <span className="text-muted-foreground">--</span>}
			{value && (
				<span className="text-metric text-sm">
					{new Date(value).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			)}
		</div>
	);
}

function SunTomorrowValue({ value }: { value?: string }) {
	return (
		<div className="flex flex-col items-center text-muted-foreground">
			{!value && <span>--</span>}
			{value && (
				<span className="text-metric text-xs">
					{new Date(value).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			)}
		</div>
	);
}

export { SunPanel };
