import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProjectData } from '@/types';
import { Folder } from 'lucide-react';

interface ProjectSelectorProps {
    projects: ProjectData[];
    selectedProjectId: number | null;
    onProjectChange: (projectId: number) => void;
    className?: string;
}

export function ProjectSelector({
    projects,
    selectedProjectId,
    onProjectChange,
    className,
}: ProjectSelectorProps) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <Select
            value={selectedProjectId?.toString() || ''}
            onValueChange={(val) => onProjectChange(Number(val))}
        >
            <SelectTrigger className={className || 'w-[250px]'}>
                <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a project" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: project.color }}
                            />
                            <span>{project.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
