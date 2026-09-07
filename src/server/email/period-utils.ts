// server/email/period-utils.ts

import { db } from "@/server/db";
import type { PeriodCadence, PeriodIdentifier } from "generated/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getPreviousWeeklyPeriod(now = new Date()) {
  const currentMonday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );

  const day = currentMonday.getUTCDay() || 7;

  currentMonday.setUTCDate(
    currentMonday.getUTCDate() - day + 1,
  );

  const startAt = new Date(
    currentMonday.getTime() - 7 * DAY_MS,
  );

  return {
    periodKey: getIsoWeekKey(startAt),
    startAt,
    endAt: currentMonday,
  };
}

export function getPreviousMonthlyPeriod(now = new Date()) {
  const endAt = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  const startAt = new Date(
    Date.UTC(endAt.getUTCFullYear(), endAt.getUTCMonth() - 1, 1),
  );

  const periodKey = [
    startAt.getUTCFullYear(),
    String(startAt.getUTCMonth() + 1).padStart(2, "0"),
  ].join("-");

  return {
    periodKey,
    startAt,
    endAt,
  };
}

export async function activatePeriod(input: {
  identifier: PeriodIdentifier;
  cadence: PeriodCadence;
  periodKey: string;
  startAt: Date;
  endAt: Date;
}) {
  return db.$transaction(async (transaction) => {
    await transaction.period.updateMany({
      where: {
        identifier: input.identifier,
        cadence: input.cadence,
        active: true,
        periodKey: {
          not: input.periodKey,
        },
      },
      data: {
        active: false,
      },
    });

    return transaction.period.upsert({
      where: {
        identifier_cadence_periodKey: {
          identifier: input.identifier,
          cadence: input.cadence,
          periodKey: input.periodKey,
        },
      },
      update: {
        startAt: input.startAt,
        endAt: input.endAt,
        active: true,
      },
      create: {
        identifier: input.identifier,
        cadence: input.cadence,
        periodKey: input.periodKey,
        startAt: input.startAt,
        endAt: input.endAt,
        active: true,
      },
    });
  });
}

function getIsoWeekKey(date: Date) {
  const target = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );

  const day = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - day);

  const year = target.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));

  const week = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7,
  );

  return `${year}-W${String(week).padStart(2, "0")}`;
}