import { Router } from 'express';
import { getReview } from "../controllers/ai.controller";

const router = Router();


router.post("/get-review", getReview)


export default router;    