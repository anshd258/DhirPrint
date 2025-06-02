
import SignupForm from "@/components/auth/SignupForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <Card className="w-full max-w-md shadow-xl bg-card border-border/70">
        <CardHeader className="text-center p-6 sm:p-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground pt-2 text-sm">Join DhirPrint AI and start designing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <SignupForm />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
          <GoogleSignInButton />
        </CardContent>
        <CardFooter className="p-6 sm:p-8 text-center block border-t border-border/50 mt-2">
            <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
