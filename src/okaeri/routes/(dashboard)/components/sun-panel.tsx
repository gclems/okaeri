import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { Card } from "shanty-ui";

import type { Sun } from "#/shared/sun-types";
import { QueryLoader } from "@/components/query-loader";
import type { SunPhase } from "@/features/sun/sun-functions";
import { useSun } from "@/features/sun/use-sun";
import { useSunPhase } from "@/features/sun/use-sun-phase";

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
				{/* <div className="flex items-center gap-x-2">
					<div className="text-energy">
						{sun?.phase === "morning" && <SunriseIcon size="1.875rem" />}
						{(sun?.phase === "day" || !sun) && <SunIcon size="1.875rem" />}
						{sun?.phase === "evening" && <SunsetIcon size="1.875rem" />}
						{sun?.phase === "night" && <MoonIcon size="1.875rem" />}
					</div>
					<div className="flex-1 grid grid-cols-6 items-center gap-x-2">
						<div className="flex flex-col items-center">
							<Separator orientation="vertical" className="h-4 bg-border" />
						</div>
						<div className="flex flex-col items-center gap-y-1">
							<div className="text-muted">
								<SunriseIcon size="0.9rem" />
							</div>
							<div className="text-metric text-xs">
								{sun?.sunrise
									? new Date(sun.sunrise).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})
									: "-"}
							</div>
						</div>
						<div className="flex flex-col items-center">
							<Separator orientation="vertical" className="h-4 bg-border" />
						</div>
						<div className="flex flex-col items-center gap-y-1">
							<div className="text-muted">
								<SunIcon size="0.9rem" />
							</div>
							<div className="text-metric text-xs">
								{sun?.noon
									? new Date(sun.noon).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})
									: "-"}
							</div>
						</div>
						<div className="flex flex-col items-center">
							<Separator orientation="vertical" className="h-4 bg-border" />
						</div>
						<div className="flex flex-col items-center gap-y-1">
							<div className="text-muted">
								<SunsetIcon size="0.9rem" />
							</div>
							<div className="text-metric text-xs">
								{sun?.sunset
									? new Date(sun.sunset).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})
									: "-"}
							</div>
						</div>
					</div>
				</div> */}
			</Card.Body>
		</Card>
	);
}

function SunPanelContent({ sun }: { sun: Sun }) {
	const phase = useSunPhase(sun);

	return (
		<div className="grid grid-cols-4 items-center justify-center">
			<div className="text-energy place-self-center">
				{phase && <SunPhaseIcon phase={phase} />}
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

function SunPhaseIcon({ phase }: { phase: SunPhase }) {
	switch (phase) {
		case "day": {
			return <SunIcon size="3rem" />;
		}
		case "night": {
			return <MoonIcon size="3rem" />;
		}
		case "sunrise": {
			return <SunriseIcon size="3rem" />;
		}
		case "sunset": {
			return <SunsetIcon size="3rem" />;
		}
	}
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
