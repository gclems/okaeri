import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import JsonView from "@uiw/react-json-view";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Fieldset } from "shanty-ui";

import type {
	HomeAssistantArea,
	HomeAssistantDevice,
	HomeAssistantEntity,
} from "#/interfaces/home-assistant";
import { QueryLoader } from "@/components/query-loader";
import { useHomeAssistantAreas } from "@/features/home-assistant-registry/use-home-assistant-area";
import { useHomeAssistantDevices } from "@/features/home-assistant-registry/use-home-assistant-devices";
import { useHomeAssistantEntities } from "@/features/home-assistant-registry/use-home-assistant-entities";

export const Route = createFileRoute("/home-assistant-observer/")({
	component: RouteComponent,
});

function RouteComponent() {
	const areasQuery = useHomeAssistantAreas();
	const devicesQuery = useHomeAssistantDevices();
	const entitiesQuery = useHomeAssistantEntities();

	return (
		<div className="space-y-8">
			<Section title="Pièces" query={areasQuery} />
			<Section title="Appareils" query={devicesQuery} />
			<Section title="Entités" query={entitiesQuery} />
		</div>
	);
}

function Section({
	title,
	query,
}: {
	title: string;
	query:
		| ReturnType<typeof useHomeAssistantAreas>
		| ReturnType<typeof useHomeAssistantDevices>
		| ReturnType<typeof useHomeAssistantEntities>;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Fieldset
			legend={
				<div
					className="flex justify-between"
					onMouseDown={() => setExpanded((prev) => !prev)}
				>
					<div className="flex-1 truncate text-metric text-sm">
						{title} ({query.data?.length})
					</div>
					<div>
						<ChevronDown />
					</div>
				</div>
			}
		>
			<AnimatePresence>
				<QueryLoader queries={[query]}>
					{([data]) => (
						<>
							{expanded && (
								<motion.div
									className="space-y-1 overflow-hidden px-4"
									initial={{ height: 0 }}
									animate={{ height: expanded ? "auto" : 0 }}
									exit={{ height: 0 }}
									transition={{ duration: 0.2 }}
								>
									{data
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((item) => (
											<JsonPanel key={item.id} data={item} />
										))}
								</motion.div>
							)}
						</>
					)}
				</QueryLoader>
			</AnimatePresence>
		</Fieldset>
	);
}

function JsonPanel({
	data,
}: {
	data: HomeAssistantEntity | HomeAssistantDevice | HomeAssistantArea;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div>
			<div
				className="flex justify-between"
				onMouseDown={() => setExpanded((prev) => !prev)}
			>
				<div className="flex-1 truncate text-metric text-sm">
					{data.name}{" "}
					{"entityId" in data && (
						<span className="text-xs text-muted">{data.entityId}</span>
					)}
				</div>
				<div>
					<ChevronDown />
				</div>
			</div>
			<AnimatePresence>
				{expanded && (
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: expanded ? "auto" : 0 }}
						exit={{ height: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden text-xs text-metric border border-border rounded-md px-4 py-1"
					>
						<JsonView value={data} collapsed={1} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
