import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	Button,
	Fieldset,
	Label,
	Select,
	stringIsNullOrEmpty,
} from "shanty-ui";
import { z } from "zod";

import type { HomeAssistantDevice } from "#/interfaces/home-assistant";
import type { DomoSetting } from "#/interfaces/settings";
import { persistSettings } from "#/server/settings/settings-functions";
import { QueryLoader } from "@/components/query-loader";
import { useHomeAssistantDevices } from "@/features/home-assistant-registry/use-home-assistant-devices";
import {
	settingsQueryOptions,
	useSettings,
} from "@/features/settings/use-settings";

export const Route = createFileRoute("/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const allSettingsQuery = useSettings();
	const homeAssistantDevicesQuery = useHomeAssistantDevices();

	return (
		<QueryLoader queries={[allSettingsQuery, homeAssistantDevicesQuery]}>
			{([settings, homeAssistantDevices]) => (
				<SettingsForm
					settings={settings}
					homeAssistantDevices={homeAssistantDevices}
				/>
			)}
		</QueryLoader>
	);
}

const formSchema = z.object({
	car_device_id: z.string().trim().max(100).nullable().optional(),
});

type FormType = z.infer<typeof formSchema>;

function SettingsForm({
	settings,
	homeAssistantDevices,
}: {
	settings: DomoSetting[];
	homeAssistantDevices: HomeAssistantDevice[];
}) {
	const queryClient = useQueryClient();
	const saveMutation = useMutation({
		mutationFn: (settings: DomoSetting[]) =>
			persistSettings({
				data: settings,
			}),

		onSuccess: () => {
			queryClient.invalidateQueries(settingsQueryOptions);
		},
	});

	const byKey = Object.fromEntries(
		settings.map((setting) => [setting.key, setting]),
	);

	const form = useForm<FormType>({
		defaultValues: {
			car_device_id: byKey.car_device_id?.value ?? null,
		},
		resolver: zodResolver(formSchema),
	});

	const handleSubmit: SubmitHandler<FormType> = async (data) => {
		const settingsToSave: DomoSetting[] = Object.entries(data).map(
			([key, value]) => ({
				key,
				value: !stringIsNullOrEmpty(value) ? value : null,
			}),
		);
		await saveMutation.mutateAsync(settingsToSave);
	};

	const devicesOptions = homeAssistantDevices
		.map((device) => ({
			label: device.name,
			value: device.id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
	devicesOptions.unshift({
		label: "Aucun",
		value: "",
	});

	const carValue = form.watch("car_device_id");
	const selectedCarOption = carValue
		? devicesOptions.find((option) => option.value === carValue)
		: null;

	return (
		<form onSubmit={form.handleSubmit(handleSubmit)}>
			<div className="space-y-4">
				<Fieldset legend="Véhicule">
					<div className="flex items-center gap-x-4">
						<Label htmlFor="car_device_id" className="shrink-0">
							Appareil Home Assistant
						</Label>
						<Select
							id="car_device_id"
							{...form.register("car_device_id")}
							items={devicesOptions}
							value={selectedCarOption}
							onValueChange={(value) => {
								form.setValue("car_device_id", value);
							}}
						/>
					</div>
				</Fieldset>
			</div>
			<div className="mt-6 flex items-center justify-between">
				<Button
					type="reset"
					color="secondary"
					variant="light"
					onClick={() => form.reset()}
				>
					Annuler
				</Button>
				<Button type="submit" color="primary">
					Enregistrer
				</Button>
			</div>
		</form>
	);
}
