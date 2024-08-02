import { Router } from "express";

const googleCalendarRoutes = Router();

import { AddCalendarController } from "../controllers/AddCalendarController";
import { AddCalendarCallbackController } from "../controllers/AddCalendarCallbackController";

const addCalendarController = new AddCalendarController();
const addCalendarCallbackController = new AddCalendarCallbackController();

googleCalendarRoutes.get(
  "/add-to-google-calendar",
  addCalendarController.handle
);
googleCalendarRoutes.get(
  "/add-to-google-calendar-callback",
  addCalendarCallbackController.handle
);

export default googleCalendarRoutes;
