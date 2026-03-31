import { apiBase, ROUTES } from "~/utils/constants";
import * as userController from "../controller/user";
import * as produtosController from "../controller/produto";
const router = createRouter();

router.post(ROUTES.url.users, defineEventHandler(userController.create));
router.post(ROUTES.url.login, defineEventHandler(userController.login));
router.delete(ROUTES.url.logout, defineEventHandler(userController.logout));

router.get(ROUTES.url.user, defineEventHandler(userController.fetchUser));

router.get(ROUTES.url.apiFDBStatus, defineEventHandler(produtosController.apiStatus));
router.patch(ROUTES.url.produtos, defineEventHandler(produtosController.update));

router.post(ROUTES.url.produtos, defineEventHandler(produtosController.create));

export default useBase(apiBase, router.handler);
