export interface Chore {
    id: number;
    name: string;
    description: string;
    frequency: string;
    lastAssigned: Date;
    defaultAssignedTo: object;
}