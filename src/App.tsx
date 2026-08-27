import { AppSidebar01 } from "@/components/app-sidebar-01";
import { AppSidebar02 } from "@/components/app-sidebar-02";
import { AppSidebar03 } from "@/components/app-sidebar-03";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";

const sidebarComponents = {
  "01": AppSidebar01,
  "02": AppSidebar02,
  "03": AppSidebar03,
} as const;

type SidebarVariant = keyof typeof sidebarComponents;

const sidebarVariant =
  (import.meta.env.VITE_APP_SIDEBAR as SidebarVariant) || "01";
const AppSidebar = sidebarComponents[sidebarVariant] ?? sidebarComponents["01"];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
