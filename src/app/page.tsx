'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { RequestForm } from '@/components/request-form';
import { KanbanBoard } from '@/components/kanban-board';
import { SpaceIndicator } from '@/components/space-indicator';
import { BuildRequest, RequestStatus } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LayoutDashboard, ListPlus, Hammer } from 'lucide-react';

export default function Home() {
  const [role, setRole] = useState<'builder' | 'requester'>('requester');
  const [requests, setRequests] = useState<BuildRequest[]>([]);
  const CAPACITIES = 10;

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('recovery_requests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recovery_requests', JSON.stringify(requests));
  }, [requests]);

  const handleAddRequest = (newRequest: Omit<BuildRequest, 'id' | 'status'>) => {
    const request: BuildRequest = {
      ...newRequest,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
    };
    setRequests([...requests, request]);
  };

  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleToggleFlag = (id: string, flag: 'missingStock' | 'lateDelivery') => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, [flag]: !r[flag] } : r))
    );
  };

  // Priority Logic: VM (0) > ID (1) > Sales (2)
  const sortedRequests = [...requests].sort((a, b) => {
    const priorityMap = { VM: 0, ID: 1, Sales: 2 };
    const aPriority = priorityMap[a.requesterRole] ?? 3;
    const bPriority = priorityMap[b.requesterRole] ?? 3;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Fallback to due date
    return new Date(a.projectDueDate).getTime() - new Date(b.projectDueDate).getTime();
  });

  const finishedCount = requests.filter((r) => r.status === 'ready-for-pickup').length;

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <Navbar role={role} onRoleChange={setRole} requestsCount={requests.length} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Build Request Dashboard</h2>
            <p className="text-muted-foreground">
              {role === 'builder'
                ? 'Manage builds and logistics capacity.'
                : 'Track your recovery requests and item status.'}
            </p>
          </div>
          <div className="w-full md:w-64">
            <SpaceIndicator finishedCount={finishedCount} capacity={CAPACITIES} />
          </div>
        </div>

        {role === 'requester' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RequestForm onSubmit={handleAddRequest} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-none shadow-none bg-transparent">
                <header className="flex items-center gap-2 mb-4">
                  <ListPlus className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold">My Active Requests</h3>
                </header>
                <KanbanBoard
                  requests={sortedRequests}
                  role={role}
                  onUpdateStatus={handleUpdateStatus}
                  onToggleFlag={handleToggleFlag}
                />
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="board" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-slate-200">
                  <TabsTrigger value="board" className="data-[state=active]:bg-white">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Build Queue
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="data-[state=active]:bg-white">
                    <Hammer className="h-4 w-4 mr-2" />
                    Inventory Matrix
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="board" className="mt-0 space-y-4">
                <KanbanBoard
                  requests={sortedRequests}
                  role={role}
                  onUpdateStatus={handleUpdateStatus}
                  onToggleFlag={handleToggleFlag}
                />
              </TabsContent>
              <TabsContent value="requests">
                <Card>
                  <CardHeader>
                    <CardTitle>In-Store Recovery Matrix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border p-8 text-center text-muted-foreground italic">
                      Real-time inventory data visualization coming soon (Integration phase 2).
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
