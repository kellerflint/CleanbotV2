import { Task } from "../models/task";
const fs = require("fs");

export class TaskService {
    tasksDataPath = "src/data/tasksData.json";

    createTask(content: string, assignedTo: any): number {
        const task: Task = {
            id: this.findNextId(),
            content: content,
            assignedTo: assignedTo
        };

        this.saveTask(task);

        return task.id;
    }

    removeTask(id: number): boolean {
        const tasks = this.readTasks();

        const filteredTasks = tasks.filter((t: Task) => t.id !== id);

        if (filteredTasks.length === tasks.length) return false;

        this.writeTasks(filteredTasks);

        return true;
    }

    saveTask(task: Task): void {
        let tasks = this.readTasks();

        tasks.push(task);

        this.writeTasks(tasks);
    }

    writeTasks(tasks: Task[]): void {
        fs.writeFile(this.tasksDataPath, JSON.stringify(tasks), (err: any) => {
            if (err) throw err;
            console.log("Done writing!");
        });
    }

    readTasks(): Task[] {
        let tasks: Task[] = [];

        try {
            const data = fs.readFileSync(this.tasksDataPath, 'utf-8');
            tasks = JSON.parse(data);
        } catch (err) {
            console.error(err);
        }

        return tasks;
    }

    listTasks(): string {
        const tasks = this.readTasks();
        let message = "All Tasks: \n";
        tasks.forEach((t: Task) => {
            message += `Task ${t.id}: ${t.content}\n`;
        });
        return message;
    }

    findNextId(): number {
        const tasks = this.readTasks();
        if (tasks.length === 0) return 1;

        const idSet = new Set<number>(tasks.map(t => t.id));

        let i = 1;
        while (idSet.has(i)) {
            i++;
        }
        return i;
    }
}