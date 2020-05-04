import { Router } from "express";

const router: Router = Router();

router.get("/info", (_req, res) => {
    res.json({ info: "https://github.com/CodigoPraTodos/obs-browser-live-streams" });
});

export default router;
