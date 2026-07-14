import { Fieldset } from "shanty-ui";

import { SunPanel } from "@/routes/(dashboard)/components/sun-panel";

function WeatherPanel() {
	return (
		<Fieldset legend="Météo">
			<SunPanel />
		</Fieldset>
	);
}

export { WeatherPanel };
