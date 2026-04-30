'use client'

interface AdminProps {
    debug?: boolean;
}
function NextQeustion({ debug = false }: AdminProps) {
    const fetchData = async () => {
        try {
            // await request(`next`,debug);
        } catch (err) {}
    };
    fetchData().then(() => {
        if (debug) {console.log("fetsh done")}
    });
}

export default NextQeustion
