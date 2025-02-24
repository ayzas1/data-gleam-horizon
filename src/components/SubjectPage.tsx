
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { GradeEntry } from "./GradeEntry";
import DataChart from "./DataChart";
import { supabase } from "@/integrations/supabase/client";

export const SubjectPage = () => {
  const { id } = useParams();
  const [className, setClassName] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const loadClass = async () => {
      if (!id) return;

      const { data } = await supabase
        .from("classes")
        .select("name")
        .eq("id", id)
        .single();

      if (data) {
        setClassName(data.name);
      }
    };

    loadClass();
  }, [id]);

  const handleGradeSubmit = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{className}</h1>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <GradeEntry classId={id} onGradeSubmit={handleGradeSubmit} />
              </div>
              <div>
                <DataChart key={updateTrigger} classId={id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
