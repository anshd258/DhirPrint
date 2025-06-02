
"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// A simple SVG for Google icon. In a real app, use an SVG component or library.
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
    <path fill="#EA4335" d="M24 9.5c3.105 0 5.885.97 8.045 3.015L38.535 6C34.365 2.345 29.52 0 24 0 14.325 0 6.21 5.715 2.49 13.875l7.365 5.745C11.505 13.605 17.205 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.515 24.735c0-1.68-.15-3.315-.435-4.905H24v9.36h12.645c-.54 3.045-2.175 5.625-4.605 7.38l7.14 5.565C42.87 37.74 46.515 31.74 46.515 24.735z"/>
    <path fill="#34A853" d="M10.755 28.725C10.215 27.09 9.87 25.38 9.87 23.595s.345-3.495.885-5.13L2.49 13.875C.885 17.04.015 20.61.015 24.405s.87 7.365 2.475 10.53l8.265-6.21z"/>
    <path fill="#FBBC05" d="M24 48c5.52 0 10.365-1.86 13.86-4.995l-7.14-5.565c-2.085 1.41-4.815 2.25-7.92 2.25-6.795 0-12.495-4.11-14.145-9.765L2.49 35.535C6.21 43.29 14.325 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({ title: "Sign In Successful", description: "Welcome!" });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Could not sign in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon /> 
      )}
      <span className="ml-2">Sign in with Google</span>
    </Button>
  );
}
