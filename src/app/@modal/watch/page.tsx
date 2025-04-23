"use client";
import AlbumArt from "@/components/common/AlbumArt/AlbumArt";
import {
    selectCurrentPlaylist,
    selectCurrentSong,
} from "@/store/playlistSlice";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import musicIcon from "@/assets/images/MusicIcon.png";
import downIcon from "@/assets/images/down-icon.svg";
import SongCard from "@/components/common/SongCards/SongCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import playIcon from "@/assets/images/play.svg";

export default function WatchPage() {
    const router = useRouter();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const currentSong = useSelector(selectCurrentSong);
    const [show, setShow] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);
    useEffect(() => {
        if (currentPlaylist.length === 0 && isMounted) {
            router.replace("/");
        }
    }, [currentPlaylist, router, isMounted, show]);
    return (
        <AnimatePresence>
            {!isMounted && (
                <div
                    className={clsx([
                        "absolute h-full w-full flex justify-center items-center duration-500",
                    ])}
                >
                    <Image
                        src={playIcon}
                        alt="loading icon"
                        className={clsx(["animate-pluse w-1/5 h-1/5"])}
                    />
                </div>
            )}
            {show && isMounted && (
                <motion.div
                    key={1}
                    className={clsx([
                        "hidden sm:flex",
                        "absolute h-full w-full",
                        "flex flex-col md:gap-y-4 gap-y-5",
                        "flex-1 bg-gradient-to-b from-bgDark/90 to-accent500/50 backdrop-blur-md",
                        "px-5 lg:px-20 pb-24 pt-10",
                        "overflow-y-scroll",
                        "border-t border-accent100/20",
                    ])}
                    initial={{ top: "100%", opacity: 0 }}
                    animate={{ top: "0%", opacity: 1 }}
                    exit={{ "top" : "100%", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className={clsx([
                            "relative flex px-10 items-center justify-around",
                        ])}
                    >
                        <h1 className={clsx(["text-3xl text-center"])}>
                            Now playing
                        </h1>
                        <h2 className={clsx(["text-xl"])}>Up next</h2>
                        <button
                            className={clsx([
                                "absolute right-0 cursor-pointer",
                                "active:opacity-70 hover:scale-110",
                            ])}
                            onClick={() => {
                                setShow(false);
                                const timeOut = setTimeout(()=>{
                                    router.back();
                                    clearTimeout(timeOut);
                                }, 300)
                            }}
                        >
                            <Image src={downIcon} alt="donw arrow" />
                        </button>
                    </div>
                    <div
                        className={clsx([
                            "flex-1 relative md:grid md:grid-cols-2 h-7/8",
                        ])}
                    >
                        <AlbumArt
                            src={currentSong?.thumbnail.url || musicIcon}
                            width={currentSong?.thumbnail.width || 0}
                            height={currentSong?.thumbnail.width || 0}
                            shouldShowPlayAnimation={false}
                            className={clsx([
                                "w-[250px] h-[250px]",
                                "md:w-[300px] md:h-[300px]",
                                "lg:w-[450px] lg:h-[450px]",
                                "xl:w-[496px]",
                                "justify-self-center self-center",
                            ])}
                        />
                        <div
                            className={clsx([
                                "relative sm:h-[40dvh] md:h-full flex flex-col items-center overflow-y-scroll overflow-x-hidden gap-y-2",
                                "my-5",
                                "md:my-0 md:mb-20",
                            ])}
                        >
                            {currentPlaylist.map((song) => (
                                <SongCard
                                    key={song.videoId}
                                    data={song}
                                    orientation="row"
                                    className={clsx([
                                        "px-4",
                                        "justify-self-center",
                                        "sm:max-w-none w-full",
                                    ])}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
