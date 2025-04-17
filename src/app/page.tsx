"use client";
import Section from "@/components/common/Section/Section";
import SongCard from "@/components/common/SongCards/SongCard";
import { changePlaylist, selectCurrentPlaylist } from "@/store/playlistSlice";
import { Song } from "@/types/song";
import clsx from "clsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const playlistNamesWithInfo = [
    {
        id: "1fsdf",
        name: "Chill Beats Oasis",
        info: "Your sanctuary of laid-back grooves and mellow vibes.",
        orientation: "row",
    },
    {
        id: "lkjasd",
        name: "Indie Gems Vault",
        info: "Unearthing the finest alternative and independent sounds.",
        orientation: "col",
    },
    {
        id: "k239fds",
        name: "Energy Boost Tracks",
        info: "Fuel your day with these high-octane, upbeat anthems.",
        orientation: "col",
    },
    {
        id: "j249d9s",
        name: "Groove Therapy",
        info: "Let the infectious rhythms move you and lift your spirits.",
        orientation: "row",
    },
    {
        id: "jsad34",
        name: "Acoustic Serenity",
        info: "Unplug and unwind with the soothing sounds of acoustic melodies.",
        orientation: "col",
    },
];

//   console.log(playlistNamesWithInfo);

export default function Home() {
    const dispatch = useDispatch();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
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
        if (currentPlaylist.length < 1) {
            initialDataFetch();
        }
    }, [currentPlaylist, dispatch]);

    return (
        // <></>
        <div
            className={clsx([
                "relative",
                "flex flex-col md:gap-y-4 gap-y-5",
                "flex-1 bg-gradient-to-b from-accent500/0 to-accent200/5",
                "px-5 py-3 lg:px-20 lg:pt-16 pb-28",
                "overflow-y-scroll",
            ])}
        >
            {playlistNamesWithInfo.map((info) => (
                <Section
                    key={info.id}
                    heading={info.name}
                    subHeading={info.info}
                >
                    <div
                        className={clsx([
                            "flex flex-col flex-wrap max-h-60 gap-4",
                        ])}
                    >
                        {currentPlaylist.map((song) => (
                            <SongCard key={song.videoId} data={song} orientation={info.orientation as "col" | "row"}/>
                        ))}
                    </div>
                </Section>
            ))}
        </div>
    );
}
