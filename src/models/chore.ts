export interface Chore {
    id: number;
    name: string;
    description: string;
    frequency: string;
    lastCompleted: Date;
    assignedTo: string;
}