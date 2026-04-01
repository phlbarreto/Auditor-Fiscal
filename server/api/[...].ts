import { apiBase, ROUTES } from "~/utils/constants";
import * as userController from "../controller/user";
const router = createRouter();

router.post(ROUTES.url.users, defineEventHandler(userController.create));
router.post(ROUTES.url.login, defineEventHandler(userController.login));
router.delete(ROUTES.url.logout, defineEventHandler(userController.logout));

router.get(ROUTES.url.user, defineEventHandler(userController.fetchUser));

export default useBase(apiBase, router.handler);
