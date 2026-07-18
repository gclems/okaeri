import { Button } from "shanty-ui";

import { useHomeArchitect } from "./use-home-architect";

function SubmitButton() {
	const { save, changed } = useHomeArchitect();
	return (
		<Button
			color="primary"
			className="disabled:opacity-50"
			disabled={!changed}
			onClick={() => {
				save();
			}}
		>
			Enregistrer
		</Button>
	);
}

export { SubmitButton };
