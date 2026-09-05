import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import NextNProgress from "nextjs-progressbar";
import { api } from "@/utils/api";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "sonner";
import MediaPlayerComponent from "@/components/player/player";
import { useAtom } from "jotai";
import { playerState } from "@/state/globalState";
import ChangePasswordFormComponent from "@/components/common/helper/form-change-password";
import CartHydrator from "@/components/common/hydrate-cart";
import { UserRoleHydrator } from "@/components/common/hydrate-role";
import GenreHydrator from "@/components/common/hydrate-genre";
import TagHydrator from "@/components/common/hydrate-tag";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [state] = useAtom(playerState);
  return (
    <SessionProvider session={session}>
      <GenreHydrator />
      <TagHydrator />
      <CartHydrator />
      <UserRoleHydrator />
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div>
            <NextNProgress
              color="#B9FF00"
              options={{ showSpinner: false }}
              startPosition={0.3}
              stopDelayMs={200}
              height={2}
              showOnShallow={true}
            />
            <Component {...pageProps} className={inter.className} />
            {state.id && <MediaPlayerComponent />}
          </div>
          <ChangePasswordFormComponent />
        </ThemeProvider>
        <Toaster expand={true} />
      </NuqsAdapter>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
