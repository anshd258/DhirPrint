
export default function Footer() {
  return (
    <footer className="bg-card/50 text-muted-foreground py-8 mt-auto border-t border-border/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DhirPrint AI. All rights reserved.
        </p>
        <p className="text-xs mt-2 opacity-75">
          Innovating Printing with Artificial Intelligence.
        </p>
      </div>
    </footer>
  );
}
