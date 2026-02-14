'use client';

import { Hammer, Truck, Info, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
    role: 'builder' | 'requester';
    onRoleChange: (role: 'builder' | 'requester') => void;
    requestsCount?: number;
}

export function Navbar({ role, onRoleChange, requestsCount = 0 }: NavbarProps) {
    return (
        <nav className="border-b bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex flex-wrap h-auto min-h-16 items-center justify-between px-4 py-2 gap-y-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0058a3] font-bold text-[#ffdb00]">
                        IK
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg font-bold leading-none tracking-tight truncate">Build Request Manager</h1>
                        <p className="text-[10px] sm:text-xs text-muted-foreground italic truncate">Build Recovery & Logistics</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                        <Button
                            variant={role === 'requester' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => onRoleChange('requester')}
                            className={cn(
                                "h-8 px-2 sm:px-3 text-xs sm:text-sm",
                                role === 'requester' ? 'bg-[#ffdb00] hover:bg-[#ffdb00]/90 text-black shadow-sm' : 'text-slate-600'
                            )}
                        >
                            <User className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                            Requester
                        </Button>
                        <Button
                            variant={role === 'builder' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => onRoleChange('builder')}
                            className={cn(
                                "h-8 px-2 sm:px-3 text-xs sm:text-sm",
                                role === 'builder' ? 'bg-[#0058a3] hover:bg-[#0058a3]/90 text-white shadow-sm' : 'text-slate-600'
                            )}
                        >
                            <Hammer className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                            Builder
                        </Button>
                    </div>

                    <div className="hidden sm:flex h-8 w-px bg-slate-200" />

                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
