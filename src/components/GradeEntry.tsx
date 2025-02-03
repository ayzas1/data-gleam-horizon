import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const GradeEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [points, setPoints] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);

  const loadAssignments = async () => {
    const { data, error } = await supabase
      .from("assignments")
      .select("id, title, class_id, max_points");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
      return;
    }

    setAssignments(data || []);
  };

  const submitGrade = async () => {
    if (!user || !selectedAssignment || !points) return;

    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (!assignment) return;

    const pointsNum = parseFloat(points);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > assignment.max_points) {
      toast({
        title: "Error",
        description: `Points must be between 0 and ${assignment.max_points}`,
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("grades")
      .insert({
        student_id: user.id,
        assignment_id: selectedAssignment,
        points_earned: pointsNum,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit grade",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Grade submitted successfully",
    });

    setSelectedAssignment("");
    setPoints("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Grade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Assignment</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Points Earned</label>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            step="0.01"
          />
        </div>
        <Button onClick={submitGrade}>Submit Grade</Button>
      </CardContent>
    </Card>
  );
};