import { faBatteryHalf, faRoad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fieldset } from "shanty-ui";

import { useCar } from "@/features/car/use-car";

function CarPanel() {
	const car = useCar();

	if (!car) return null;
	return (
		<Fieldset
			legend={
				<div className="flex gap-x-4 justify-between">
					<img src="/renault_4_small.png" alt="Renault 4" className="h-6 w-auto" />
					<div className="flex-1 truncate">{car.name}</div>
				</div>
			}
		>
			<div className="grid grid-cols-3 gap-2">
				<div className="text-xl flex items-baseline gap-x-1">
					<FontAwesomeIcon icon={faBatteryHalf} className="-rotate-90" />
					<div className="">
						<span className="text-metric">{car.batteryLevel}</span>
						<span>%</span>
						<span className="text-metric text-sm">{car.batteryLife}</span>
						<span className="text-sm">Km</span>
					</div>
				</div>

				<div className="flex items-center gap-x-1">
					<FontAwesomeIcon icon={faRoad} />
					<div className="text-metric">{car.totalMileage}</div>
					<span className="text-sm">Km</span>
				</div>
			</div>
		</Fieldset>
	);
}

export { CarPanel };
