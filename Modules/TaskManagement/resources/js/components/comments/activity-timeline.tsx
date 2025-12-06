import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import {
    Activity,
    PlusCircle,
    ArrowRight,
    CheckCircle,
    Circle,
    UserPlus,
    UserMinus,
    Edit,
    Trash,
    MessageSquare,
    Paperclip,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
    'plus-circle': PlusCircle,
    'arrow-right': ArrowRight,
    'check-circle': CheckCircle,
    'circle': Circle,
    'user-plus': UserPlus,
    'user-minus': UserMinus,
    'edit': Edit,
    'trash': Trash,
    'message-square': MessageSquare,
    'paperclip': Paperclip,
    'activity': Activity,
};

interface ActivityItem {
    id: number;
    description: string;
    icon: string;
    color: string;
    causer: string;
    created_at: string;
}

export function ActivityTimeline() {
    const { activities } = usePage<SharedData & { activities?: ActivityItem[] }>().props;

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity) => {
                const IconComponent = iconMap[activity.icon] || Activity;

                return (
                    <div key={activity.id} className="flex gap-3">
                        <div className={`p-2 rounded-full flex-shrink-0 ${activity.color}`}>
                            <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm leading-none mb-1">
                                <span className="font-medium">{activity.causer}</span>
                                <span className="text-muted-foreground ml-1">{activity.description}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
