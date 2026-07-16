import { RefreshCwIcon } from "lucide-react";
import { Button, Card, cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { SunPhaseIcon } from "@/components/sun-phase-icon";
import { useCar } from "@/features/car/use-car";
import { useClock } from "@/features/clock/use-clock";
import { useHomeAssistantDevices } from "@/features/registry/use-home-assistant-devices";

function AppTopBar() {
	const now = useClock();
	const car = useCar();

	const devicesQuery = useHomeAssistantDevices();
	// console.log("Devices query:", devicesQuery.data);

	return (
		<div className="flex items-center gap-x-4">
			<Card className="flex-1">
				<Card.Body>
					<div className="flex items-center gap-x-8 divide-red-500 divide-solid">
						<div>
							<div className="text-heading text-center">
								{now.toLocaleDateString("fr-FR", {
									weekday: "short",
									day: "2-digit",
									month: "short",
								})}
							</div>
							<time className="text-metric flex items-center justify-center gap-x-1">
								<div>
									<RollingNumber
										number={now.getHours()}
										formatter={(value) => Math.round(value).toString().padStart(2, "0")}
									/>
									:
									<RollingNumber
										number={now.getMinutes()}
										formatter={(value) => Math.round(value).toString().padStart(2, "0")}
									/>
								</div>
								<span className="text-energy">
									<SunPhaseIcon />
								</span>
							</time>
						</div>
						<div className="flex items-center gap-x-2">
							<img src="/renault_4_small.png" alt="Renault 4" className="h-8 w-auto" />
							<div>
								<div className="flex items-center">
									<span
										className={cn("text-metric text-2xl font-semibold", {
											"text-success": car.batteryLevel >= 80,
											"text-warning": car.batteryLevel > 20 && car.batteryLevel <= 50,
											"text-destructive": car.batteryLevel <= 20,
										})}
									>
										<RollingNumber
											number={car.batteryLevel}
											formatter={(value) => Math.round(value).toString()}
										/>
										%
									</span>
								</div>
								{car.charging && (
									<div className=" text-sm flex items-end text-success text-metric">
										<RollingNumber
											number={car.chargingPower}
											formatter={(value) => value.toFixed(1).toString()}
										/>
										{car.chargingUnitOfMeasure}
									</div>
								)}
							</div>
						</div>
						<div className="flex-1" />
						<Button
							variant="ghost"
							color="neutral"
							onClick={() => window.location.reload()}
						>
							<RefreshCwIcon />
						</Button>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}

export { AppTopBar };
