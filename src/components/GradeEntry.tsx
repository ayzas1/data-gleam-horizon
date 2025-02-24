
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface GradeEntryProps {
  classId?: string;
  onGradeSubmit?: () => void;
}

export const GradeEntry = ({ classId, onGradeSubmit }: GradeEntryProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [points, setPoints] = useState("");

  const submitGrade = async () => {
    if (!user || !points) return;

    const pointsNum = parseFloat(points);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 100) {
      toast({
        title: "Error",
        description: "Points must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    // Create a new assignment and grade
    const { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .insert({
        title: `Assignment ${Date.now()}`,
        class_id: classId,
        max_points: 100,
        passing_grade: 60
      })
      .select()
      .single();

    if (assignmentError) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
      return;
    }

    const { error: gradeError } = await supabase
      .from("grades")
      .insert({
        student_id: user.id,
        assignment_id: assignment.id,
        points_earned: pointsNum,
      });

    if (gradeError) {
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

    setPoints("");
    onGradeSubmit?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Grade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Points Earned (0-100)</label>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <Button onClick={submitGrade}>Submit Grade</Button>
      </CardContent>
    </Card>
  );
};
