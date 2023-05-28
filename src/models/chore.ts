export interface Chore {
    id: number;
    name: string;
    description: string;
    frequency: number; // in days
    lastAssigned: Date;
    defaultAssignedTo: any;
}