"use client";
import Section from "@/components/common/Section/Section";
import SongCard from "@/components/common/SongCards/SongCard";
import { changePlaylist, selectCurrentPlaylist } from "@/store/playlistSlice";
import { Song } from "@/types/song";
import clsx from "clsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
    console.log("Home component");
    const dispatch = useDispatch();
    useEffect(() => {
        async function initialDataFetch() {
            const data = await import("@/data/serchResults.json");
            const defaultPlaylist: Song[] = data.items.map((song) => {
                return {
                    videoId: song.id.videoId,
                    title: song.snippet.title,
                    channelTitle: song.snippet.channelTitle,
                    thumbnail: song.snippet.thumbnails.high,
                };
            });
            dispatch(changePlaylist(defaultPlaylist));
        }
        initialDataFetch();
    }, []);
    const currentPlaylist = useSelector(selectCurrentPlaylist);

    return (
        // <></>
        <div
            className={clsx([
                "relative",
                "flex flex-col md:gap-y-4 gap-y-5",
                "flex-1 bg-gradient-to-b from-accent500/0 to-accent200/5",
                "px-5 py-3 lg:px-20 lg:py-16 pb-20",
                 "overflow-y-scroll"
            ])}
        >
            <Section
                heading={"Quick Picks"}
                subHeading={"A holi special bonding for you"}
            >
                <div className={clsx(["flex flex-col flex-wrap max-h-60 gap-4"])}>
                    {currentPlaylist.map((song) => (
                        <SongCard key={song.videoId} data={song} />
                    ))}
                </div>
            </Section>
            <Section
                heading={"Music videos for you"}
                subHeading={"A holi special bonding for you"}
            >
                <div className={clsx(["flex flex-row max-h-60 gap-4"])}>
                    {currentPlaylist.map((song) => (
                        <SongCard key={song.videoId} data={song} orientation="col" />
                    ))}
                </div>
            </Section>
            <Section
                heading={"Music videos for you"}
                subHeading={"A holi special bonding for you"}
            >
                <div className={clsx(["flex flex-row max-h-60 gap-4"])}>
                    {currentPlaylist.map((song) => (
                        <SongCard key={song.videoId} data={song} orientation="col" />
                    ))}
                </div>
            </Section>
            <Section
                heading={"Music videos for you"}
                subHeading={"A holi special bonding for you"}
            >
                <div className={clsx(["flex flex-row max-h-60 gap-4"])}>
                    {currentPlaylist.map((song) => (
                        <SongCard key={song.videoId} data={song} orientation="col" />
                    ))}
                </div>
            </Section>
            <Section
                heading={"Quick Picks"}
                subHeading={"A holi special bonding for you"}
            >
                <div className={clsx(["flex flex-col flex-wrap max-h-60 gap-4"])}>
                    {currentPlaylist.map((song) => (
                        <SongCard key={song.videoId} data={song} />
                    ))}
                </div>
            </Section>
        </div>
    );
}
