
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DataChart from "./DataChart";
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

export const SubjectManager = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      });
      return;
    }

    setClasses(data || []);
  };

  const addClass = async () => {
    const name = prompt("Enter class name:");
    if (!name) return;

    const { error } = await supabase
      .from("classes")
      .insert({ name });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add class",
        variant: "destructive",
      });
      return;
    }

    loadClasses();
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Class deleted successfully",
    });
    loadClasses();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Subjects</h2>
        <Button onClick={addClass} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((class_) => (
          <Card key={class_.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/subject/${class_.id}`} className="block flex-1">
                  <h3 className="font-medium">{class_.name}</h3>
                  {class_.description && (
                    <p className="text-sm text-muted-foreground mt-1">{class_.description}</p>
                  )}
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to remove this subject? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteClass(class_.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <Link to={`/subject/${class_.id}`} className="block">
              <DataChart classId={class_.id} compact={true} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
