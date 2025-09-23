import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export const StatCard = ({ title, value, description, icon, trend, className = "" }: StatCardProps) => {
  const isPositiveTrend = trend && trend.value > 0;
  
  return (
    <Card className={`transition-smooth hover:shadow-brand-secondary ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center space-x-1">
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3 text-secondary" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <Badge 
              variant={isPositiveTrend ? "secondary" : "destructive"}
              className="text-xs px-1 py-0"
            >
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </Badge>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};