import { useEffect, useState } from "react";

import type { DaylySun } from "#/shared/sun-types";

import { type SunPhase, getSunPhase } from "./sun-functions";

export function useSunPhase(sun: DaylySun | undefined): SunPhase | undefined {
	const [phase, setPhase] = useState<SunPhase | undefined>(() =>
		sun ? getSunPhase(sun) : undefined,
	);

	useEffect(() => {
		const updatePhase = () => {
			setPhase(sun ? getSunPhase(sun) : undefined);
		};

		updatePhase();

		const intervalId = window.setInterval(updatePhase, 60_000);

		return () => window.clearInterval(intervalId);
	}, [sun]);

	return phase;
}
