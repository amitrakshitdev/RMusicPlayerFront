/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import clsx from "clsx";
import * as React from "react";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import Image from "next/image";
import { Slider } from "radix-ui";
import { motion } from "motion/react";
import PlayerButton from "../common/PlayerButton/PlayerButton";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import nextButtonIcon from "./assets/nextButton.svg";
import prevButoonIcon from "./assets/prevButton.svg";
import shuffleIcon from "./assets/shuffle.svg";
import repeat from "./assets/repeat.svg";
import repeatOnce from "./assets/repeatOnce.svg";
import musicIcon from "./assets/music.svg";
import { Song, SongInfo } from "@/types/song";
import { useDispatch, useSelector } from "react-redux";
import {
    queueSong,
    playNext,
    changePlaylist,
    selectCurrentPlaylist,
    selectCurrentPlayingIndex,
    selectCurrentSongId,
    selectIsPlaying,
    nextSong,
    prevSong,
    play,
    pause
} from "@/store/playlistSlice"; // Adjust the import path

enum YT {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
}

type YoutubeMusicPlayerProps = {
    
};

export default function MiniMusicPlayer(
    props: YoutubeMusicPlayerProps
): JSX.Element {
    // References
    const playerRef = useRef(null);
    const intervalRef = useRef<any>("");
    // Local State (for UI only, Redux for core state)
    const [playerMode, setPlayerMode] = useState<"full" | "small">("small");
    const [songDuration, setSongDuration] = useState<number>(100);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const [isLooping, setIsLooping] = useState(true); // Keep local for now if UI-specific
    const [isRepeatingOnce, setIsRepeatingOnce] = useState(false); // Keep local for now if UI-specific

    // Redux State and Dispatch
    const dispatch = useDispatch();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const currentPlayingIndex = useSelector(selectCurrentPlayingIndex);
    const isReduxPlaying = useSelector(selectIsPlaying);
    const currentSongId = useSelector(selectCurrentSongId);

    // Determine the current song details from Redux state
    const currentSong = useMemo(() => {
        if (currentPlayingIndex !== null && currentPlaylist.length > currentPlayingIndex) {
            return currentPlaylist[currentPlayingIndex];
        }
        return undefined;
    }, [currentPlaylist, currentPlayingIndex]);

    const songDetails = useMemo(() => {
        // Fallback to the first song if currentSong is not available (e.g., on initial load)
        const song = currentSong;
        if (song) {
            return {
                ...song,
            };
        }
        return {
            title: "",
            thumbnail: { high: { url: "" } } as any,
            channelTitle: "",
            videoId: "",
        };
    }, [currentSong]);

    const opts: YouTubeProps["opts"] = {
        height: "0",
        width: "0",
        playerVars: {
            autoplay: 1,
            controls: 0,
            playsinline: 1,
        },
        enablejsapi: 1,
    };

    const onReady = (event: any) => {
        playerRef.current = event.target;
        const duration = playerRef.current.getDuration();
        setSongDuration(duration);
    };

    const onPlayerStateChange = (event) => {
        const player = event.target;
        if (event.data === YT.PLAYING) {
            dispatch(play())
            setSongDuration(event.target.getDuration());
        } else if (event.data === YT.PAUSED) {
            dispatch(pause());
        } else if (event.data === YT.ENDED) {
            if (isRepeatingOnce) {
                event.target.seekTo(0);
                event.target.playVideo();
            } else if (isLooping && currentPlaylist.length > 0) {
                dispatch(nextSong());
            } else if (isLooping && currentPlaylist.length === 0) {
                player.playVideo();
            } else if (
                currentPlaylist.length > 0 &&
                currentPlayingIndex !== null &&
                currentPlayingIndex < currentPlaylist.length - 1
            ) {
                dispatch(nextSong());
            } else {
                dispatch(pause())
            }
        } else if (event.data === YT.BUFFERING) {
        }
    };

    useEffect(() => {
        const player = playerRef.current;
        if (!isDraggingSlider && isReduxPlaying && player && player.getCurrentTime) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(() => player.getCurrentTime());
            }, 1000);
            return () => clearInterval(intervalRef.current);
        }
    }, [isReduxPlaying, isDraggingSlider]);

    function togglePlayerMode() {
        // The logic for going to watch page
    }

    function onSliderValueChange(value) {
        setIsDraggingSlider(true);
        if (playerRef.current && "seekTo" in playerRef.current) {
            playerRef.current.seekTo(value);
            setCurrentTime(value);
        }
    }

    const handlePlayPause = React.useCallback(() => {
        if (playerRef.current) {
            if (isReduxPlaying) {
                playerRef.current.pauseVideo();
                dispatch(pause());
            } else {
                playerRef.current.playVideo();
                dispatch(play());
            }
        }
    }, [isReduxPlaying]);

    function handlePrevious() {
        const player = playerRef.current;
        if (currentPlaylist.length > 0 && player) {
            const currentTime = player.getCurrentTime();
            if (currentTime < 5) {
                dispatch(prevSong());
                dispatch(play());
            } else {
                console.log("more than 5", currentTime);
                dispatch(pause())
                player.seekTo(0);
                setCurrentTime(0);
            }
        } else if (player) {
            player.playVideo();
            player.seekTo(0);
            dispatch(play());
        }
    }

    function handleNext() {
        dispatch(nextSong());
        const player = playerRef.current;
        if (player) {
            dispatch(play());
            setCurrentTime(0);
        }
    }

    // useEffect(()=>{
    //     if (isReduxPlaying) {
    //         playerRef.current?.playVideo();
    //     } else {
    //         playerRef.current?.pauseVideo();
    //     }
    // }, [isReduxPlaying])

    useEffect(() => {
        // If currentPlayingIndex changes, ensure the video player loads the correct song
        if (currentPlayingIndex !== null && currentPlaylist.length > currentPlayingIndex) {
            const newVideoId = currentPlaylist[currentPlayingIndex].videoId;
            if (playerRef.current && songDetails.videoId !== newVideoId) {
                playerRef.current?.playVideo();
            }
        }
    }, [currentPlaylist, currentPlayingIndex, dispatch]);

    return (
        <>
            
                <motion.div
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", ease: "easeInOut" }}
                    className={clsx([
                        "fixed w-full bg-bgDark/80",
                        "bottom-0",
                        "h-20",
                        "flex items-center justify-between",
                        "px-2 sm:px-4",
                    ])}
                >
                    <YouTube
                        className="absolute bottom-0 hidden"
                        videoId={songDetails.videoId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onPlayerStateChange}
                    />
                    {/* Slider on for mini player */}
                    <motion.div
                        className={clsx(["absolute top-0 inset-x-0"])}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ ease: "ease", type: "tween", delay: 0.1 }}
                    >
                        <Slider.Root
                            onValueCommit={(values) => {
                                setIsDraggingSlider(false);
                            }}
                            onValueChange={(values) =>
                                onSliderValueChange(values[0])
                            }
                            value={[currentTime]}
                            style={{ userSelect: "none", touchAction: "none" }}
                            className={clsx([
                                "absolute flex items-center inset-x-2 h-10 top-0",
                                "transform -translate-y-1/2",
                            ])}
                            defaultValue={[0]}
                            max={songDuration}
                            step={1}
                        >
                            <Slider.Track className="relative w-full h-0.5 bg-white rounded-md">
                                <Slider.Range className="absolute h-full bg-accent200 rounded-md" />
                            </Slider.Track>
                            <Slider.Thumb
                                className={clsx([
                                    "block w-2.5 h-2.5 rounded-2xl bg-bgLight",
                                ])}
                                aria-label="Volume"
                            />
                        </Slider.Root>
                    </motion.div>

                    {/* Song Details */}
                    <motion.div
                        className={clsx([
                            "relative",
                            "song-details-wrapper",
                            "flex items-center justify-start",
                            "h-full",
                            "w-2/3 sm:w-2/5",
                            "max-w-3/5",
                        ])}
                        onClick={() => {
                            togglePlayerMode();
                        }}
                    >
                        {/* Album art */}
                        <motion.div
                            className={clsx([
                                "album-art-container",
                                "aspect-square",
                                "h-3/5 w-auto",
                                "overflow-hidden rounded-sm",
                                "mr-3",
                            ])}
                        >
                            <Image
                                className={clsx([
                                    "object-cover h-full ",
                                    [!currentSong?.thumbnail ? "scale-100 h-full w-full" : "scale-[135%]"]
                                ])}
                                src={currentSong?.thumbnail.url || musicIcon}
                                alt="Song thumbnail"
                                width={currentSong?.thumbnail.width || 20}
                                height={currentSong?.thumbnail.height|| 20}
                                onError={(e) => {
                                    console.error("Image load error:", e);
                                }}
                            />
                        </motion.div>
                        <div className={clsx(["max-w-7/12"])}>
                            <h2
                                className={clsx([
                                    "font-bold text-base max-w-full overflow-hidden",
                                    "whitespace-nowrap overflow-ellipsis",
                                ])}
                            >
                                {currentSong?.title || "Click on a music to play"}
                            </h2>
                            <h4
                                className={clsx([
                                    "font-thin text-sm font-mullish",
                                ])}
                            >
                                {currentSong?.channelTitle || "Listen to your favourit artist"}
                            </h4>
                        </div>
                        {/* Time stamp */}
                        <motion.div
                            className={clsx([
                                "song-controls-container w-auto",
                                "hidden md:block",
                            ])}
                        >
                            <div
                                className={clsx([
                                    "timestamp-container h-5",
                                    "flex items-center justify-between",
                                    "font-mullish text-sm",
                                ])}
                            >
                                <span>{formatTime(currentTime)}</span> &nbsp; /
                                &nbsp;
                                <span>{formatTime(songDuration)}</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Player controls */}
                    <div
                        className={clsx([
                            "my-3",
                            "w-1/3",
                            "song-control-buttons-container",
                            "flex justify-between items-center",
                            "max-w-36",
                        ])}
                    >
                        <PlayerButton
                            className={clsx(["previous-button"])}
                            onClick={() => {
                                handlePrevious();
                            }}
                        >
                            <Image
                                src={prevButoonIcon}
                                alt="play button"
                                className={clsx(["w-[70%] h-auto"])}
                            />
                        </PlayerButton>
                        <PlayerButton
                            onClick={() => handlePlayPause()}
                            className={clsx(["w-16 h-16"])}
                        >
                            {isReduxPlaying ? (
                                <Image
                                    src={pauseIcon}
                                    alt="play button"
                                    className={clsx(["w-[70%] h-auto"])}
                                />
                            ) : (
                                <Image
                                    src={playIcon}
                                    alt="play button"
                                    className={clsx(["w-[50%] h-auto"])}
                                />
                            )}
                        </PlayerButton>
                        <PlayerButton
                            className={clsx(["next-button"])}
                            onClick={() => {
                                handleNext();
                            }}
                        >
                            <Image
                                src={nextButtonIcon}
                                alt="play button"
                                className={clsx(["w-[70%] h-auto"])}
                            />
                        </PlayerButton>
                    </div>

                    {/* Shuffle & Repeat button */}
                    <div
                        className={clsx([
                            "h-auto",
                            "hidden sm:flex",
                            "w-2/5",
                            "justify-end",
                        ])}
                    >
                        <PlayerButton
                            className={clsx(["shuffle-button"])}
                            disabled={currentPlaylist.length === 0} // Disable if no songs
                            onClick={() => {
                                // Implement shuffle logic and dispatch an action if needed
                                console.log("Shuffle clicked");
                            }}
                        >
                            <Image
                                src={shuffleIcon}
                                alt="shuffle button"
                                className={clsx(["w-[70%] h-auto"])}
                            />
                        </PlayerButton>
                        <PlayerButton
                            className={clsx(["repeat-button"])}
                            onClick={() => {
                                // Implement repeat toggle logic and update local state if UI-only
                                setIsLooping(!isLooping);
                                console.log("Repeat clicked", !isLooping);
                            }}
                        >
                            <Image
                                src={isRepeatingOnce ? repeatOnce : repeat}
                                alt="repeat button"
                                className={clsx(["w-[70%] h-auto"], {
                                    "opacity-40": !isLooping,
                                })}
                            />
                        </PlayerButton>
                    </div>
                </motion.div>
            
        </>
    );
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}
