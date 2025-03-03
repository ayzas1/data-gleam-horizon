
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitGrade = async () => {
    if (!user || !points || !assignmentTitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const pointsNum = parseFloat(points);
    if (isNaN(pointsNum) || pointsNum < 0 || pointsNum > 100) {
      toast({
        title: "Error",
        description: "Points must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a new assignment and grade
      const { data: assignment, error: assignmentError } = await supabase
        .from("assignments")
        .insert({
          title: assignmentTitle,
          class_id: classId,
          max_points: 100,
          passing_grade: 60
        })
        .select()
        .single();

      if (assignmentError) {
        console.error("Assignment creation error:", assignmentError);
        toast({
          title: "Error",
          description: "Failed to create assignment",
          variant: "destructive",
        });
        setIsSubmitting(false);
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
        console.error("Grade submission error:", gradeError);
        toast({
          title: "Error",
          description: "Failed to submit grade",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Grade submitted successfully",
      });

      setPoints("");
      setAssignmentTitle("");
      onGradeSubmit?.();
    } catch (error) {
      console.error("Error in grade submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Grade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="assignment-title" className="block text-sm font-medium mb-1">Assignment Title</Label>
          <Input
            id="assignment-title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Enter assignment title"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="points-earned" className="block text-sm font-medium mb-1">Points Earned (0-100)</Label>
          <Input
            id="points-earned"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            className="w-full"
          />
        </div>
        <Button 
          onClick={submitGrade} 
          disabled={isSubmitting || !points || !assignmentTitle}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Grade"}
        </Button>
      </CardContent>
    </Card>
  );
};
