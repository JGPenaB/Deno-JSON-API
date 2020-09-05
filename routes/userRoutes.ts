import { Router } from "../dependencies.ts";
import { userList, userByID, newUser, deleteUser, editUser } from "../controllers/userController.ts";

const userRoutes = new Router();

userRoutes
.get("/users", userList)
.get("/users/:id",userByID)
.post("/users", newUser)
.put("/users/:id", editUser)
.delete("/users/:id", deleteUser);

export default userRoutes;