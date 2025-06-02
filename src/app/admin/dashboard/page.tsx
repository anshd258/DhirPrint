
"use client"; // Client component for charts and interactions

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart as PieChartIcon, ShoppingCart, Users, TrendingUp } from "lucide-react"; // Icons for chart types and KPIs
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell } from 'recharts'; // Assuming recharts is installed via shadcn/ui
import { generateSalesReport } from '@/ai/flows/generate-sales-report';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Mock data for charts - replace with actual data fetching
const monthlySalesData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
];

const productCategoryData = [
  { name: 'Flex Banners', value: 400 },
  { name: 'Acrylic Signs', value: 300 },
  { name: 'Neon Signs', value: 200 },
  { name: 'Other', value: 100 },
];
const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<{report: string, summary: string} | null>(null);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportData(null);
    try {
      const criteria = `Sales report for the last quarter, highlighting best-selling product categories and revenue trends.`;
      const result = await generateSalesReport({ criteria });
      setReportData(result);
      toast({ title: "Sales Report Generated", description: "The AI has compiled your sales report."});
    } catch (error) {
      console.error("Error generating sales report:", error);
      toast({ title: "Report Generation Failed", description: "Could not generate the report.", variant: "destructive"});
    } finally {
      setIsGeneratingReport(false);
    }
  };


  // Placeholder KPIs
  const kpis = [
    { title: "Total Revenue", value: "$12,345", change: "+12.5%", icon: <BarChart className="h-6 w-6 text-primary" /> },
    { title: "New Orders", value: "234", change: "+5.2%", icon: <ShoppingCart className="h-6 w-6 text-secondary" /> },
    { title: "Active Users", value: "1,287", change: "-2.1%", icon: <Users className="h-6 w-6 text-accent" /> },
    { title: "Conversion Rate", value: "4.7%", change: "+0.8%", icon: <TrendingUp className="h-6 w-6 text-primary" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <Card key={kpi.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-primary' : 'text-muted-foreground'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Monthly Sales Overview</CardTitle>
            <CardDescription>Revenue and units sold per month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySalesData}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} name="Revenue ($)" />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--secondary))" name="Units Sold" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Product Category Distribution</CardTitle>
            <CardDescription>Sales distribution by product category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="hsl(var(--primary))" dataKey="value" 
                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">AI Sales Report Generation</CardTitle>
           <CardDescription>Generate a detailed sales report using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Sales Report
          </Button>
          {reportData && (
            <div className="mt-6 p-4 border rounded-md bg-muted/30">
              <h3 className="text-lg font-semibold mb-2">Generated Report Summary:</h3>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{reportData.summary}</p>
              <h3 className="text-lg font-semibold mb-2">Full Report:</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line max-h-60 overflow-y-auto border p-2 rounded">
                {reportData.report}
              </div>
               {/* In a real app, this might be a link to download the report */}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

// Lucide icons used in KPIs (if not available, you might need to find alternatives or remove them)
// const Users = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
// const ShoppingCart = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
// const TrendingUp = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
