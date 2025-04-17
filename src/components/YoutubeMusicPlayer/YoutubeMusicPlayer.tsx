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
import { Song, SongInfo } from "@/types/song";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { nextSong, prevSong, selectCurrentPlayingIndex } from "@/store/playlistSlice";
enum YT {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
}

type YoutubeMusicPlayerProps = {
    videoId?: string;
    songsData: Array<Song>;
};
export default function YoutubeMusicPlayer(
    props: YoutubeMusicPlayerProps
): JSX.Element {
    const dispatch = useDispatch();
    const globalCurrIndex = useSelector(selectCurrentPlayingIndex);
    const {songsData} = props;

    // References
    const playerRef = useRef<any>(null);
    const intervalRef = useRef<any>("");

    // States
    const [playerMode, setPlayerMode] = useState<"full" | "small">("full");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [songDuration, setSongDuration] = useState<number>(100);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(globalCurrIndex || 0);
    const [isLooping, setIsLooping] = useState(true);
    const [isRepeatingOnce, setIsRepeatingOnce] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    // hooks
    const router = useRouter();

    const opts: YouTubeProps["opts"] = {
        height: "0",
        width: "0",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            controls: 0,
            playsinline: 1,
        },
        enablejsapi: 1,
    };

    useEffect(()=> {
        setCurrentSongIndex(prev => {
            return globalCurrIndex !== null ? globalCurrIndex : prev;
        });
    }, [globalCurrIndex]);

    const songDetails = useMemo(() => {
        const song = songsData[currentSongIndex];

       return song;
    }, [songsData, currentSongIndex]);

    const onReady = (event: any) => {
        playerRef.current = event.target;
        if (isPlaying) {
            event.target.playVideo();
        }
        const duration = event.target.getDuration();
        setSongDuration(duration);
    };

    const onPlayerStateChange = (event: any) => {
        const player = event.target;
        if (event.data === YT.PLAYING) {
            console.log("YT Playing");
            setIsBuffering(false);
            setIsPlaying(true);
            setSongDuration(event.target.getDuration());
        } else if (event.data === YT.PAUSED) {
            console.log("YT Paused")
            setIsPlaying(false);
        } else if (event.data === YT.ENDED) {
            console.log("YT ended")
            if (isRepeatingOnce) {
                event.target.seekTo(0);

                event.target.playVideo();
            } else if (isLooping && songsData.length > 0) {
                handleNext();
            } else if (isLooping && songsData.length === 0) {
                player.playVideo();
            } else if (
                songsData.length > 0 &&
                currentSongIndex < songsData.length - 1
            ) {
                handleNext();
            } else {
                setIsPlaying(false);
            }
        } else if (event.data === YT.BUFFERING) {
            setIsBuffering(true);
        }
    };

    useEffect(()=>{
        const player = playerRef?.current;
        if (player) {
            setIsPlaying(false);
            player.seekTo(0);
            player.playVideo();
            setCurrentTime(0);
        }
        console.log(songDetails);
    }, [songDetails])

    useEffect(() => {
        const player = playerRef.current;

        if (!isDraggingSlider && isPlaying && player && player.getCurrentTime) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(() => player.getCurrentTime());
            }, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [isPlaying, isDraggingSlider]);

    function togglePlayerMode() {
        // The logic for going to watch page
    }

    function onSliderValueChange(value: number) {
        setIsDraggingSlider(true);

        if (playerRef.current && "seekTo" in playerRef.current) {
            playerRef.current.seekTo(value);

            setCurrentTime(value);
        }
    }

    const handlePlayPause = React.useCallback(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }

            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    function handlePrevious() {
        const player = playerRef.current;
        if (songsData.length > 0 && player) {
            const currentTime = player.getCurrentTime();
            if (currentTime < 5) {
                const prevIndex =
                    (currentSongIndex - 1 + songsData.length) %
                    songsData.length;
                setIsPlaying(false);
                setCurrentSongIndex(prevIndex);
                dispatch(prevSong())
            } else {
                console.log("more than 5", currentTime);
                setIsPlaying(false);
                player.seekTo(0);
                setCurrentTime(0);
            }
        } else if (player) {
            player.playVideo();
            player.seekTo(0);
            setIsPlaying(true);
        }
    }

    function handleNext() {
        const player = playerRef.current;
        if (songsData.length > 0 && player) {
            const nextIndex = (currentSongIndex + 1) % songsData.length;
            setIsPlaying(false);
            setCurrentSongIndex(nextIndex);
            setCurrentTime(0);
            dispatch(nextSong());
        } else if (player) {
            player.playVideo();
            player.seekTo(0);
            setIsPlaying(true);
        }
    }

    return (
        <>
            {playerMode === "full" && (
                <motion.div
                    initial={{top: "100%", opacity: 0}}
                    animate={{top: "0", opacity: 1}}
                    exit={{top: "100%", opacity: 0}}
                    className={clsx([
                        "z-10",
                        "absolute inset-0 bg-bgDark",
                        "flex flex-col items-center justify-between",
                        "px-4",
                    ])}
                >
                    <YouTube
                        className="absolute bottom-0 hidden"
                        videoId={songDetails.videoId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onPlayerStateChange}
                    />
                    <div className={clsx(["h-10 w-full"])}></div>
                    <div
                        className={clsx([
                            "album-art-container",
                            "w-auto h-auto aspect-square max-w-[85%]",
                            "overflow-hidden rounded-md",
                        ])}
                    >
                        <Image
                            className={clsx([
                                "object-cover h-full scale-[135%]",
                            ])}
                            src={songDetails.thumbnail.url}
                            alt="Song thumbnail"
                            width={songDetails.thumbnail.width}
                            height={songDetails.thumbnail.height}
                        />
                    </div>
                    <div
                        className={clsx([
                            "song-details-wrapper",
                            "my-4",
                            "max-w-full",
                        ])}
                    >
                        <h2
                            className={clsx([
                                "font-bold text-xl max-w-full overflow-hidden",
                                "whitespace-nowrap overflow-ellipsis",
                            ])}
                        >
                            {songDetails.title}
                        </h2>
                        <h4
                            className={clsx([
                                "font-thin text-base font-mullish",
                            ])}
                        >
                            {songDetails.channelTitle}
                        </h4>
                    </div>
                    <div className={clsx(["song-controls-container w-full"])}>
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
                                "relative flex items-center w-full h-10",
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
                        <div
                            className={clsx([
                                "timestamp-container h-5",
                                "flex items-center justify-between",
                                "font-mullish",
                            ])}
                        >
                            <div>{formatTime(currentTime)}</div>
                            <div>{formatTime(songDuration)}</div>
                        </div>
                        <div
                            className={clsx([
                                "my-3",
                                "song-control-buttons-container",
                                "flex justify-between items-center",
                            ])}
                        >
                            <PlayerButton
                                className={clsx([
                                    "shuffle-button",
                                    "flex items-center justify-center",
                                ])}
                                disabled={!currentSongIndex}
                                onClick={() => {
                                    handlePrevious();
                                }}
                            >
                                <Image
                                    src={shuffleIcon}
                                    alt="play button"
                                    className={clsx(["w-[70%] h-auto"])}
                                />
                            </PlayerButton>
                            <PlayerButton
                                className={clsx([
                                    "previous-button",
                                    "flex items-center justify-center",
                                ])}
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
                                className={clsx([
                                    "flex items-center justify-center",
                                    "w-20 h-20",
                                    "bg-accent500",
                                ])}
                            >
                                {isPlaying ? (
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
                                className={clsx([
                                    "next-button",
                                    "flex items-center justify-center",
                                ])}
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
                            <PlayerButton
                                className={clsx([
                                    "repeat-button",
                                    "flex items-center justify-center",
                                ])}
                                onClick={() => {
                                    handleNext();
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
                    </div>
                    <div className={clsx(["h-16"])}></div>
                </motion.div>
            )}
            {playerMode === "small" && (
                <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    transition={{type: "tween", ease: "easeInOut"}}
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
                        onClick={()=>{togglePlayerMode()}}
                    >
                        {/* Album art */}
                        <motion.div
                            className={clsx([
                                "album-art-container",
                                "aspect-square",
                                "h-3/5 w-auto",
                                "overflow-hidden rounded-sm",
                                "mr-3"
                            ])}
                        >
                            <Image
                                className={clsx([
                                    "object-cover h-full scale-[135%]",
                                ])}
                                src={songDetails.thumbnail.url}
                                alt="Song thumbnail"
                                width={songDetails.thumbnail.width}
                                height={songDetails.thumbnail.height}
                            />
                        </motion.div>
                        <div className={clsx(["max-w-7/12"])}>
                            <h2
                                className={clsx([
                                    "font-bold text-base max-w-full overflow-hidden",
                                    "whitespace-nowrap overflow-ellipsis",
                                ])}
                            >
                                {songDetails.title}
                            </h2>
                            <h4
                                className={clsx([
                                    "font-thin text-sm font-mullish",
                                ])}
                            >
                                {songDetails.channelTitle}
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
                            className={clsx([
                                "previous-button",
                            ])}
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
                            {isPlaying ? (
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
                    <div className={clsx(["h-auto", "hidden sm:flex", "w-2/5",
                        "justify-end"
                    ])}>
                        <PlayerButton
                            className={clsx(["shuffle-button"])}
                            disabled={!currentSongIndex}
                            onClick={() => {
                                handlePrevious();
                            }}
                        >
                            <Image
                                src={shuffleIcon}
                                alt="play button"
                                className={clsx(["w-[70%] h-auto"])}
                            />
                        </PlayerButton>
                        <PlayerButton
                            className={clsx(["repeat-button"])}
                            onClick={() => {
                                handleNext();
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
            )}
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
