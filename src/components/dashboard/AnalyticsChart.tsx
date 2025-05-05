
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsData } from "@/context/DataContext";

interface AnalyticsChartProps {
  data: AnalyticsData;
  type: "bar" | "pie";
  dataKey: keyof AnalyticsData;
  title: string;
  height?: number;
}

const COLORS = ['#F97316', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsChart = ({ data, type, dataKey, title, height = 300 }: AnalyticsChartProps) => {
  const chartData = data[dataKey] as { date?: string; range?: string; category?: string; count: number }[];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey={chartData[0]?.date ? 'date' : chartData[0]?.range ? 'range' : 'category'} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #ccc' 
                  }} 
                />
                <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={(entry) => entry.category || entry.range || ''}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
