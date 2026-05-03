import {getNextQuestion} from "./prisma";

interface AdminProps {
    question_id: number;
    debug?: boolean;
}
function NextQuestion({ question_id,debug = false }: AdminProps) {
    const fetchData = async () => {
        try {
            await getNextQuestion(question_id,debug);
        } catch (err) {}
    };
    fetchData().then(() => {
        if (debug) {console.log("fetching done")}
    });
}

export default NextQuestion
