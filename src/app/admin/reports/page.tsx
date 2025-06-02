
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Wand2 } from 'lucide-react';
import { generateSalesReport } from '@/ai/flows/generate-sales-report';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminReportsPage() {
  const [criteria, setCriteria] = useState("Generate a sales report for the last month, including top selling products, total revenue, and customer acquisition trends.");
  const [generatedReport, setGeneratedReport] = useState<{ report: string; summary: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!criteria.trim()) {
      toast({ title: "Criteria needed", description: "Please provide criteria for the report.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedReport(null);
    try {
      const result = await generateSalesReport({ criteria });
      setGeneratedReport(result);
      toast({ title: "Report Generated!", description: "AI has compiled your sales report." });
      // TODO: In a real app, save 'result' (or a link to it) to Firestore reports/{reportId}
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Report Generation Failed", description: "Could not generate report. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline flex items-center"><Wand2 className="mr-3 h-7 w-7 text-primary"/>AI-Powered Sales Report Generator</CardTitle>
          <CardDescription>
            Define the criteria for your sales report, and let our AI assistant compile the data and insights for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reportCriteria" className="text-lg font-medium">Report Criteria</Label>
            <Textarea
              id="reportCriteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="e.g., Sales performance for Q1 2024, focusing on new customer acquisitions and regional sales breakdown."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific for better results. Mention date ranges, product categories, key metrics, etc.
            </p>
          </div>
          <Button onClick={handleGenerateReport} disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileText className="mr-2 h-5 w-5" />
            )}
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-headline">Generated Sales Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTitle className="font-semibold">Report Summary</AlertTitle>
              <AlertDescription className="whitespace-pre-line leading-relaxed">
                {generatedReport.summary}
              </AlertDescription>
            </Alert>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Full Report Details</h3>
              <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/20">
                 <pre className="text-sm whitespace-pre-wrap leading-relaxed font-code">
                    {generatedReport.report}
                 </pre>
              </ScrollArea>
            </div>
            {/* TODO: Add options to download report, e.g., as PDF or CSV, or save to Firestore */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Simple ScrollArea component for report display if not available globally or for specific styling
const ScrollArea = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`overflow-auto ${className}`}>
    {children}
  </div>
);

