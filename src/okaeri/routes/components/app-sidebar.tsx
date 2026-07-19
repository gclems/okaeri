import { faHouseCrack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { CogIcon, HomeIcon, LandmarkIcon, MapIcon } from "lucide-react";
import { Separator, Sidebar, Tooltip, cn, useSidebar } from "shanty-ui";

function AppSidebar() {
	const sidebar = useSidebar();

	return (
		<Sidebar collapsible="icon">
			<Sidebar.Content className="flex-1">
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
					<Tooltip content="Plan">
						<Sidebar.Item render={<Link to="/map" />}>
							<MapIcon /> Plan
						</Sidebar.Item>
					</Tooltip>
				</div>

				<Separator className="bg-border my-4" />

				<Tooltip content="Paramètres">
					<Sidebar.Item render={<Link to="/settings" />}>
						<CogIcon />
						Paramètres
					</Sidebar.Item>
				</Tooltip>

				<Tooltip content="Architecte">
					<Sidebar.Item render={<Link to="/home-architect" />}>
						<LandmarkIcon />
						Architecte
					</Sidebar.Item>
				</Tooltip>

				<Tooltip content="Architecte">
					<Sidebar.Item render={<Link to="/home-assistant-observer" />}>
						<FontAwesomeIcon icon={faHouseCrack} /> Home Assistant Observer
					</Sidebar.Item>
				</Tooltip>
			</Sidebar.Content>
		</Sidebar>
	);
}

export { AppSidebar };
