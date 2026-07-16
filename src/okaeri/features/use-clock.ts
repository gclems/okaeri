import { useEffect, useState } from "react";

export function useClock() {
	const [now, setNow] = useState<Date>(() => new Date());

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), 1_000);

		return () => window.clearInterval(interval);
	}, []);

	return now;
}
