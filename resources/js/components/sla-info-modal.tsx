import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Sla {
    id: number;
    priority: string;
    response_time_minutes: number;
    resolution_time_minutes: number;
}

interface Props {
    slas: Sla[];
}

export function SlaInfoModal({ slas }: Props) {
    const formatTime = (minutes: number) => {
        if (minutes >= 1440) {
            const days = minutes / 1440;
            return `${days} Hari`;
        }
        if (minutes >= 60) {
            const hours = minutes / 60;
            return `${hours} Jam`;
        }
        return `${minutes} Menit`;
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'low': return 'Rendah';
            case 'medium': return 'Sedang';
            case 'high': return 'Tinggi';
            default: return priority;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                    <Info className="mr-2 h-4 w-4 text-blue-600" />
                    Waktu Ideal (SLA)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Standar Waktu Layanan (SLA)
                    </DialogTitle>
                    <DialogDescription>
                        Target waktu respon dan penyelesaian berdasarkan prioritas tiket.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="relative overflow-x-auto rounded-lg border border-blue-100 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50 text-blue-900 border-b border-blue-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Prioritas</th>
                                    <th className="px-4 py-3 font-semibold text-center">Respon</th>
                                    <th className="px-4 py-3 font-semibold text-center">Penyelesaian</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {slas.map((sla) => (
                                    <tr key={sla.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">
                                            <Badge className={getPriorityColor(sla.priority)}>
                                                {getPriorityText(sla.priority)}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-center text-blue-700">
                                            {formatTime(sla.response_time_minutes)}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-indigo-700">
                                            {formatTime(sla.resolution_time_minutes)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground text-center italic">
                        * Waktu penyelesaian dihitung sejak tiket dibuat.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
