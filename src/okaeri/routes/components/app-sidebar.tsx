import { Link } from "@tanstack/react-router";
import {
	HomeIcon,
	LandmarkIcon,
	Lightbulb,
	SunSnowIcon,
	ThermometerIcon,
} from "lucide-react";
import { Separator, Sidebar, Tooltip, cn, useSidebar } from "shanty-ui";

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
					className={cn("w-full flex flex-col flex-1", {
						"items-center": !sidebar.open,
					})}
				>
					<Tooltip content="Dashboard">
						<Sidebar.Item render={<Link to="/" />}>
							<HomeIcon /> Dashboard
						</Sidebar.Item>
					</Tooltip>
					<Separator className="bg-border my-4" />
					<Tooltip content="Éclairage">
						<Sidebar.Item render={<Link to="/lighting" />}>
							<Lightbulb /> Éclairage
						</Sidebar.Item>
					</Tooltip>
					<Tooltip content="Confort">
						<Sidebar.Item render={<Link to="/comfort" />}>
							<ThermometerIcon /> Confort
						</Sidebar.Item>
					</Tooltip>
					<Tooltip content="Conditions météo">
						<Sidebar.Item render={<Link to="/weather" />}>
							<SunSnowIcon /> Conditions météo
						</Sidebar.Item>
					</Tooltip>
				</div>

				<Separator className="bg-border my-4" />

				<Tooltip content="Architecte">
					<Sidebar.Item render={<Link to="/settings/home-architect" />}>
						<LandmarkIcon />
						Architecte
					</Sidebar.Item>
				</Tooltip>
			</Sidebar.Content>
		</Sidebar>
	);
}

export { AppSidebar };
