import {
	faTachometerAlt,
	faThermometerHalf,
	faTint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Fieldset, cn } from "shanty-ui";

import { QueryLoader } from "@/components/query-loader";
import { useRooms } from "@/features/architect/use-rooms";
import { useEnvironmentSensors } from "@/features/environment/use-environment-sensors";

function ComfortPanel() {
	const roomsQuery = useRooms();
	const environmentDevices = useEnvironmentSensors();

	return (
		<Fieldset legend="Confort">
			<QueryLoader queries={[roomsQuery]}>
				{([rooms]) => {
					const roomsWithHaArea = rooms.filter(
						(room) =>
							room.haEnvironmentSensorDeviceId &&
							environmentDevices.some(
								(device) => device.id === room.haEnvironmentSensorDeviceId,
							),
					);

					return (
						<div className="space-y-4">
							{roomsWithHaArea.map((room) => {
								const device = environmentDevices.find(
									(device) => device.id === room.haEnvironmentSensorDeviceId,
								);

								return (
									<Card key={room.id} size="sm">
										<Card.Header title={room.name} />
										<Card.Body>
											<div className="grid grid-cols-3 items-center">
												{device?.thermometer && (
													<Card size="xs">
														<Card.Body>
															<div className="flex flex-col items-center">
																<div className="text-temperature">
																	<FontAwesomeIcon icon={faThermometerHalf} />
																	<span className="text-muted-foreground text-sm">
																		{device.thermometer.unitOfMeasurement}
																	</span>
																</div>
																<span
																	className={cn("text-metric font-semibold", {
																		"text-temperature-excessive": device.thermometer.value > 25,
																		"text-temperature-low": device.thermometer.value < 17,
																	})}
																>
																	{device.thermometer.value}
																</span>
															</div>
														</Card.Body>
													</Card>
												)}

												{device?.hygrometer && (
													<div className="flex flex-col items-center">
														<div className="text-humidity">
															<FontAwesomeIcon icon={faTint} />
															<span className="text-muted-foreground text-sm">
																{device.hygrometer.unitOfMeasurement}
															</span>
														</div>
														<span className="text-metric">{device.hygrometer.value}</span>
													</div>
												)}

												{device?.barometer && (
													<div className="flex flex-col items-center">
														<div className="text-network">
															<FontAwesomeIcon icon={faTachometerAlt} />
															<span className="text-muted-foreground text-sm">
																{device.barometer.unitOfMeasurement}
															</span>
														</div>
														<span className="text-metric">{device.barometer.value}</span>
													</div>
												)}
											</div>
										</Card.Body>
									</Card>
								);
							})}
						</div>
					);
				}}
			</QueryLoader>
		</Fieldset>
	);
}

export { ComfortPanel };
