'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PackageSearch, Calendar, CheckCircle2, Info, AlertCircle, Clipboard, Box, Search, Folder } from 'lucide-react';
import { fetchItemDetails } from '@/lib/mockData';
import { Item, BuildRequest, RequesterRole, SizeCategory, PickupMethod } from '@/lib/types';
import { toast } from 'sonner';

interface RequestFormProps {
    onSubmit: (request: Omit<BuildRequest, 'id' | 'status'>) => void;
}

export function RequestForm({ onSubmit }: RequestFormProps) {
    const [articleNumber, setArticleNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [projectName, setProjectName] = useState('');
    const [role, setRole] = useState<RequesterRole>('Sales');
    const [size, setSize] = useState<SizeCategory>('Medium');
    const [method, setMethod] = useState<PickupMethod>('SS');
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<Item | null>(null);

    const handleLookup = async () => {
        if (!articleNumber) return;
        setLoading(true);
        const result = await fetchItemDetails(articleNumber);
        setItem(result);
        setLoading(false);
        if (!result) {
            toast.error('Article Number not found in system.');
        }
    };

    const handlePickupMethodChange = (v: PickupMethod) => {
        setMethod(v);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !dueDate || !projectName) {
            toast.error('Please complete all fields.');
            return;
        }

        onSubmit({
            articleNumber: item.articleNumber,
            itemName: item.name,
            warehouseLocation: item.warehouseLocation,
            stockStatus: item.stockStatus,
            projectDueDate: dueDate,
            projectName,
            requesterRole: role,
            sizeCategory: size,
            pickupMethod: method,
        });

        setArticleNumber('');
        setDueDate('');
        setProjectName('');
        setItem(null);
        toast.success('Build request submitted successfully!');
    };

    return (
        <Card className="w-full">
            <CardHeader className="bg-slate-50">
                <CardTitle className="text-xl leading-tight">New Build Request</CardTitle>
                <CardDescription>Submit an article for recovery processing</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Article Number & Name */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="articleNumber" className="text-sm font-bold flex items-center">
                                    <Clipboard className="mr-2 h-4 w-4 text-blue-600" />
                                    Article Number
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="articleNumber"
                                        placeholder="000.000.00"
                                        value={articleNumber}
                                        onChange={(e) => setArticleNumber(e.target.value)}
                                        className="font-mono h-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleLookup}
                                        className="bg-slate-50 shrink-0 h-10"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        <span className="hidden sm:inline ml-2">Lookup</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center">
                                    <Box className="mr-2 h-4 w-4 text-blue-600" />
                                    Item Name
                                </Label>
                                <div className="p-3 bg-slate-50 border rounded-md min-h-12 text-sm flex items-center">
                                    {item ? (
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                    ) : (
                                        <span className="text-muted-foreground italic">Item details will appear after lookup</span>
                                    )}
                                </div>
                            </div>

                            {item && (
                                <div className="rounded-lg border bg-blue-50/50 p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-blue-900 truncate max-w-[150px] sm:max-w-none">{item.warehouseLocation}</h4>
                                            <p className="text-xs text-blue-700">Storage Location</p>
                                        </div>
                                        <Badge variant={item.stockStatus === 'In Stock' ? 'default' : item.stockStatus === 'Low Stock' ? 'outline' : 'destructive'} className="whitespace-nowrap">
                                            {item.stockStatus}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Roles & Logistics */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Requester Role</Label>
                                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                                        <SelectTrigger className="w-full bg-white h-10">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-lg">
                                            <SelectItem value="VM">VM (Visual Merch)</SelectItem>
                                            <SelectItem value="ID">ID (Interior Design)</SelectItem>
                                            <SelectItem value="Sales">Sales / Co-worker</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Size Category</Label>
                                    <Select value={size} onValueChange={(value: any) => setSize(value)}>
                                        <SelectTrigger className="w-full bg-white h-10">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-lg">
                                            <SelectItem value="Small">Small (Parcel)</SelectItem>
                                            <SelectItem value="Medium">Medium (Flat Pack)</SelectItem>
                                            <SelectItem value="Large/Heavy">Large / Heavy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold">Pickup Method</Label>
                                    <Select value={method} onValueChange={(value: any) => handlePickupMethodChange(value)}>
                                        <SelectTrigger className="w-full bg-white h-10">
                                            <SelectValue placeholder="Select method" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white shadow-lg">
                                            <SelectItem value="SS">SS (Self Serve)</SelectItem>
                                            <SelectItem value="FS">FS (Full Serve)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="projectName" className="text-sm font-bold flex items-center">
                                        <Folder className="mr-2 h-4 w-4 text-blue-600" />
                                        Project Name
                                    </Label>
                                    <Input
                                        id="projectName"
                                        placeholder="e.g. Living Room Refresh"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="projectDueDate" className="text-sm font-bold flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                                Project Due Date
                            </Label>
                            <Input
                                id="projectDueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto bg-[#0058a3] hover:bg-[#0058a3]/90 text-[#ffdb00] font-bold h-10 px-8 transition-all"
                                disabled={!item || !dueDate || !projectName}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Submit Request
                            </Button>
                        </div>
                    </div>

                    {method === 'FS' && (
                        <Alert className="bg-amber-50 border-amber-200 text-amber-900 border-2 mt-4">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="font-bold">Green Sheet Required</AlertTitle>
                            <AlertDescription className="text-xs">
                                FS items require a Green Sheet. This process can take several hours or days depending on warehouse capacity.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </form>
        </Card>
    );
}
