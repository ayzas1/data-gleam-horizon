
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SubjectManager } from "./SubjectManager";
import { ClassStats } from "./ClassStats";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Grade Tracker</h1>
            <div className="mb-8">
              <ClassStats />
            </div>
            <SubjectManager />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
