export const formatMessage = (username: string, text: string) => {
    return {
        username,
        text,
        time: Date.now()
    }
}

let chats: any;
const getAllChats = chats.find().limit(100).sort({_id:1}).toArray((err: any, res: any) => {
    if(err) {
        throw err;
    }


})