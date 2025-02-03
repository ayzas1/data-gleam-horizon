import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserCircle } from "lucide-react";
import { ProfileForm } from "./ProfileForm";

export const ProfileButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Open profile</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Profile</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ProfileForm />
        </div>
      </SheetContent>
    </Sheet>
  );
};