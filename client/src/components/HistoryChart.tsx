import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar } from 'lucide-react';

type TimeRange = '7days' | '2weeks' | 'month' | 'year';

interface HistoryChartProps {
  dailyLimit: number;
}

export default function HistoryChart({ dailyLimit }: HistoryChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  // todo: remove mock functionality - this would come from real data
  const generateMockData = (range: TimeRange) => {
    const dataPoints: { date: string; count: number; limit: number }[] = [];
    let days = 7;
    let format: (date: Date) => string;

    switch (range) {
      case '7days':
        days = 7;
        format = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
        break;
      case '2weeks':
        days = 14;
        format = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        break;
      case 'month':
        days = 30;
        format = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        break;
      case 'year':
        days = 365;
        format = (date) => date.toLocaleDateString('en-US', { month: 'short' });
        break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const count = Math.floor(Math.random() * (dailyLimit * 1.5));
      
      dataPoints.push({
        date: format(date),
        count,
        limit: dailyLimit
      });
    }

    // For year view, group by month
    if (range === 'year') {
      const monthlyData: { [key: string]: { count: number; limit: number; days: number } } = {};
      
      dataPoints.forEach(point => {
        if (!monthlyData[point.date]) {
          monthlyData[point.date] = { count: 0, limit: dailyLimit, days: 0 };
        }
        monthlyData[point.date].count += point.count;
        monthlyData[point.date].days += 1;
      });

      return Object.entries(monthlyData).map(([date, data]) => ({
        date,
        count: Math.round(data.count / data.days),
        limit: data.limit
      }));
    }

    return dataPoints;
  };

  const data = generateMockData(timeRange);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-semibold text-foreground">
            Count: {payload[0].value}
          </p>
          <p className="text-xs text-muted-foreground">
            Limit: {payload[0].payload.limit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base sm:text-lg font-heading flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            History
          </CardTitle>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList className="h-8">
              <TabsTrigger value="7days" className="text-xs px-2" data-testid="tab-7days">
                7D
              </TabsTrigger>
              <TabsTrigger value="2weeks" className="text-xs px-2" data-testid="tab-2weeks">
                2W
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2" data-testid="tab-month">
                1M
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs px-2" data-testid="tab-year">
                1Y
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="limit" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Daily Count</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-destructive" />
            <span className="text-muted-foreground">Limit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}