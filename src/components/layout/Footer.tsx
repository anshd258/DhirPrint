
export default function Footer() {
  return (
    <footer className="bg-card text-muted-foreground py-10 mt-auto border-t border-border/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DhirPrint AI. All rights reserved.
        </p>
        <p className="text-xs mt-2 opacity-80">
          Revolutionizing Custom Printing with Artificial Intelligence.
        </p>
      </div>
    </footer>
  );
}
