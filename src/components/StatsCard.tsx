import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, change, icon }: StatsCardProps) => {
  return (
    <Card className="p-6 shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p className="text-sm text-green-500 mt-1">
              {change}
            </p>
          )}
        </div>
        <div className="text-primary p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;