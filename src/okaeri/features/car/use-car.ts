import { useEffect, useState } from "react";

export function useCar() {
	const [carState, setCarState] = useState({
		batteryLevel: 0,
		charging: true,
		chargingPower: 0, // in KWh
		chargingUnitOfMeasure: "KWh", // or "KW"
	});

	useEffect(() => {
		const interval = window.setInterval(
			() =>
				setCarState((prev) => ({
					batteryLevel: prev.batteryLevel >= 100 ? 0 : prev.batteryLevel + 1,
					charging: prev.charging,
					chargingPower: (Math.floor(Math.random() * 30) + 1) / 10,
					chargingUnitOfMeasure: prev.chargingUnitOfMeasure,
				})),
			1_000,
		);

		return () => window.clearInterval(interval);
	}, []);

	return carState;
}
