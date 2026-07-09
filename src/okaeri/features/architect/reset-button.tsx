import { Button } from "shanty-ui";

import { useHomeArchitect } from "./use-home-architect";

function ResetButton() {
	const { reset } = useHomeArchitect();
	return (
		<Button
			variant="ghost"
			onClick={() => {
				reset();
			}}
		>
			Annuler
		</Button>
	);
}

export { ResetButton };
