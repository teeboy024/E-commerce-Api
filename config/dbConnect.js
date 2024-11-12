import moongose from "mongoose";

const dbConnect =  async () => {
    try {
        moongose.set("strictQuery", false)
        const connected = await moongose.connect (process.env.MONGO_URL);
        console.log(`database connected ${connected.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
};

export default dbConnect