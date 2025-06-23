// routes/index.mjs

import express from "express";
import authRoute from "./auth.route";
import userRoutes from "./user.route";
// import Emailroutes from './email.route';
import matchRoutes from "./match.route";
import notificationRoutes from "./notification.route";
import reviewRoutes from "./review.route";
import config from "../config/env.config";
import uploadRoutes from "./itemupload.route";

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
		route: uploadRoutes,
	},
	// {
	//   path: '/items',
	//   route: Itemsroutes,
	// },
	// {
	//   path: '/emails',
	//   route: Emailroutes,
	// },
	{
		path: "/match",
		route: matchRoutes,
	},

	{
		path: "/review",
		route: reviewRoutes,
	},
	// {
	//   path: '/faqs',
	//   route: FAQRoutes,
	// },
	// {
	//   path: '/history',
	//   route: historyRoutes,
];

const devRoutes: { path: string; route: express.Router }[] = [
	// routes available only in development mode
	// Uncomment the following line if you have docsRoute imported
	// { path: '/docs', route: docsRoute },
];
//     route: docsRoute,
//   },
// ];
defaultRoutes.forEach(
	({ path, route }: { path: string; route: express.Router }) => {
		Routes.use(path, route);
	}
);
if (config.env === "development") {
	devRoutes.forEach(
		({ path, route }: { path: string; route: express.Router }) => {
			Routes.use(path, route);
		}
	);
}

export default Routes;
