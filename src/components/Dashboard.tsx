import { ProfileButton } from "./ProfileButton";
import { GradeEntry } from "./GradeEntry";
import { DataChart } from "./DataChart";
import { StatsCard } from "./StatsCard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Grade Tracker</h1>
          <ProfileButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <GradeEntry />
            <StatsCard />
          </div>
          <div>
            <DataChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;