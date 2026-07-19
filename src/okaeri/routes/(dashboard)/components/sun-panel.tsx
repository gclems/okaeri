import { SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { Card } from "shanty-ui";

import type { DomoSun } from "#/interfaces/sun";
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

function SunPanelContent({ sun }: { sun: DomoSun }) {
	return (
		<div className="grid grid-cols-4 items-center justify-center">
			<div className="text-energy place-self-center row-span-full">
				<SunPhaseIcon size="3rem" />
			</div>
			<SunValue icon={<SunriseIcon />} value={sun.sunriseAt.toISOString()} />
			<SunValue icon={<SunIcon />} value={sun.solarnoonAt.toISOString()} />
			<SunValue icon={<SunsetIcon />} value={sun.sunsetAt.toISOString()} />
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

export { SunPanel };
