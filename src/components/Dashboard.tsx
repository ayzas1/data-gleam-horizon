import { ArrowUpRight, Users, DollarSign, Activity } from "lucide-react";
import StatsCard from "./StatsCard";
import DataChart from "./DataChart";

const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">Welcome to your analytics overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value="2,543"
          change="+12.5% from last month"
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Revenue"
          value="$45,234"
          change="+8.2% from last month"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatsCard
          title="Active Sessions"
          value="1,234"
          change="+23.1% from last month"
          icon={<Activity className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DataChart />
      </div>
    </div>
  );
};

export default Dashboard;