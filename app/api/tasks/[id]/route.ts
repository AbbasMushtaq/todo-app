import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// PATCH or PUT /api/tasks/[id]
async function updateTask(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const updates = await request.json();

        // Ensure task belongs to user
        const task = await prisma.task.findFirst({
            where: { id, userId: user.userId },
        });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                ...updates,
                deadline: updates.deadline ? new Date(updates.deadline) : undefined,
                priority: updates.priority ? updates.priority.toUpperCase() : undefined,
                status: updates.status ? updates.status.toUpperCase() : undefined,
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Update task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export { updateTask as PATCH, updateTask as PUT };

// DELETE /api/tasks/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Ensure task belongs to user
        const task = await prisma.task.findFirst({
            where: { id, userId: user.userId },
        });

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("DELETE task error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
