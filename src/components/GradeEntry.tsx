
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  const submitGrade = async () => {
    // Reset error state
    setError(null);
    
    if (!user || !points || !assignmentTitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate points
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
      console.log("Creating assignment with class_id:", classId);
      console.log("Current user ID:", user.id);
      
      // Create a new assignment
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
        setError(`Failed to create assignment: ${assignmentError.message}`);
        toast({
          title: "Error",
          description: `Failed to create assignment: ${assignmentError.message}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Assignment created successfully:", assignment);
      console.log("Inserting grade with student_id:", user.id, "and assignment_id:", assignment.id);

      // Create a new grade
      const { error: gradeError } = await supabase
        .from("grades")
        .insert({
          student_id: user.id,
          assignment_id: assignment.id,
          points_earned: pointsNum,
        });

      if (gradeError) {
        console.error("Grade submission error:", gradeError);
        setError(`Failed to submit grade: ${gradeError.message}`);
        toast({
          title: "Error",
          description: `Failed to submit grade: ${gradeError.message}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Grade submitted successfully",
      });

      // Reset form
      setPoints("");
      setAssignmentTitle("");
      setError(null);
      
      // Call onGradeSubmit callback if provided
      if (onGradeSubmit) {
        onGradeSubmit();
      }
    } catch (error) {
      console.error("Error in grade submission:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
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
