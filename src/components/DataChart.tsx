
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Grade {
  assignment_number: number;
  points_earned: number;
  title: string;
  created_at: string;
}

interface DataChartProps {
  classId?: string;
  compact?: boolean;
}

const DataChart = ({ classId, compact = false }: DataChartProps) => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    const loadGrades = async () => {
      if (!user) return;

      const query = supabase
        .from("grades")
        .select(`
          id,
          points_earned,
          created_at,
          assignments!inner(title, id)
        `)
        .eq("student_id", user.id)
        .order("created_at");

      if (classId) {
        query.eq("assignments.class_id", classId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading grades:", error);
        return;
      }

      console.log("Grade data:", data);

      const formattedData = data.map((grade, index) => ({
        assignment_number: index + 1,
        points_earned: grade.points_earned,
        title: grade.assignments.title,
        created_at: grade.created_at
      }));

      setGrades(formattedData);
    };

    loadGrades();
  }, [user, classId]);

  // Custom tooltip component that displays title and date
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const formattedDate = data.created_at ? format(new Date(data.created_at), 'MMM dd, yyyy') : 'Unknown date';
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-sm">{data.title}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
          <p className="font-semibold text-sm mt-1">{`Score: ${data.points_earned}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Set chart height based on compact mode
  const chartHeight = compact ? 120 : 300;
  const chartMargins = compact ? { top: 5, right: 20, bottom: 20, left: 20 } : undefined;

  return (
    <Card className={compact ? "p-2" : "p-6"}>
      {!compact && <h3 className="text-lg font-semibold mb-4">Grade Performance</h3>}
      <div className={`w-full ${compact ? "h-[120px]" : "h-[300px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={grades} margin={chartMargins}>
            {!compact && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis 
              dataKey="assignment_number"
              label={compact ? undefined : { value: "Assignment Number", position: "bottom" }}
              tick={!compact}
              axisLine={!compact}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={compact ? [0, 50, 100] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              label={compact ? undefined : { value: "Grade", angle: -90, position: "insideLeft" }}
              tick={!compact}
              axisLine={!compact}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="points_earned"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", r: compact ? 3 : 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DataChart;
