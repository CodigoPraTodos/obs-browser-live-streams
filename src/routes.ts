import { Router } from "express";

const router: Router = Router();

router.get("/message", (_req, res) => {
    res.send("hello world!");
});

export default router;
