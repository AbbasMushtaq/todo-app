import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

interface Task {
    id: string;
    status: string;
    deadline: Date;
    userId: string;
    order: number;
}

// GET /api/tasks
export async function GET(request: Request) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch tasks
        let tasks = await prisma.task.findMany({
            where: { userId: user.userId },
            orderBy: { deadline: "asc" },
        }) as unknown as Task[];

        // 3. Auto Missed Logic: 
        // If current date and time is greater than deadline AND status is PENDING
        const now = new Date();
        const pendingTasks = tasks.filter((task: Task) => task.status.toLowerCase() === "pending");
        const missedTaskIds = pendingTasks
            .filter((task: Task) => new Date(task.deadline) < now)
            .map((task: Task) => task.id);

        if (missedTaskIds.length > 0) {
            await prisma.task.updateMany({
                where: {
                    id: { in: missedTaskIds },
                },
                data: { status: "MISSED" },
            });

            // Re-fetch to get updated statuses
            tasks = await prisma.task.findMany({
                where: { userId: user.userId },
                orderBy: { deadline: "asc" },
            }) as unknown as Task[];
        }

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GET tasks error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/tasks
export async function POST(request: Request) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, deadline, category, priority } = await request.json();

        if (!title || !deadline || !category || !priority) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get highest order to assign next
        const lastTask = await prisma.task.findFirst({
            where: { userId: user.userId },
            orderBy: { order: "desc" },
        });

        const nextOrder = lastTask ? lastTask.order + 1 : 0;

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                deadline: new Date(deadline), // Parses "2026-02-25T18:30:00" correctly
                category,
                priority: priority.toUpperCase(), // Ensure matches Enum case
                status: "PENDING",
                order: nextOrder,
                userId: user.userId,
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("POST task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/tasks (Used for bulk updates like reordering)
export async function PUT(request: Request) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { tasks } = await request.json();

        if (!Array.isArray(tasks)) {
            return NextResponse.json({ error: "Invalid tasks data" }, { status: 400 });
        }

        // Use transaction to update orders
        const updates = tasks.map((task: any) =>
            prisma.task.update({
                where: { id: task.id, userId: user.userId },
                data: { order: task.order },
            })
        );

        await prisma.$transaction(updates);

        return NextResponse.json({ message: "Tasks reordered successfully" });
    } catch (error) {
        console.error("PUT tasks error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
