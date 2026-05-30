'use client';

import * as React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  type TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

const chartColors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted-foreground))',
  destructive: 'hsl(var(--destructive))',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const chartColorPalette = [
  chartColors.primary,
  chartColors.secondary,
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
];

interface ChartBaseProps {
  data: Record<string, unknown>[];
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

interface BarChartProps extends ChartBaseProps {
  xKey: string;
  bars: { key: string; color?: string; name?: string }[];
  stacked?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const BarChart = ({
  data,
  xKey,
  bars,
  height = 300,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  stacked = false,
  layout = 'horizontal',
}: BarChartProps) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          )}
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                dataKey={xKey}
                type="category"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
            />
          )}
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name || bar.key}
              fill={bar.color || chartColorPalette[index % chartColorPalette.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface LineChartProps extends ChartBaseProps {
  xKey: string;
  lines: { key: string; color?: string; name?: string }[];
}

const LineChart = ({
  data,
  xKey,
  lines,
  height = 300,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
}: LineChartProps) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
            />
          )}
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={
                line.color || chartColorPalette[index % chartColorPalette.length]
              }
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartProps extends ChartBaseProps {
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  showLabel?: boolean;
}

const PieChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  className,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 100,
  colors = chartColorPalette,
  showLabel = false,
}: PieChartProps) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            label={showLabel}
            paddingAngle={2}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
            />
          )}
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AreaChartProps extends ChartBaseProps {
  xKey: string;
  areas: { key: string; color?: string; name?: string }[];
  stacked?: boolean;
}

const AreaChart = ({
  data,
  xKey,
  areas,
  height = 300,
  className,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  stacked = false,
}: AreaChartProps) => {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--muted-foreground))"
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
              }}
            />
          )}
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name || area.key}
              stroke={
                area.color ||
                chartColorPalette[index % chartColorPalette.length]
              }
              fill={
                area.color ||
                chartColorPalette[index % chartColorPalette.length]
              }
              fillOpacity={0.2}
              strokeWidth={2}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  chartColors,
  chartColorPalette,
};
export type { TooltipProps };
