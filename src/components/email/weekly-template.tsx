import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Track = {
  id: string;
  title: string;
  artistName?: string | null;
  trackUrl?: string | null;
  uploadedAt: Date | string;
};

type WeeklyUploadEmailProps = {
  customerName: string;
  trackCount: number;
  latestTracks: Track[];
  dashboardUrl: string;
  preferencesUrl: string;
};

export function WeeklyUploadEmail({
  customerName,
  trackCount,
  latestTracks,
  dashboardUrl,
  preferencesUrl,
}: WeeklyUploadEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        You uploaded {String(trackCount)} tracks this week
      </Preview>

      <Tailwind>
        <Body className="m-0 bg-[#08090c] px-3 py-10 font-sans text-white">
          <Container className="mx-auto max-w-[600px] rounded-2xl border border-[#242730] bg-[#111318] p-9">
            <Section className="mb-12">
              <Text className="m-0 text-xl font-black tracking-[4px]">
                JEFF92 & AYAN SUMANIA
              </Text>

              <Text className="mt-2 text-[10px] font-bold tracking-[2px] text-[#737b8c]">
                WEEKLY UPLOAD
              </Text>
            </Section>

            <Section className="mb-8">
              <Text className="mb-4 text-[11px] font-extrabold tracking-[2px] text-violet-500">
                YOUR WEEK IN MUSIC
              </Text>

              <Heading className="m-0 mb-5 text-[42px] font-extrabold leading-[46px] tracking-[-1.5px] text-white">
                Nice work,
                <br />
                {customerName}.
              </Heading>

              <Text className="mb-7 text-base leading-6 text-gray-400">
                Here is a quick look at your uploads from the past week.
              </Text>

              <Section className="rounded-2xl bg-violet-600 p-7">
                <Text className="m-0 text-[64px] font-black leading-none tracking-[-3px] text-white">
                  {trackCount}
                </Text>

                <Text className="mb-0 mt-2 text-[11px] font-extrabold tracking-[1.5px] text-violet-200">
                  {trackCount === 1
                    ? "TRACK UPLOADED"
                    : "TRACKS UPLOADED"}
                </Text>
              </Section>
            </Section>

            <Section className="mt-10">
              <Text className="mb-4 text-[11px] font-extrabold tracking-[2px] text-[#737b8c]">
                LATEST UPLOADS
              </Text>

              {latestTracks.length === 0 ? (
                <Section className="rounded-xl border border-dashed border-[#353a45] bg-[#191c22] p-6">
                  <Text className="m-0 mb-2 font-bold text-white">
                    Ready for your next track?
                  </Text>

                  <Text className="m-0 text-sm leading-5 text-[#777f8f]">
                    Your next upload will appear in the upcoming weekly report.
                  </Text>
                </Section>
              ) : (
                latestTracks.slice(0, 10).map((track, index) => (
                  <Section
                    key={track.id}
                    className="mb-2 rounded-xl border border-[#292d36] bg-[#191c22] p-4"
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                    >
                      <tbody>
                        <tr>
                          <td className="w-9 align-middle text-xs font-extrabold text-[#606777]">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td className="align-middle">
                            <Text className="m-0 mb-1 text-[15px] font-bold text-white">
                              {track.trackUrl ? (
                                <Link
                                  href={track.trackUrl}
                                  className="text-white no-underline"
                                >
                                  {track.title}
                                </Link>
                              ) : (
                                track.title
                              )}
                            </Text>

                            <Text className="m-0 text-xs text-[#777f8f]">
                              {track.artistName ?? "Your upload"} ·{" "}
                              {formatDate(track.uploadedAt)}
                            </Text>
                          </td>

                          {track.trackUrl && (
                            <td className="w-12 text-right align-middle">
                              <Link
                                href={track.trackUrl}
                                className="text-[10px] font-extrabold tracking-wider text-violet-400 no-underline"
                              >
                                PLAY
                              </Link>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </Section>
                ))
              )}
            </Section>

            <Section className="my-8">
              <Button
                href={dashboardUrl}
                className="rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-[#111318]"
              >
                Open your dashboard →
              </Button>
            </Section>

            <Section className="border-t border-[#292d36] pt-6">
              <Text className="m-0 mb-2 text-center text-xs text-[#5f6674]">
                Your weekly upload summary from WAVE.
              </Text>

              <Text className="m-0 text-center text-xs">
                <Link
                  href={preferencesUrl}
                  className="text-[#8b93a2] underline"
                >
                  Manage email preferences
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}