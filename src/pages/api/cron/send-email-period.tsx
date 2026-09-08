// pages/api/cron/send-email-period.tsx

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Resend } from "resend";

import { authorizeCron } from "@/server/email/cron-auth";
import { db } from "@/server/db";
import { Prisma } from "generated/prisma";
import { WeeklyUploadEmail } from "@/components/email/weekly-template";
import { formatTrackTitle } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API);

const USERS_PER_RUN = 20;

export const config = {
  maxDuration: 60,
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!authorizeCron(request, response)) {
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const emailFrom = "store@jxsmusic.com";

  if (!appUrl || !emailFrom) {
    return response.status(500).json({
      error: "Email environment variables are missing",
    });
  }

  try {
    const period = await db.period.findFirst({
      where: {
        active: true,
        identifier:"LATEST_RELEASES"
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!period) {
      return response.status(200).json({
        success: true,
        processed: 0,
        message: "No active email period",
      });
    }

    const users = await db.user.findMany({
      where: {
        is_disabled: false,
        weeklyEmailSubscribed: true,
        is_uploader:true, //make it false for production
        // Keep only if users with bookings must be excluded.
        bookings: {
          none: {},
        },
        email: {
          not: "",
        },
        // User has not been processed for this exact campaign period.
        periodUser: {
          none: {
            periodId: period.id,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      take: USERS_PER_RUN,
    });

    if (users.length === 0) {
      await db.period.update({
        where: {
          id: period.id,
        },
        data: {
          active: false,
        },
      });

      return response.status(200).json({
        success: true,
        periodKey: period.periodKey,
        processed: 0,
        completed: true,
      });
    }

    /*
     * This attached template is designed for LATEST_RELEASES.
     * TOP_DOWNLOADS should use its own email component.
     */
    if (period.identifier !== "LATEST_RELEASES") {
      return response.status(200).json({
        success: true,
        processed: 0,
        skipped: true,
        message: `No sender implemented for ${period.identifier}`,
      });
    }

    const [trackCount, latestTracks] = await Promise.all([
      db.track.count({
        where: {
          releaseAt: {
            gte: period.startAt,
            lt: period.endAt,
          },
        },
      }),

      db.track.findMany({
        where: {
          releaseAt: {
            gte: period.startAt,
            lt: period.endAt,
          },
        },
        orderBy: {
          releaseAt: "desc",
        },
        take: 6,
      }),
    ]);

    const reserved: Array<{
      user: (typeof users)[number];
      periodUserId: string;
    }> = [];

    for (const user of users) {
      try {
        const periodUser = await db.periodUser.create({
          data: {
            periodId: period.id,
            userId: user.id,
            idempotencyKey: [
              "email",
              period.identifier,
              period.cadence,
              period.periodKey,
              user.id,
            ].join(":"),
          },
        });

        reserved.push({
          user,
          periodUserId: periodUser.id,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }

        throw error;
      }
    }

    if (reserved.length === 0) {
      return response.status(200).json({
        success: true,
        processed: 0,
      });
    }

    const { data, error } = await resend.batch.send(
      reserved.map(({ user }) => ({
        from: `JXS Music <${emailFrom}>`,
        to: String(user.email),
        subject: `${trackCount} fresh drops are live on JxSmusic`,
        react: (
          <WeeklyUploadEmail
            customerName={user.name ?? "DJ"}
            trackCount={trackCount}
            latestTracks={latestTracks.map((track) => ({
              id: track.id,
              title: formatTrackTitle(track.title,track.is_explicit),
              artistName: track.artist,
              bpm: track.bpm_start,
              mediaType: track.filetype?.includes("video")?"VIDEO":"AUDIO",
              uploadedAt: track.releaseAt,
              trackUrl: `${appUrl}/tracks/${track.id}`,
            }))}
            dashboardUrl={`${appUrl}/tracks`}
            preferencesUrl={`${appUrl}/settings/notifications`}
          />
        ),
      })),
    );

    if (
  error ||
  !data ||
  data.data.length !== reserved.length
) {
  await db.periodUser.deleteMany({
    where: {
      id: {
        in: reserved.map(
          ({ periodUserId }) => periodUserId,
        ),
      },
      sentAt: null,
    },
  });

  throw new Error(
    error?.message ??
      "Resend returned an incomplete batch response",
  );
}

   const updates = data.data.map(
  (resendResult, index) => {
    const reservation = reserved[index];

    if (!reservation) {
      throw new Error(
        `Missing reservation at index ${index}`,
      );
    }

    return db.periodUser.update({
      where: {
        id: reservation.periodUserId,
      },
      data: {
        resendId: resendResult.id,
        sentAt: new Date(),
      },
    });
  },
);

await db.$transaction(updates);

    return response.status(200).json({
      success: true,
      identifier: period.identifier,
      cadence: period.cadence,
      periodKey: period.periodKey,
      processed: reserved.length,
    });
  } catch (error) {
    console.error("Sending email period failed", error);

    return response.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}