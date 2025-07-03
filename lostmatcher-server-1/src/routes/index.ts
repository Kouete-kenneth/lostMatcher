// routes/index.mjs

import express from "express";
import authRoute from "./auth.route";
import userRoutes from "./user.route";
import matchRoutes from "./match.route";
import notificationRoutes from "./notification.route";
import reviewRoutes from "./review.route";
import config from "../config/env.config";
import uploadRoutes from "./itemupload.route";
import itemsRoutes from "./items.route";
import foundReportRoutes from "./foundReport.route";
import lostReportRoutes from "./lostReport.route";
import matchRecordsRoutes from "./matchRecords.route";
import manualMatchingRoutes from "./manualMatching.route";
import matchingRoutes from "./matching.route"; // Added missing matching routes
import testRoutes from "./test.route";
import periodicSearchRoutes from "./periodicSearch.route";

const Routes = express.Router();

const defaultRoutes = [
	{
		path: "/auth",
		route: authRoute,
	},
	{
		path: "/users",
		route: userRoutes,
	},
	{
		path: "/notification",
		route: notificationRoutes,
	},
	{
		path: "/items",
		route: itemsRoutes,
	},
	{
		path: "/found",
		route: foundReportRoutes,
	},
	{
		path: "/lost",
		route: lostReportRoutes,
	},
	{
		path: "/itemupload",
		route: uploadRoutes,
	},
	{
		path: "/match",
		route: matchRoutes,
	},
	{
		path: "/match-records",
		route: matchRecordsRoutes,
	},
	{
		path: "/matching",
		route: matchingRoutes,
	},
	{
		path: "/manual-matching",
		route: manualMatchingRoutes,
	},
	{
		path: "/periodic-search",
		route: periodicSearchRoutes,
	},
	{
		path: "/review",
		route: reviewRoutes,
	},
];

const devRoutes: { path: string; route: express.Router }[] = [
	// routes available only in development mode
	{
		path: "/test",
		route: testRoutes,
	},
];

// Register all default routes
for (const route of defaultRoutes) {
	Routes.use(route.path, route.route);
}

// Register dev routes only in development
if (config.env === "development") {
	for (const route of devRoutes) {
		Routes.use(route.path, route.route);
	}
}

export default Routes;
