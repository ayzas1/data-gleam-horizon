
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface ClassStat {
  class_name: string;
  avg_grade: number;
  passing_rate: number;
  assignment_count: number;
}

export const ClassStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ClassStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassStats = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Query to get class stats including averages and passing rates
        const { data, error } = await supabase
          .from('grades')
          .select(`
            assignments!inner(
              class_id,
              title,
              passing_grade,
              classes!inner(name)
            ),
            points_earned
          `)
          .eq('student_id', user.id);
          
        if (error) {
          console.error("Error fetching class stats:", error);
          return;
        }
        
        // Process data to calculate stats per class
        const classMap = new Map<string, { 
          total: number;
          count: number;
          passing: number;
          name: string;
        }>();
        
        // Process each grade entry
        data.forEach(grade => {
          const classId = grade.assignments.class_id;
          const className = grade.assignments.classes.name;
          const passingGrade = grade.assignments.passing_grade;
          const points = Number(grade.points_earned);
          
          if (!classMap.has(classId)) {
            classMap.set(classId, {
              total: 0,
              count: 0,
              passing: 0,
              name: className
            });
          }
          
          const classData = classMap.get(classId)!;
          classData.total += points;
          classData.count += 1;
          
          if (points >= passingGrade) {
            classData.passing += 1;
          }
        });
        
        // Convert map to array of stats
        const classStats: ClassStat[] = Array.from(classMap.entries()).map(([_, data]) => ({
          class_name: data.name,
          avg_grade: data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : 0,
          passing_rate: data.count > 0 ? Math.round((data.passing / data.count) * 100) : 0,
          assignment_count: data.count
        }));
        
        setStats(classStats);
      } catch (err) {
        console.error("Error in stats calculation:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClassStats();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-28 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }
  
  if (stats.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <p>No assignment data available yet. Add grades to see statistics.</p>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Class Statistics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{stat.class_name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Average Grade</p>
                  <p className="font-mono text-lg font-semibold">{stat.avg_grade}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Passing Rate</p>
                  <p className="font-mono text-lg font-semibold">{stat.passing_rate}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Assignments</p>
                  <p>{stat.assignment_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
