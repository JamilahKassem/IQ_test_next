import {prisma} from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function loginUser(userData: { userId: number, password: string, isAdmin: boolean }) {
    // 1. Find the user by ID
    let user;
    if(userData.isAdmin){
        user = await prisma.admin.findUnique({
            where: {
                id: userData.userId,
            },
        });
    }else{
        user = await prisma.user.findUnique({
            where: {
                id: userData.userId,
            },
        });
    }

    // 2. If user doesn't exist, return early
    if (!user) {
        throw new Error("Invalid ID or password");
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid ID or password");
    }

    // 4. Success! Return the user (excluding the password for safety)
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
export async function addResult(question_id: number, user_id: number, answer: number) {
    try {
        return await prisma.result.create({
            data: {
                question_id: question_id,
                user_id: user_id,
                answer: answer
            }
        });
    } catch (error) {
        console.error("Error creating result:", error);
        throw error;
    }
}