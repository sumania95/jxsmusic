import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Img,
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

    // DJ metadata
    bpm?: number | null;
    mediaType?: string | null;
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
                {String(trackCount)} fresh {trackCount === 1 ? "drop is" : "drops are"} now live
                on JxSmusic
            </Preview>

            <Tailwind>
                <Body className="m-0 bg-[#07080b] px-3 py-10 font-sans text-white">
                    <Container className="mx-auto max-w-[620px] overflow-hidden rounded-2xl border border-[#23262f] bg-[#101217]">
                        {/* HEADER */}
                        <Section className="px-8 pb-7 pt-9 text-center">
                            <Img
                                src={"https://jxsmusic-eta.vercel.app/images/jeff92-ayan-brand-mark.png"}
                                width="100"
                                height="70"
                                alt="JxSmusic"
                                className="mx-auto block"
                            />


                            <Text className="mb-0 mt-2 text-[10px] font-bold tracking-[3px] text-[#777f90]">
                                JEFF92 × AYAN SUMANIA
                            </Text>
                        </Section>

                        {/* HERO */}
                        <Section className="border-y border-[#22262e] bg-[#151821] px-8 py-10">
                            <Text className="mb-4 mt-0 text-[10px] font-extrabold tracking-[3px] text-[#B9FF00]">
                                NEW THIS WEEK
                            </Text>

                            <Heading className="m-0 text-[38px] font-black leading-[42px] tracking-[-1px] text-white">
                                FRESH DROPS
                                <br />
                                ARE LIVE.
                            </Heading>

                            <Text className="mb-7 mt-5 text-[15px] leading-6 text-[#9ca3b2]">
                                Hi {customerName}, new DJ-ready tracks just landed on JxSmusic.
                                Check out the latest releases and keep your crate fresh.
                            </Text>

                            <Section className="rounded-xl bg-[#B9FF00] px-6 py-6">
                                <Text className="m-0 text-[52px] font-black leading-none tracking-[-2px] text-zinc-950">
                                    {trackCount}
                                </Text>

                                <Text className="mb-0 mt-2 text-[10px] font-extrabold tracking-[2px] text-zinc-800">
                                    {trackCount === 1 ? "NEW DROP" : "NEW DROPS"}
                                </Text>
                            </Section>
                        </Section>

                        {/* TRACK LIST */}
                        <Section className="px-8 py-9">
                            <Text className="mb-5 mt-0 text-[10px] font-extrabold tracking-[3px] text-[#747c8d]">
                                LATEST DROPS
                            </Text>

                            {latestTracks.length === 0 ? (
                                <Section className="rounded-xl border border-dashed border-[#343944] bg-[#171a20] p-6">
                                    <Text className="m-0 mb-2 font-bold text-white">
                                        More music is coming.
                                    </Text>

                                    <Text className="m-0 text-sm leading-5 text-[#7d8492]">
                                        New releases will appear here as soon as they drop.
                                    </Text>
                                </Section>
                            ) : (
                                latestTracks.slice(0, 6).map((track, index) => (
                                    <Section
                                        key={track.id}
                                        className="mb-3 rounded-xl border border-[#292d36] bg-[#181b21] p-5"
                                    >
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellPadding="0"
                                            cellSpacing="0"
                                        >
                                            <tbody>
                                                <tr>
                                                    {/* TRACK NUMBER */}
                                                    <td className="w-10 align-middle text-[11px] font-extrabold text-[#555d6c]">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </td>

                                                    {/* TRACK INFO */}
                                                    <td className="align-middle">
                                                        <Text className="m-0 mb-1 text-[15px] font-bold leading-5 text-white">
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

                                                        {/* ARTIST + DATE */}
                                                        <Text className="m-0 mb-2 text-xs text-[#7d8594]">
                                                            {track.artistName ?? "JxSmusic"} ·{" "}
                                                            {formatDate(track.uploadedAt)}
                                                        </Text>

                                                        {/* BPM + MEDIA TYPE */}
                                                        <Text className="m-0 text-[10px] font-extrabold tracking-[1.2px] text-[#B9FF00]">
                                                            {track.bpm ? `${track.bpm} BPM` : "BPM —"}
                                                            {"  •  "}
                                                            {track.mediaType?.toUpperCase() ?? "AUDIO"}
                                                        </Text>
                                                    </td>

                                                    {/* PLAY */}
                                                    {track.trackUrl && (
                                                        <td className="w-14 text-right align-middle">
                                                            <Link
                                                                href={track.trackUrl}
                                                                className="text-[10px] font-extrabold tracking-[1px] text-[#B9FF00] no-underline"
                                                            >
                                                                PLAY →
                                                            </Link>
                                                        </td>
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Section>
                                ))
                            )}

                            {/* MORE TRACKS */}
                            {trackCount > 6 && (
                                <Text className="mb-1 mt-5 text-center text-xs font-bold tracking-[1px] text-[#777f8f]">
                                    + {trackCount - 6} MORE NEW{" "}
                                    {trackCount - 6 === 1 ? "DROP" : "DROPS"}
                                </Text>
                            )}
                        </Section>

                        {/* MAIN CTA */}
                        <Section className="px-8 pb-10 text-center">
                            <Button
                                href={dashboardUrl}
                                className="rounded-lg bg-white px-7 py-4 text-[13px] font-extrabold text-[#101217]"
                            >
                                BROWSE ALL NEW RELEASES →
                            </Button>
                        </Section>

                        {/* BRAND MESSAGE */}
                        <Section className="border-t border-[#252932] bg-[#0c0e12] px-8 py-8 text-center">
                            <Heading className="m-0 text-[21px] font-black tracking-[-0.5px] text-white">
                                KEEP YOUR CRATE FRESH.
                            </Heading>

                            <Text className="mb-0 mt-3 text-xs font-bold tracking-[1.5px] text-[#727a89]">
                                AUDIO • VIDEO • DJ EDITS • SINGLE DOWNLOADS
                            </Text>
                        </Section>

                        {/* FOOTER */}
                        <Section className="border-t border-[#20232b] px-8 py-7 text-center">
                            <Text className="m-0 text-[15px] font-black tracking-[2px] text-white">
                                JxSmusic
                            </Text>

                            <Text className="mb-5 mt-2 text-[10px] font-bold tracking-[2px] text-[#656d7c]">
                                JEFF92 × AYAN SUMANIA
                            </Text>

                            <Text className="m-0 mb-3 text-xs text-[#555d6b]">
                                Built for DJs. Ready for the set.
                            </Text>

                            <Text className="m-0 text-[11px] text-[#656d7c]">
                                You received this email because you subscribed to JxSmusic.
                            </Text>

                            <Text className="mb-0 mt-3 text-[11px]">
                                <Link
                                    href={preferencesUrl}
                                    className="text-[#8c94a3] underline"
                                >
                                    Unsubscribe
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