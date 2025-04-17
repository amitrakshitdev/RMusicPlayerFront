"use client";
import AlbumArt from "@/components/common/AlbumArt/AlbumArt";
import {
    selectCurrentPlaylist,
    selectCurrentSong,
} from "@/store/playlistSlice";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import musicIcon from "@/assets/images/MusicIcon.png";
import downIcon from "@/assets/images/down-icon.svg"
import SongCard from "@/components/common/SongCards/SongCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function WatchPage() {
    const router = useRouter();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const currentSong = useSelector(selectCurrentSong);
    const [show, setShow] = useState(true);
    useEffect(()=>{
        if (currentPlaylist.length === 0) {
            router.replace("/")
        }
    }, [currentPlaylist])
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={clsx([
                        "flex-1",
                        "relative",
                        "flex flex-col md:gap-y-4 gap-y-5",
                        "flex-1 bg-gradient-to-b from-accent500/0 to-accent200/5",
                        "px-5 lg:px-20 pb-24 pt-10",
                        "overflow-y-scroll",
                        "border-t border-accent100/20",
                    ])}
                    initial={{ top: "100%", opacity: 0 }}
                    animate={{ top: "0", opacity: 1 }}
                    exit={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 0.1 }}
                >
                    <div className={clsx(["relative flex px-10 items-center justify-around"])}>
                        <h1 className={clsx(["text-3xl text-center"])}>
                            Now playing
                        </h1>
                        <h2 className={clsx(["text-xl"])}>Up next</h2>
                        <button className={clsx(["absolute right-0 cursor-pointer",
                            "active:opacity-70 hover:scale-110"
                        ])} onClick={()=> {setShow(false)
                            router.replace("/")
                        }}>
                            <Image src={downIcon} alt="donw arrow"/>
                        </button>
                    </div>
                    <div
                        className={clsx([
                            "flex-1 relative md:grid md:grid-cols-2",
                            "h-[80%]",
                        ])}
                    >
                        <AlbumArt
                            src={currentSong?.thumbnail.url || musicIcon}
                            width={currentSong?.thumbnail.width || 0}
                            height={currentSong?.thumbnail.width || 0}
                            className={clsx([
                                "w-[250px] h-[250px]",
                                "md:w-[350px] md:h-[350px]",
                                "lg:w-[496px] lg:h-[496px]",
                                "justify-self-center self-center",
                            ])}
                        />
                        <div
                            className={clsx([
                                "relative h-[70dvh] flex flex-col items-center overflow-scroll gap-y-2",
                            ])}
                        >
                            {currentPlaylist.map((song) => (
                                <SongCard
                                    key={song.videoId}
                                    data={song}
                                    orientation="row"
                                    className={clsx(["lg:w-lg",
                                        "md:w-lg"
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
