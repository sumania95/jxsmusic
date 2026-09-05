import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const ua = userAgent.toLowerCase();

  const isBot =
    ua.includes("facebookexternalhit") ||
    ua.includes("facebot") ||
    ua.includes("twitterbot") ||
    ua.includes("slackbot") ||
    ua.includes("linkedinbot") ||
    ua.includes("discordbot");

  // Allow social crawlers for previews
  if (isBot) {
    return NextResponse.next();
  }

  const isMaintenance = process.env.MAINTENANCE === "true";

  if (!isMaintenance) {
    return NextResponse.next();
  }

  const year = new Date().getFullYear();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>JEFF92 & AYAN SUMANIA | Maintenance Mode</title>

  <meta
    name="description"
    content="JEFF92 & AYAN SUMANIA is currently under maintenance. We will be back shortly."
  />

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      min-height: 100%;
    }

    body {
      min-height: 100vh;

      display: flex;
      align-items: center;
      justify-content: center;

      padding: 24px;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif;

      background:
        radial-gradient(
          circle at 70% -10%,
          rgba(250, 204, 21, 0.06),
          transparent 35%
        ),
        radial-gradient(
          circle at 10% 100%,
          rgba(250, 204, 21, 0.025),
          transparent 30%
        ),
        #000000;

      color: #e4e4e7;

      overflow: hidden;
    }

    /* =========================================
       AMBIENT GLOW
    ========================================= */

    body::before {
      content: "";

      position: fixed;

      width: 500px;
      height: 500px;

      right: -180px;
      top: -220px;

      border-radius: 9999px;

      background: rgba(250, 204, 21, 0.035);

      filter: blur(100px);

      pointer-events: none;
    }

    /* =========================================
       CONTAINER
    ========================================= */

    .container {
      position: relative;

      width: 100%;
      max-width: 520px;

      padding: 48px 40px;

      border-radius: 28px;

      background: rgba(255, 255, 255, 0.02);

      border: 1px solid rgba(255, 255, 255, 0.10);

      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.025);

      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);

      text-align: center;

      overflow: hidden;
    }

    .container::before {
      content: "";

      position: absolute;

      width: 300px;
      height: 300px;

      top: -200px;
      right: -100px;

      border-radius: 9999px;

      background: rgba(250, 204, 21, 0.045);

      filter: blur(80px);

      pointer-events: none;
    }

    /* =========================================
       LIBRARY LABEL
    ========================================= */

    .eyebrow {
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 8px;

      margin-bottom: 22px;

      font-size: 10px;
      font-weight: 600;

      text-transform: uppercase;

      letter-spacing: 0.2em;

      color: #52525b;
    }

    .dot {
      width: 6px;
      height: 6px;

      border-radius: 9999px;

      background: #B9FF00;

      box-shadow:
        0 0 10px rgba(250, 204, 21, 0.7);
    }

    /* =========================================
       BRAND
    ========================================= */

    .brand {
      position: relative;

      margin-bottom: 16px;

      font-size: 34px;
      font-weight: 800;

      letter-spacing: 0.08em;

      color: #ffffff;
    }

    /* =========================================
       TITLE
    ========================================= */

    h1 {
      position: relative;

      margin: 0 0 14px;

      font-size: 24px;
      font-weight: 600;

      line-height: 1.35;

      letter-spacing: -0.02em;

      color: #f4f4f5;
    }

    /* =========================================
       DESCRIPTION
    ========================================= */

    p {
      position: relative;

      max-width: 390px;

      margin: 0 auto;

      font-size: 13px;

      line-height: 1.7;

      color: #71717a;
    }

    /* =========================================
       DIVIDER
    ========================================= */

    .divider {
      position: relative;

      width: 100%;
      height: 1px;

      margin: 28px 0;

      background: rgba(255, 255, 255, 0.06);
    }

    /* =========================================
       STATUS
    ========================================= */

    .status {
      position: relative;

      display: inline-flex;

      align-items: center;
      justify-content: center;

      gap: 8px;

      padding: 10px 16px;

      border-radius: 12px;

      border: 1px solid rgba(250, 204, 21, 0.12);

      background: rgba(250, 204, 21, 0.04);

      color: #B9FF00;

      font-size: 10px;
      font-weight: 600;

      text-transform: uppercase;

      letter-spacing: 0.1em;
    }

    .status-dot {
      width: 6px;
      height: 6px;

      border-radius: 9999px;

      background: #B9FF00;

      box-shadow:
        0 0 8px rgba(250, 204, 21, 0.6);

      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.35;
      }
    }

    /* =========================================
       FOOTER
    ========================================= */

    footer {
      position: relative;

      margin-top: 28px;

      font-size: 10px;

      letter-spacing: 0.04em;

      color: #3f3f46;
    }

    /* =========================================
       RESPONSIVE
    ========================================= */

    @media (max-width: 600px) {
      body {
        padding: 16px;
      }

      .container {
        padding: 40px 24px;

        border-radius: 24px;
      }

      .brand {
        font-size: 28px;
      }

      h1 {
        font-size: 21px;
      }

      p {
        font-size: 12px;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="eyebrow">
      <span class="dot"></span>
      <span>Jeff92 & Ayan Sumania Service</span>
    </div>

    <div class="brand">
      JEFF92 & AYAN SUMANIA
    </div>

    <h1>
      We're Currently Under Maintenance
    </h1>

    <p>
      We're making improvements to provide a better experience.
      Please check back again shortly.
    </p>

    <div class="divider"></div>

    <div class="status">
      <span class="status-dot"></span>
      Service Temporarily Unavailable
    </div>

    <footer>
      © ${year} JEFF92 & AYAN SUMANIA. All rights reserved.
    </footer>

  </div>

</body>
</html>
`;

  return new NextResponse(html, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
    },
  });
}

export const config = {
  matcher: '/:path*',
};
