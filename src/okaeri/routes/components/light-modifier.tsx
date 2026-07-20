import { useState } from "react";

import { type RgbaColor, RgbaColorPicker } from "react-colorful";
import { Switch } from "shanty-ui";

import type { DomoLightBulb, DomoRgbColor } from "#/interfaces/lighting";
import {
	setLightColorAndBrightness,
	toggleLight,
} from "#/server/lighting/lighting-functions";

type DomoLightParameters = {
	color: DomoRgbColor | null;
	brightness: number | null;
};

const DomoRgbColorToRgbaColor = (
	color: DomoRgbColor | null,
	brightness: number | null,
): RgbaColor | null => {
	if (!color) return null;
	return { r: color.red, g: color.green, b: color.blue, a: brightness ?? 0 };
};

const RgbaColorToDomo = (color: RgbaColor): DomoLightParameters => {
	return {
		color: { red: color.r, green: color.g, blue: color.b },
		brightness: color.a ?? null,
	};
};

function LightModifier({ lightBulb }: { lightBulb: DomoLightBulb }) {
	const [currentColor, setCurrentColor] = useState<DomoLightParameters>({
		color: lightBulb.color,
		brightness: lightBulb.brightness,
	});

	const handleChange = (value: DomoLightParameters) => {
		if (!value.color || !value.brightness) return;

		setCurrentColor(value);

		setLightColorAndBrightness({
			data: {
				entityId: lightBulb.id,
				color: value.color,
				brightness: value.brightness,
			},
		});
	};

	const handleSwitchChange = () => {
		toggleLight({ data: { entityId: lightBulb.id } });
	};

	return (
		<div className="w-fit space-y-4">
			<div className="flex items-center justify-between gap-x-8">
				<div className="text-heading flex-1 truncate">{lightBulb.name}</div>
				<Switch
					color={lightBulb.isOn ? "warning" : "neutral"}
					checked={lightBulb.isOn}
					onCheckedChange={() => handleSwitchChange()}
				/>
			</div>
			<RgbaColorPicker
				color={
					DomoRgbColorToRgbaColor(currentColor.color, currentColor.brightness) ??
					undefined
				}
				onChange={(color) => handleChange(RgbaColorToDomo(color))}
			/>
		</div>
	);
}

export { LightModifier };
