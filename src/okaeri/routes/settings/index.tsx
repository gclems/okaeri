import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button, Fieldset, Label, Select } from "shanty-ui";
import { z } from "zod";

import { persistSettings } from "#/server/settings/settings-functions";
import type { Setting } from "#/server/settings/settings-types";
import type { HassDeviceRegistryEntry } from "#/shared/hass-registry-types";
import { QueryLoader } from "@/components/query-loader";
import { useHomeAssistantDevices } from "@/features/registry/use-home-assistant-devices";
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
	car_device_id: z.string().trim().min(1).max(100).nullable().optional(),
});

type FormType = z.infer<typeof formSchema>;

function SettingsForm({
	settings,
	homeAssistantDevices,
}: {
	settings: Setting[];
	homeAssistantDevices: HassDeviceRegistryEntry[];
}) {
	const queryClient = useQueryClient();
	const saveMutation = useMutation({
		mutationFn: (settings: Setting[]) =>
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
		const settingsToSave: Setting[] = Object.entries(data).map(
			([key, value]) => ({
				key,
				value: value ?? null,
			}),
		);
		await saveMutation.mutateAsync(settingsToSave);
	};

	const devicesOptions = homeAssistantDevices
		.map((device) => ({
			label: device.name_by_user ?? device.name ?? device.id,
			value: device.id,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));

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
