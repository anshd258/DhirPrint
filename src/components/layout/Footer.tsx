
export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DhirPrint AI. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Powered by AI, Crafted with Care.
        </p>
      </div>
    </footer>
  );
}
