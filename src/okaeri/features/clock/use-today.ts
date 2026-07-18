import { useEffect, useState } from "react";

export function useToday(): Date {
	const [today, setToday] = useState<Date>(() => new Date());

	useEffect(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		const timeUntilMidnight = tomorrow.getTime() - Date.now();

		const interval = window.setInterval(
			() => setToday(new Date()),
			timeUntilMidnight,
		);

		return () => window.clearInterval(interval);
	}, []);

	return today;
}
