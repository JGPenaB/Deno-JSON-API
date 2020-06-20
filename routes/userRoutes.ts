import { Router } from "https://deno.land/x/oak@v5.2.0/mod.ts";

const userRoutes = new Router();

userRoutes

.get("/users", (ctx) => {
    console.log("user get");
});

export default userRoutes;