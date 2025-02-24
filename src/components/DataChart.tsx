
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface Grade {
  assignment_number: number;
  points_earned: number;
}

interface DataChartProps {
  classId?: string;
}

const DataChart = ({ classId }: DataChartProps) => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    const loadGrades = async () => {
      if (!user) return;

      const query = supabase
        .from("grades")
        .select(`
          points_earned,
          assignments!inner(title)
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

      const formattedData = data.map((grade, index) => ({
        assignment_number: index + 1,
        points_earned: grade.points_earned
      }));

      setGrades(formattedData);
    };

    loadGrades();
  }, [user, classId]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Grade Performance</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={grades}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="assignment_number"
              label={{ value: "Assignment Number", position: "bottom" }}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              label={{ value: "Grade", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="points_earned"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DataChart;
