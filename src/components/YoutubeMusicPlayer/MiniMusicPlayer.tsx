/* eslint-disable */

/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import clsx from "clsx";
import * as React from "react";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import Image from "next/image";
import { Slider } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";
import PlayerButton from "../common/PlayerButton/PlayerButton";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import nextButtonIcon from "./assets/nextButton.svg";
import prevButoonIcon from "./assets/prevButton.svg";
import downIcon from "@/assets/images/down-icon.svg";
import shuffleIcon from "./assets/shuffle.svg";
import repeat from "./assets/repeat.svg";
import repeatOnce from "./assets/repeatOnce.svg";
import { Song } from "@/types/song";
import {
    nextSong,
    pause,
    play,
    prevSong,
    selectCurrentPlayingIndex,
    selectCurrentPlaylist,
    shufflePlaylist,
} from "@/store/playlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import SongCard from "../common/SongCards/SongCard";

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

function MiniMusicPlayer(props: YoutubeMusicPlayerProps): JSX.Element {
    const dispatch = useDispatch();
    const globalCurrIndex = useSelector(selectCurrentPlayingIndex) || 0;
    const { songsData } = props;

    // References
    const playerRef = useRef<any>(null);
    const intervalRef = useRef<any>("");

    // States
    const [playerMode, setPlayerMode] = useState<"full" | "small">("small");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [songDuration, setSongDuration] = useState<number>(100);
    const [showUplist, setShowUplist] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isRepeatingOnce, setIsRepeatingOnce] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    // hooks
    const router = useRouter();
    const pathname = usePathname();

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
        origin: "https://r-music-seven.vercel.app",
    };

    // useEffect(() => {
    //     setCurrentSongIndex((prev) => {
    //         return globalCurrIndex !== null ? globalCurrIndex : prev;
    //     });
    // }, [globalCurrIndex]);

    const songDetails = useMemo(() => {
        const song = songsData[globalCurrIndex || 0];
        return song;
    }, [songsData, globalCurrIndex]);

    const onReady = React.useCallback((event: any) => {
        setIsPlayerReady(true);
        playerRef.current = event.target;
        if (isPlaying) {
            event.target.playVideo();
        }
        const duration = event.target.getDuration();
        setSongDuration(duration);
    }, []);

    const onPlayerStateChange = (event: any) => {
        const player = event.target;
        if (event.data === YT.PLAYING) {
            console.log("YT Playing");
            setIsBuffering(false);
            setIsPlaying(true);
            setSongDuration(event.target.getDuration());
        } else if (event.data === YT.PAUSED) {
            console.log("YT Paused");
            setIsPlaying(false);
        } else if (event.data === YT.ENDED) {
            console.log("YT ended");
            if (isRepeatingOnce) {
                event.target.seekTo(0);

                event.target.playVideo();
            } else if (isLooping && songsData.length > 0) {
                handleNext();
            } else if (isLooping && songsData.length === 0) {
                player.playVideo();
            } else if (
                songsData.length > 0 &&
                globalCurrIndex < songsData.length - 1
            ) {
                handleNext();
            } else {
                setIsPlaying(false);
            }
        } else if (event.data === YT.BUFFERING) {
            setIsBuffering(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            dispatch(play());
        } else {
            dispatch(pause());
        }
    }, [isPlaying]);

    useEffect(() => {
        const player = playerRef?.current;
        if (player) {
            setIsPlaying(false);
            player.seekTo(0);
            player.playVideo();
            setCurrentTime(0);
        }
    }, [songDetails]);

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
                // const prevIndex =
                //     (currentSongIndex - 1 + songsData.length) %
                //     songsData.length;
                setIsPlaying(false);
                // setCurrentSongIndex(prevIndex);
                dispatch(prevSong());
            } else {
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
            // const nextIndex = (currentSongIndex + 1) % songsData.length;
            setIsPlaying(false);
            // setCurrentSongIndex(nextIndex);
            dispatch(nextSong());
            setCurrentTime(0);
        } else if (player) {
            player.playVideo();
            player.seekTo(0);
            setIsPlaying(true);
        }
        player.nextVideo();
        setIsPlaying(true);
    }

    const handleShuffle = () => {
        dispatch(shufflePlaylist());
    };

    function handleRepeat() {
        if (!isLooping && !isRepeatingOnce) {
            setIsLooping(true);
            setIsRepeatingOnce(false);
        } else if (isLooping && !isRepeatingOnce) {
            setIsLooping(false);
            setIsRepeatingOnce(true);
        } else {
            setIsLooping(false);
            setIsRepeatingOnce(false);
        }
    }

    return (
        <>
            {songsData && (
                <motion.div
                    title="Click to open the playlist details"
                    initial={false}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push("/watch");
                    }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", ease: "easeInOut" }}
                    className={clsx([
                        "absolute w-full backdrop-blur-sm",
                        "bottom-0",
                        "h-20",
                        "flex items-center justify-between",
                        "px-2 sm:px-4",
                        "bg-gradient-to-l from-accent300/40 to-accent500/30",
                        "cursor-pointer",
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
                            onClick={(ev) => {
                                ev.stopPropagation();
                            }}
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
                            <Slider.Track className="relative w-full h-1 bg-white rounded-md cursor-pointer">
                                <Slider.Range className="absolute h-full bg-accent200 rounded-md" />
                            </Slider.Track>

                            <Slider.Thumb
                                className={clsx([
                                    "cursor-pointer",
                                    "block w-4 h-4 rounded-2xl bg-bgLight",
                                ])}
                                aria-label="Volume"
                            />
                        </Slider.Root>
                    </motion.div>

                    {/* Song Details */}

                    <motion.div
                        className={clsx([
                            "pl-2",
                            "sm:pl-5",
                            "md:pl-10",
                            "relative",
                            "song-details-wrapper",
                            "flex items-center justify-between",
                            "h-full",
                            "w-2/3 sm:w-2/5",
                            "max-w-3/5",
                        ])}
                        onClick={() => {
                            togglePlayerMode();
                        }}
                    >
                        {/* Album art & Song details*/}
                        <div
                            className={clsx([
                                "flex w-[70%] items-start h-full",
                            ])}
                        >
                            <motion.div
                                className={clsx([
                                    "album-art-container",
                                    "self-center",
                                    "aspect-square",

                                    "h-3/5 w-auto",

                                    "overflow-hidden rounded-sm",

                                    "mr-3",
                                ])}
                            >
                                <Image
                                    unoptimized
                                    className={clsx([
                                        "object-cover h-full scale-[135%]",
                                    ])}
                                    src={songDetails.thumbnail.url}
                                    alt="Song thumbnail"
                                    width={songDetails.thumbnail.width}
                                    height={songDetails.thumbnail.height}
                                />
                            </motion.div>
                            <div
                                className={clsx(["max-w-7/12", "self-center"])}
                            >
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
                            onClick={(ev) => {
                                ev.stopPropagation();
                                handlePrevious();
                            }}
                        >
                            <Image
                                src={prevButoonIcon}
                                alt="previous button"
                                className={clsx(["w-[70%] h-auto"])}
                            />
                        </PlayerButton>

                        <PlayerButton
                            disabled={isBuffering}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                handlePlayPause();
                            }}
                            className={clsx([
                                "w-16 h-16",
                                "disabled:opacity-50",
                                { "animate-spin": isBuffering }, // Add spinning animation when buffering
                            ])}
                        >
                            {isPlaying ? (
                                <Image
                                    src={pauseIcon}
                                    alt="pause button"
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
                            onClick={(ev) => {
                                ev.stopPropagation();
                                handleNext();
                            }}
                        >
                            <Image
                                src={nextButtonIcon}
                                alt="next button"
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
                            disabled={songsData.length === 0}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                handleShuffle();
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
                            onClick={(ev) => {
                                ev.stopPropagation();
                                handleRepeat();
                            }}
                        >
                            <Image
                                src={isRepeatingOnce ? repeatOnce : repeat}
                                alt="repeat button"
                                className={clsx(["w-[70%] h-auto"], {
                                    "opacity-40":
                                        !isLooping && !isRepeatingOnce,
                                })}
                            />
                        </PlayerButton>
                    </div>
                </motion.div>
            )}

            {/* Only for mobile design */}

            <AnimatePresence>
                {pathname === "/watch" && songsData && (
                    <>
                        <motion.div
                            key={0}
                            initial={{ top: "100%", opacity: 0 }}
                            animate={{ top: "0", opacity: 1 }}
                            exit={{ top: "100%", opacity: 0 }}
                            className={clsx([
                                "flex sm:hidden",
                                "z-[1]",
                                "absolute inset-0",
                                "backdrop:sm",
                                "bg-gradient-to-b from-accent400/70 to-bgDark/90 backdrop-blur-sm",
                                "flex-col items-center justify-between",
                                "px-4",
                            ])}
                        >
                            <div className={clsx(["h-10 w-full flex justify-end"])}>
                            </div>
                            <div
                                className={clsx([
                                    "album-art-container",
                                    "w-auto h-auto aspect-square max-w-[85%]",
                                    "overflow-hidden rounded-md",
                                ])}
                            >
                                <Image
                                    unoptimized
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
                            <div
                                className={clsx(["song-controls-container w-full"])}
                            >
                                <Slider.Root
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                    }}
                                    onValueCommit={(values) => {
                                        setIsDraggingSlider(false);
                                    }}
                                    onValueChange={(values) =>
                                        onSliderValueChange(values[0])
                                    }
                                    value={[currentTime]}
                                    style={{
                                        userSelect: "none",
                                        touchAction: "none",
                                    }}
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
                                        disabled={songsData.length === 0}
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            handleShuffle();
                                        }}
                                    >
                                        <Image
                                            src={shuffleIcon}
                                            alt="shuffle button"
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
                                        disabled={isBuffering}
                                        onClick={() => handlePlayPause()}
                                        className={clsx([
                                            "flex items-center justify-center",
                                            "w-20 h-20",
                                            "bg-accent400",
                                            { "animate-spin": isBuffering },
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
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            handleRepeat();
                                        }}
                                    >
                                        <Image
                                            src={
                                                isRepeatingOnce
                                                    ? repeatOnce
                                                    : repeat
                                            }
                                            alt="repeat button"
                                            className={clsx(["w-[70%] h-auto"], {
                                                "opacity-40":
                                                    !isLooping && !isRepeatingOnce,
                                            })}
                                        />
                                    </PlayerButton>
                                </div>
                            </div>
                            <div
                                className={clsx([
                                    "h-[10%] w-full flex justify-center items-center",
                                ])}
                            >
                                <PlayerButton
                                    className={clsx(["w-max px-5"])}
                                    onClick={() => {
                                        setShowUplist(true);
                                    }}
                                >
                                    Up next 
                                </PlayerButton>
                                <PlayerButton
                                    className={clsx([
                                        "absolute right-5 cursor-pointer",
                                    ])}
                                    onClick={() => {
                                        router.replace("/");
                                    }}
                                >
                                    <Image src={downIcon} alt="donw arrow" />
                                </PlayerButton>
                            </div>
                        </motion.div>
                        <SongList
                            isOpen={showUplist && pathname == "/watch"}
                            key={1}
                            className={clsx(["sm:hidden z-[1]"])}
                            songsData={songsData}
                            exitFn={() => {
                                setShowUplist(false);
                            }}
                        />
                    </>
                )}

            </AnimatePresence>
        </>
    );
}

