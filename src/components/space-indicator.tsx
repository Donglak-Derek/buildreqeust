'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, Thermometer } from 'lucide-react';

interface SpaceIndicatorProps {
    finishedCount: number;
    capacity: number;
}

export function SpaceIndicator({ finishedCount, capacity }: SpaceIndicatorProps) {
    const percentage = Math.min(Math.round((finishedCount / capacity) * 100), 100);

    const getStatusColor = () => {
        if (percentage > 80) return 'text-red-600';
        if (percentage > 50) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getProgressColor = () => {
        if (percentage > 80) return 'bg-red-600';
        if (percentage > 50) return 'bg-yellow-500';
        return 'bg-blue-600';
    };

    return (
        <Card className="shadow-none border-blue-100 bg-blue-50/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        Build Room Capacity
                    </span>
                    <span className={`text-xs ${getStatusColor()} font-bold`}>
                        {finishedCount} / {capacity} items
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className={`h-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        <span>Empty</span>
                        <span>Room Full</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
