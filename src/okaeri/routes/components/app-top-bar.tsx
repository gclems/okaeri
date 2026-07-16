import { RefreshCwIcon } from "lucide-react";
import { Button, Card } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useClock } from "@/features/clock/use-clock";

function AppTopBar() {
	const now = useClock();

	return (
		<div className="flex items-center gap-x-4">
			<Card className="flex-1">
				<Card.Body>
					<div className="flex items-center justify-between gap-x-2">
						<div className="">
							<div className="text-heading text-center">
								{now.toLocaleDateString("fr-FR", {
									weekday: "short",
									day: "2-digit",
									month: "short",
								})}
							</div>
							<time className="text-metric flex items-center justify-center">
								<RollingNumber
									number={now.getHours()}
									formatter={(value) => Math.round(value).toString().padStart(2, "0")}
								/>
								:
								<RollingNumber
									number={now.getMinutes()}
									formatter={(value) => Math.round(value).toString().padStart(2, "0")}
								/>
							</time>
						</div>
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
