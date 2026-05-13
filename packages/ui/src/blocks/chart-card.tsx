"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Minimal placeholder chart component.
// Real Recharts wrapper will be dynamically imported where used.
export interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, children, className, ...props }: ChartCardProps) {
  return (
    <Card className={cn("col-span-1", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {/* The actual chart component will be rendered here */}
        <div className="h-[300px] w-full flex items-center justify-center">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
