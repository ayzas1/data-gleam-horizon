
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DeleteSubjectDialogProps {
  classId: string;
  className: string;
  onDelete: () => void;
}

export const DeleteSubjectDialog = ({
  classId,
  className,
  onDelete,
}: DeleteSubjectDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!classId) return;
    
    setIsDeleting(true);
    
    try {
      // Delete associated assignments and their grades
      const { data: assignments } = await supabase
        .from("assignments")
        .select("id")
        .eq("class_id", classId);
      
      if (assignments && assignments.length > 0) {
        const assignmentIds = assignments.map(a => a.id);
        
        // Delete grades for these assignments
        await supabase
          .from("grades")
          .delete()
          .in("assignment_id", assignmentIds);
        
        // Delete the assignments
        await supabase
          .from("assignments")
          .delete()
          .in("id", assignmentIds);
      }
      
      // Delete the class
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", classId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: `"${className}" has been deleted successfully`,
      });
      
      onDelete();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{className}"? This action cannot be undone and will remove all assignments and grades associated with this subject.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
