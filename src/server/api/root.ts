import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { signedUrlRouter } from "./routers/signedUrl";
import { trackRouter } from "./routers/tracks";
import { genreRouter } from "./routers/genre";
import { cartRouter } from "./routers/cart";
import { paypalRouter } from "./routers/paypal";
import { forgotPasswordRouter } from "./routers/forgot-password";
import { editorRouter } from "./routers/editors";
import { orderRouter } from "./routers/order";
import { tagRouter } from "./routers/tags";
import { imageRouter } from "./routers/images";
import { spotifyRouter } from "./routers/spotify";
import { webhookRouter } from "./routers/webhook-log";
import { salesRouter } from "./routers/sales";
import { couponRouter } from "./routers/coupon";
import { trackRelatedRouter } from "./routers/tracks-related";
import { dmcaRouter } from "./routers/dmca";
import { contactRouter } from "./routers/contact";
import { albumRouter } from "./routers/album";
import { adminTrackRouter } from "./routers/tracks-admin";
import { chartRouter } from "./routers/chart";
import { downloadsRouter } from "./routers/downloads";
import { accountingRouter } from "./routers/accounting";
import { creditsRouter } from "./routers/credits";
import { reviewsRouter } from "./routers/reviews";
import { bookingsRouter } from "./routers/bookings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  image: imageRouter,
  signedUrl: signedUrlRouter,
  track: trackRouter,
  genre: genreRouter,
  cart: cartRouter,
  paypal: paypalRouter,
  editor: editorRouter,
  forgotPassword: forgotPasswordRouter,
  order: orderRouter,
  tag: tagRouter,
  spotify: spotifyRouter,
  webhook: webhookRouter,
  sales: salesRouter,
  coupon: couponRouter,
  trackRelated: trackRelatedRouter,
  dmca: dmcaRouter,
  contact: contactRouter,
  album: albumRouter,
  adminTrack: adminTrackRouter,
  chart: chartRouter,
  downloads: downloadsRouter,
  accounting: accountingRouter,
  credits: creditsRouter,
  reviews: reviewsRouter,
  bookings: bookingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
