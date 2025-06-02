
"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// TODO: Add Firestore update logic for profile

export default function ProfilePage() {
  const { currentUser, loading, logout } = useAuthContext();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace("/auth/login?redirect=/profile");
    }
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
    }
  }, [currentUser, loading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    // TODO: Implement Firebase profile update (auth and firestore)
    // Example: await updateProfile(auth.currentUser, { displayName });
    // Example: await updateDoc(doc(db, "users", currentUser.uid), { displayName });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert("Profile update functionality to be implemented.");
    setIsSaving(false);
  };

  if (loading || !currentUser) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-24 w-24 mb-4 border-4 border-primary">
            <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
            <AvatarFallback className="text-3xl">{currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserCircle className="h-12 w-12"/>}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold font-headline">My Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={currentUser.email || ""} disabled className="mt-1 bg-muted/50"/>
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>
            {/* Add more profile fields if needed, e.g., change password */}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
          <Button variant="outline" onClick={async () => { await logout(); router.push('/'); }} className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
