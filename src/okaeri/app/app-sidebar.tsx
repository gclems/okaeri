import { Link } from "@tanstack/react-router";
import { HomeIcon, Lightbulb, ThermometerIcon } from "lucide-react";
import { Separator, Sidebar, cn, useSidebar } from "shanty-ui";

function AppSidebar() {
	const sidebar = useSidebar();

	return (
		<Sidebar collapsible="icon">
			<Sidebar.Content>
				<button
					type="button"
					onClick={() => sidebar.setOpen(!sidebar.open)}
					className="flex flex-col items-center gap-1 mt-6 px-2 cursor-pointer"
				>
					<img src="/logo_image.png" alt="Logo" className="max-w-24 w-full" />
					{sidebar.open && (
						<img src="/logo_title_both.png" alt="Logo" className="max-w-36" />
					)}
				</button>
				<Separator className="my-4 bg-border" />
				<div
					className={cn("w-full flex flex-col", {
						"items-center": !sidebar.open,
					})}
				>
					<Sidebar.Item render={<Link to="/" />}>
						<HomeIcon /> Accueil
					</Sidebar.Item>
					<Separator className="bg-border my-4" />
					<Sidebar.Item render={<Link to="/lighting" />}>
						<Lightbulb /> Éclairage
					</Sidebar.Item>
					<Sidebar.Item render={<Link to="/comfort" />}>
						<ThermometerIcon /> Confort
					</Sidebar.Item>
				</div>
			</Sidebar.Content>
		</Sidebar>
	);
}

export { AppSidebar };
