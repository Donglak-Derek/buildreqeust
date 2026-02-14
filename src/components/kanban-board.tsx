'use client';

import { BuildRequest, RequestStatus } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hammer, Truck, Clock, CheckCircle2, AlertTriangle, Play, Package, User, Folder, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface KanbanBoardProps {
    requests: BuildRequest[];
    role: 'builder' | 'requester';
    onUpdateStatus: (id: string, newStatus: RequestStatus) => void;
    onToggleFlag: (id: string, flag: 'missingStock' | 'lateDelivery') => void;
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-slate-100 text-slate-700' },
    scheduled: { label: 'Scheduled', icon: Clock, color: 'bg-blue-100 text-blue-700' },
    'in-build': { label: 'In Build', icon: Hammer, color: 'bg-yellow-100 text-yellow-700' },
    'ready-for-pickup': { label: 'Ready for Pickup', icon: Truck, color: 'bg-green-100 text-green-700' },
};

export function KanbanBoard({ requests, role, onUpdateStatus, onToggleFlag }: KanbanBoardProps) {
    const columns: RequestStatus[] = ['pending', 'scheduled', 'in-build', 'ready-for-pickup'];

    const getRequestsByStatus = (status: RequestStatus) => {
        return requests.filter((r) => r.status === status);
    };

    const getRoleBadgeColor = (r: string) => {
        switch (r) {
            case 'VM': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'ID': return 'bg-pink-100 text-pink-700 border-pink-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((status) => {
                const config = STATUS_CONFIG[status];
                const columnRequests = getRequestsByStatus(status);

                return (
                    <div key={status} className="flex flex-col gap-4 min-w-[280px]">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <config.icon className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-bold uppercase tracking-wider text-xs text-muted-foreground">
                                    {config.label}
                                </h3>
                            </div>
                            <Badge variant="secondary" className="rounded-full h-5 min-w-5 flex items-center justify-center">
                                {columnRequests.length}
                            </Badge>
                        </div>

                        <div className="flex flex-col gap-3 min-h-[200px] rounded-lg bg-slate-50/50 p-2 border-2 border-dashed border-slate-200">
                            {columnRequests.map((request) => (
                                <Card key={request.id} className="shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="p-3 pb-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex gap-1">
                                                <Badge variant="outline" className={`text-[9px] px-1 h-4 ${getRoleBadgeColor(request.requesterRole)}`}>
                                                    {request.requesterRole}
                                                </Badge>
                                                <Badge variant="outline" className="text-[9px] px-1 h-4">
                                                    {request.sizeCategory}
                                                </Badge>
                                                {request.pickupMethod === 'FS' && (
                                                    <Badge variant="destructive" className="text-[9px] px-1 h-4 animate-pulse">
                                                        FS
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-mono text-muted-foreground">{request.articleNumber}</span>
                                        </div>
                                        <CardTitle className="text-sm leading-tight font-bold">{request.itemName}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-2 space-y-3">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-[10px] text-muted-foreground uppercase font-bold">
                                                <Folder className="mr-1 h-3 w-3 text-blue-500" />
                                                <span className="truncate">{request.projectName}</span>
                                            </div>
                                            <div className="flex items-center text-[10px] text-muted-foreground">
                                                <Package className="mr-1 h-3 w-3" />
                                                {request.warehouseLocation}
                                            </div>
                                            <div className="flex items-center text-[10px] text-muted-foreground">
                                                <Clock className="mr-1 h-3 w-3" />
                                                Due: {request.projectDueDate}
                                            </div>
                                        </div>

                                        {role === 'builder' && (
                                            <div className="flex gap-1 pt-2">
                                                {status === 'pending' && (
                                                    <Button
                                                        className="w-full text-[10px] h-7 bg-[#0058a3]"
                                                        size="sm"
                                                        onClick={() => onUpdateStatus(request.id, 'scheduled')}
                                                    >
                                                        Schedule
                                                    </Button>
                                                )}
                                                {status === 'scheduled' && (
                                                    <Button
                                                        className="w-full text-[10px] h-7 bg-[#ffdb00] text-black font-bold"
                                                        size="sm"
                                                        onClick={() => onUpdateStatus(request.id, 'in-build')}
                                                    >
                                                        <Play className="mr-1 h-3 w-3" /> Build
                                                    </Button>
                                                )}
                                                {status === 'in-build' && (
                                                    <Button
                                                        className="w-full text-[10px] h-7 bg-green-600"
                                                        size="sm"
                                                        onClick={() => onUpdateStatus(request.id, 'ready-for-pickup')}
                                                    >
                                                        Done
                                                    </Button>
                                                )}

                                                {(status === 'pending' || status === 'scheduled') && (
                                                    <Button
                                                        variant="outline"
                                                        className={`h-7 px-2 ${request.missingStock ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                                                        size="sm"
                                                        onClick={() => onToggleFlag(request.id, 'missingStock')}
                                                    >
                                                        <AlertTriangle className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {role === 'requester' && status === 'ready-for-pickup' && (
                                            <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-200">
                                                Ready for Pickup
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {columnRequests.length === 0 && (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground/30 italic text-sm py-8">
                                    No requests
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
