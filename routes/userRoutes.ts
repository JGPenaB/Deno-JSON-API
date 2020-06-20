import { Router } from "../dependencies.ts";

const userRoutes = new Router();

userRoutes

.get("/users", (ctx) => {
    console.log("user get");
});

export default userRoutes;