type SongsListProps = {
    songsData: Song[];
    exitFn: () => void;
    isOpen: boolean;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function SongList(props: SongsListProps) {
    const { songsData, className, exitFn, isOpen } = props;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ top: "100%", opacity: 0 }}
                    animate={{ top: "0%", opacity: 1 }}
                    exit={{ top: "100%", opacity: 0 }}
                    className={clsx([
                        className,
                        "bg-bgDark/70 backdrop-blur-md",
                        "song-upnext-list absolute inset-0",
                        "flex flex-col justify-end",
                    ])}
                >
                    <h2 className={clsx(["w-full text-center py-4 text-xl"])}>Up Next</h2>
                    <div
                        className={clsx([
                            "h-4/5",
                            "px-2",
                            "overflow-y-scroll",
                            "rounded-t-xl",
                        ])}
                    >
                        {songsData.map((song, idx) => (
                            <SongCard
                                className={clsx(["mx-0"])}
                                key={song.videoId}
                                data={song}
                                orientation="row"
                            />
                        ))}
                    </div>
                    <div
                        className={clsx([
                            "relative",
                            "h-[10%]",
                            "w-full",
                            "flex items-center justify-center",
                        ])}
                    >
                        <PlayerButton
                            className={clsx(["bg-accent400 w-[80%]"])}
                            onClick={() => {
                                exitFn();
                            }}
                        >
                            <span>Hide</span>{" "}
                            <Image src={downIcon} alt="Hide the uplist" />
                        </PlayerButton>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}

export default MiniMusicPlayer;
