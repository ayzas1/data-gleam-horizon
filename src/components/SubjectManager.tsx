
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
          <Card key={class_.id} className="p-4">
            <Link to={`/subject/${class_.id}`} className="block">
              <h3 className="font-medium">{class_.name}</h3>
              {class_.description && (
                <p className="text-sm text-muted-foreground mt-1">{class_.description}</p>
              )}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
