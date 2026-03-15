import * as userController from "../controller/user";
const router = createRouter();

router.post("/users", defineEventHandler(userController.create));
router.post("/login", defineEventHandler(userController.login));
router.delete("/logout", defineEventHandler(userController.logout));

router.get("/user", defineEventHandler(userController.fetchUser));

export default useBase("/api/v1", router.handler);
