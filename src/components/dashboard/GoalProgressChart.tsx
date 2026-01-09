import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalProgressChartProps {
  data: Array<{
    name: string;
    atual: number;
    meta: number;
  }>;
  title?: string;
  goalValue?: number;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl"
      >
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  data,
  title = 'Progresso das Metas',
  goalValue = 20,
  className,
}) => {
  const latestValue = data[data.length - 1]?.atual || 0;
  const goalAchieved = latestValue >= goalValue;
  const progressPercent = Math.min((latestValue / goalValue) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "bg-card rounded-2xl p-6 border border-border/50",
        "shadow-[0_4px_24px_-4px_hsl(210_60%_15%/0.08)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe seu progresso mensal
            </p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          goalAchieved 
            ? "bg-success/10 text-success" 
            : "bg-warning/10 text-warning"
        )}>
          <TrendingUp className="w-4 h-4" />
          {progressPercent.toFixed(0)}% da meta
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progresso atual</span>
          <span className="font-semibold">{latestValue} / {goalValue}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className={cn(
              "h-full rounded-full",
              goalAchieved
                ? "bg-gradient-to-r from-success to-success/80"
                : "bg-gradient-to-r from-primary to-accent"
            )}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientAtual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientMeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={goalValue} 
              stroke="hsl(var(--success))" 
              strokeDasharray="5 5"
              label={{ 
                value: 'Meta', 
                fill: 'hsl(var(--success))',
                fontSize: 12,
                position: 'right'
              }}
            />
            <Area
              type="monotone"
              dataKey="meta"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fill="url(#gradientMeta)"
              name="Meta"
            />
            <Area
              type="monotone"
              dataKey="atual"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#gradientAtual)"
              name="Atual"
              animationDuration={1500}
              animationBegin={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GoalProgressChart;
