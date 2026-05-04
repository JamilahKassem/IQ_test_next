'use server';
import {prisma} from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function loginUser(userData: { userId: number, password: string, isAdmin: boolean }) {
    // 1. Find the user by ID
    let user;
    const condition = {
        where :{
            id: userData.userId
        },
    };
    if(userData.isAdmin){
        user = await prisma.admin.findUnique(condition);
    }else{
        user = await prisma.user.findUnique(condition);
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
export async function addResult(question_id: number, user_id: number, answer: number, debug: boolean = false) {
    try {
        if(debug){
            console.log("addResult",question_id,user_id,answer);
        }
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
export async function getAnswer(question_id: number, user_id: number, debug: boolean = false) {
    try {
        if(debug){
            console.log("get Question",question_id,user_id);
        }
        return await prisma.result.findFirst({
            where: {
                question_id: question_id,
                user_id: user_id,
            },
            select: {
                answer: true,
            },
        });
    } catch (error) {
        console.error("Error creating result:", error);
        throw error;
    }
}
export async function getNextQuestion(question_id: number, debug: boolean = false) {
    try {
        if(debug){
            console.log("get Next Question",question_id);
        }
        return await prisma.question.findFirst({
            where: {
                id: {
                    gt: question_id,
                },
                active: 1
            },
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                image: true,
                time: true,
                number_answers: true
            },
        })
    } catch (error) {
        console.error("Error creating result:", error);
        throw error;
    }
}