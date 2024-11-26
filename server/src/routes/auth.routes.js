import Router from "express-promise-router";
import {
  logout,
  refreshToken,
  signin,
  signup,
  profile,
  userList,
  approve,
  createJob,
  listJobs,
  startJob,
  savedrawing,
  listJob,
  closeJob,
  listMetrics
} from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../helpers/jwt_helpers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signupSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/auth/signup", validateSchema(signupSchema), signup);

router.post("/auth/signin", signin);

router.post("/auth/refresh-token", refreshToken);
router.post("/auth/approve", approve);

router.post("/auth/createjob", createJob);
router.post("/auth/startjob", startJob);
router.post("/auth/closeJob", closeJob);
router.post("/auth/savedrawing", savedrawing);

router.get("/auth/listjob", listJobs);
router.get("/auth/listmetric", listMetrics);
router.get("/auth/job/:jobId", listJob);

router.delete("/auth/logout", logout);

router.get("/auth/list", userList);

router.get("/auth/profile", verifyAccessToken, profile);

export default router;
