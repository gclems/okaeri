function LastUpdatedDescription({ lastUpdated }: { lastUpdated: string }) {
	let secondsAgo = Math.floor(
		(Date.now() - new Date(lastUpdated).getTime()) / 1000,
	);

	const daysAgo = Math.floor(secondsAgo / 86400);
	secondsAgo -= daysAgo * 86400;

	const hoursAgo = Math.floor(secondsAgo / 3600);
	secondsAgo -= hoursAgo * 3600;

	const minutesAgo = Math.floor(secondsAgo / 60);

	return (
		<div className="text-muted-foreground text-sm">
			màj: il y a {daysAgo > 0 && <>{daysAgo}j</>}
			{hoursAgo > 0 && <>{hoursAgo.toString().padStart(2, "0")}h</>}
			{minutesAgo > 0 && <>{minutesAgo.toString().padStart(2, "0")}m</>}
		</div>
	);
}

export { LastUpdatedDescription };
