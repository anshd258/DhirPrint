
"use client"; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, TrendingUp, Activity, DollarSign, UsersRound, Target } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell, CartesianGrid, BarChart } from 'recharts';
import { generateSalesReport } from '@/ai/flows/generate-sales-report';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, FileText } from "lucide-react";

const monthlySalesData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
];

const productCategoryData = [
  { name: 'Banners', value: 400 },
  { name: 'Acrylics', value: 300 },
  { name: 'Neon', value: 200 },
  { name: 'Other', value: 100 },
];

const CHART_COLORS_THEME = [
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))', 
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<{report: string, summary: string} | null>(null);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportData(null);
    try {
      const criteria = `Sales report for the last quarter, highlighting best-selling product categories and revenue trends. Include visualizable data points.`;
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

  const kpis = [
    { title: "Total Revenue", value: "$12,345", change: "+12.5%", icon: <DollarSign className="h-6 w-6 text-primary" />, colorClass: "text-primary" },
    { title: "New Orders", value: "234", change: "+5.2%", icon: <ShoppingCart className="h-6 w-6 text-primary" />, colorClass: "text-primary" }, // Changed to primary
    { title: "Active Users", value: "1,287", change: "-2.1%", icon: <UsersRound className="h-6 w-6 text-primary" />, colorClass: "text-primary" }, // Changed to primary
    { title: "Conversion Rate", value: "4.7%", change: "+0.8%", icon: <Target className="h-6 w-6 text-primary" />, colorClass: "text-primary" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-popover/95 border border-border rounded-lg shadow-xl text-popover-foreground">
          <p className="label font-semibold text-sm mb-1">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
             <p key={index} style={{ color: pld.stroke || pld.fill }} className="text-xs">{`${pld.name}: ${pld.value.toLocaleString()}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <Card key={kpi.title} className="bg-card border-border/70 shadow-md hover:shadow-primary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.colorClass}`}>{kpi.value}</div>
              <p className={`text-xs mt-1 ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-destructive/90'}`}> {/* Keep green/red for change indication */}
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="font-semibold text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Monthly Sales Overview</CardTitle>
            <CardDescription className="text-xs">Revenue and units sold per month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`}/>
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`}/>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.05)' }}/>
                <Legend wrapperStyle={{fontSize: "0.75rem", paddingTop: '10px'}}/>
                <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" radius={[4, 4, 0, 0]} barSize={15}/>
                <Bar yAxisId="right" dataKey="sales" fill="hsl(var(--secondary))" name="Units Sold" radius={[4, 4, 0, 0]} barSize={15}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="font-semibold text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Product Category</CardTitle>
            <CardDescription className="text-xs">Sales distribution by product category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={productCategoryData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius="85%" 
                    innerRadius="50%"
                    fill="hsl(var(--primary))" 
                    dataKey="value" 
                    stroke="hsl(var(--card))" 
                    paddingAngle={2}
                    label={({ name, percent, fill, x, y, midAngle }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + (100 - 25) * 0.5; // Adjust label position
                        const lx = x + radius * Math.cos(-midAngle * RADIAN);
                        const ly = y + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text x={lx} y={ly} fill="hsl(var(--foreground))" textAnchor={lx > x ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="medium">
                            {`${name} (${(percent * 100).toFixed(0)}%)`}
                          </text>
                        );
                    }}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS_THEME[index % CHART_COLORS_THEME.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.05)' }}/>
                {/* <Legend wrapperStyle={{fontSize: "0.75rem", marginTop: '10px'}}/> */}
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-card border-border/70 shadow-md">
        <CardHeader>
          <CardTitle className="font-semibold text-lg">AI Sales Report Generation</CardTitle>
           <CardDescription className="text-xs">Generate a detailed sales report using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport} size="default" variant="default">
            {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <FileText className="mr-2 h-4 w-4"/> Generate Sales Report
          </Button>
          {reportData && (
            <div className="mt-6 p-4 border border-border rounded-md bg-background/50">
              <h3 className="text-md font-semibold mb-2 text-primary">Generated Report Summary:</h3>
              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line leading-relaxed">{reportData.summary}</p>
              <h3 className="text-md font-semibold mb-2 text-primary">Full Report:</h3>
              <div className="text-xs text-muted-foreground whitespace-pre-line max-h-60 overflow-y-auto border border-border/50 p-3 rounded-md bg-background/70 font-mono">
                {reportData.report}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
