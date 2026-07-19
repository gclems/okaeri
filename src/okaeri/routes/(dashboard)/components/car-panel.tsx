import {
	faBatteryHalf,
	faChargingStation,
	faRoad,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fieldset } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useCar } from "@/features/car/use-car";

function CarPanel() {
	const car = useCar();

	if (!car) return null;

	const remainingChargeTime = car.remainingChargeTime ?? 0;
	const hours = Math.floor(car.remainingChargeTime / 60);
	const minutes = car.remainingChargeTime % 60;
	return (
		<Fieldset
			legend={
				<div className="flex gap-x-4 justify-between">
					<img src="/renault_4_small.png" alt="Renault 4" className="h-6 w-auto" />
					<div className="flex-1 truncate">{car.name}</div>
				</div>
			}
		>
			<div className="grid grid-cols-2 gap-2">
				<div className="text-xl flex items-baseline gap-x-1">
					<FontAwesomeIcon icon={faBatteryHalf} className="-rotate-90" />
					<div className="flex items-baseline gap-x-2">
						<div className="flex items-baseline">
							<span className="text-metric">
								<RollingNumber number={car.batteryLevel} />
							</span>
							<span>%</span>
						</div>
						<div className="flex items-baseline">
							<span className="text-metric text-sm">
								<RollingNumber number={car.batteryLife} />
							</span>
							<span className="text-sm">Km</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-x-1">
					<FontAwesomeIcon icon={faRoad} />
					<div className="text-metric">{car.totalMileage}</div>
					<span className="text-sm">Km</span>
				</div>

				{car.charging && (
					<div className="flex items-baseline gap-x-1">
						<FontAwesomeIcon icon={faChargingStation} />
						<div className="">
							<span className="text-metric">
								{String(hours).padStart(2, "0")}h{String(minutes).padStart(2, "0")}m
							</span>
							<span> restant</span>
						</div>
					</div>
				)}
			</div>
		</Fieldset>
	);
}

export { CarPanel };
