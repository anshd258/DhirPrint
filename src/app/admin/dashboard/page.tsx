
"use client"; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart as LineChartIconLucide, PieChart as PieChartIcon, ShoppingCart, Users, TrendingUp, Activity, DollarSign, UsersRound, Target } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell, CartesianGrid } from 'recharts';
import { generateSalesReport } from '@/ai/flows/generate-sales-report';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
    { title: "Total Revenue", value: "$12,345", change: "+12.5%", icon: <DollarSign className="h-7 w-7 text-primary" />, colorClass: "text-primary" },
    { title: "New Orders", value: "234", change: "+5.2%", icon: <ShoppingCart className="h-7 w-7 text-secondary" />, colorClass: "text-secondary" },
    { title: "Active Users", value: "1,287", change: "-2.1%", icon: <UsersRound className="h-7 w-7 text-accent" />, colorClass: "text-accent" },
    { title: "Conversion Rate", value: "4.7%", change: "+0.8%", icon: <Target className="h-7 w-7 text-primary" />, colorClass: "text-primary" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-popover/90 border border-border rounded-lg shadow-xl text-popover-foreground">
          <p className="label font-semibold text-sm">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
             <p key={index} style={{ color: pld.color }} className="text-xs">{`${pld.name}: ${pld.value.toLocaleString()}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => (
          <Card key={kpi.title} className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-primary/10 transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-muted-foreground">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${kpi.colorClass}`}>{kpi.value}</div>
              <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-primary' : 'text-destructive/80'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-bold text-xl flex items-center"><Activity className="mr-2 text-primary"/>Monthly Sales Overview</CardTitle>
            <CardDescription>Revenue and units sold per month trends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`}/>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.1)' }}/>
                <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
                <Line type="monotone" dataKey="revenue" strokeWidth={2} stroke="hsl(var(--primary))" activeDot={{ r: 7, strokeWidth:2, fill:'hsl(var(--background))' }} name="Revenue ($)" dot={{r:4, fill:'hsl(var(--primary))'}}/>
                <Line type="monotone" dataKey="sales" strokeWidth={2} stroke="hsl(var(--secondary))" name="Units Sold" dot={{r:4, fill:'hsl(var(--secondary))'}} activeDot={{ r: 7, strokeWidth:2, fill:'hsl(var(--background))' }}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-bold text-xl flex items-center"><PieChartIcon className="mr-2 text-secondary"/>Product Category Distribution</CardTitle>
            <CardDescription>Sales distribution by product category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={productCategoryData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius="80%" 
                    fill="hsl(var(--primary))" 
                    dataKey="value" 
                    stroke="hsl(var(--border))"
                    label={({ name, percent, fill }) => <text x={0} y={0} dy={8} textAnchor="middle" fill={fill} fontSize={12} fontWeight="bold">{`${name} ${(percent * 100).toFixed(0)}%`</text>}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS_THEME[index % CHART_COLORS_THEME.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.1)' }}/>
                <Legend wrapperStyle={{fontSize: "0.8rem"}}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-bold text-xl">AI Sales Report Generation</CardTitle>
           <CardDescription>Generate a detailed sales report using AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateReport} disabled={isGeneratingReport} size="lg" variant="secondary">
            {isGeneratingReport && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Generate Sales Report
          </Button>
          {reportData && (
            <div className="mt-6 p-6 border border-border/50 rounded-lg bg-card/50">
              <h3 className="text-lg font-semibold mb-3 text-primary">Generated Report Summary:</h3>
              <p className="text-sm text-muted-foreground mb-6 whitespace-pre-line leading-relaxed">{reportData.summary}</p>
              <h3 className="text-lg font-semibold mb-3 text-secondary">Full Report:</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line max-h-80 overflow-y-auto border border-border/30 p-4 rounded-md bg-background/70 font-mono">
                {reportData.report}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
