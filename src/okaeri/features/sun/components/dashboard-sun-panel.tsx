import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { Card, Separator } from "shanty-ui";

import { useSunStore } from "../sun.store";

function DashboardSunPanel() {
	const sun = useSunStore();

	return (
		<Card>
			<Card.Body>
				<div className="flex items-center gap-x-2">
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
						<div className="flex flex-col items-center">
							<div className="text-muted">
								<SunriseIcon size="0.9rem" />
							</div>
							<div className="text-xs">
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
						<div className="flex flex-col items-center">
							<div className="text-muted">
								<SunIcon size="0.9rem" />
							</div>
							<div className="text-xs">
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
						<div className="flex flex-col items-center">
							<div className="text-muted">
								<SunsetIcon size="0.9rem" />
							</div>
							<div className="text-xs">
								{sun?.sunset
									? new Date(sun.sunset).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})
									: "-"}
							</div>
						</div>
					</div>
				</div>
			</Card.Body>
		</Card>
	);
}

export { DashboardSunPanel };
