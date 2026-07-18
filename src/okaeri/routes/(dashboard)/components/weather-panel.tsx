import { Fieldset } from "shanty-ui";

import { useToday } from "@/features/clock/use-today";
import { SunPanel } from "@/routes/(dashboard)/components/sun-panel";

function WeatherPanel() {
	const today = useToday();
	return (
		<Fieldset
			legend={
				<div className="flex gap-x-8">
					<div className="flex-1 truncate">Météo</div>
					<div className="text-heading text-center">
						{today.toLocaleDateString("fr-FR", {
							weekday: "short",
							day: "2-digit",
							month: "short",
						})}
					</div>
				</div>
			}
		>
			<SunPanel />
		</Fieldset>
	);
}

export { WeatherPanel };
