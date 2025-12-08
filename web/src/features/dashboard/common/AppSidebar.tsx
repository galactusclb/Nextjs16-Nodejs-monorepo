import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { constants } from "@/lib/constants";
import {
    Bird,
    Handbag,
    PanelLeftClose
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    {
        href: "/orders",
        label: "Orders",
        icon: Handbag,
    },
];

function AppSidebar() {
    const pathname = usePathname();

    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar>
            <SidebarHeader className="p-2">
                <div className="flex items-center justify-between p-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 overflow-hidden"
                    >
                        <Bird
                            className={`shrink-0 text-primary h-5 w-5`}
                        />
                        <span
                            className={`text-lg font-semibold ${isCollapsed ? "hidden" : "group-data-[collapsible=icon]:hidden"
                                }`}
                        >
                            {constants.APP_NAME}
                        </span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className={`${isCollapsed ? "hidden" : "group-data-[collapsible=icon]:hidden"
                            }`}
                    >
                        <PanelLeftClose className="h-5 w-5" />
                    </Button>
                </div>
            </SidebarHeader>
            <Separator className="mb-2 group-data-[collapsible=icon]:hidden" />
            <SidebarContent>
                <SidebarMenu>
                    {navItems
                        .map((item) => {
                            const isActive = pathname.startsWith(item.href);

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} passHref>
                                        <SidebarMenuButton
                                            tooltip={item.label}
                                            className={`cursor-pointer font-sans`}
                                            isActive={isActive}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="truncate">{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            );
                        })}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}

export { AppSidebar };
