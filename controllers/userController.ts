import {getUsers} from "../services/userService.ts";

async function userList(context: any){

    const list = await getUsers();
    context.response.body = list;
};

export { userList };