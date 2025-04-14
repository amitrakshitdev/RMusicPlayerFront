/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import clsx from "clsx";
import * as React from "react";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import Image from "next/image";
import { Slider } from "radix-ui";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import nextButtonIcon from "./assets/nextButton.svg";
import prevButoonIcon from "./assets/prevButton.svg";
import shuffleIcon from "./assets/shuffle.svg";
import repeat from "./assets/repeat.svg";
import repeatOnce from "./assets/repeatOnce.svg";
enum YT {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
}

type SongInfo = {
    kind: string;
    etag: string;
    id: {
        kind: string;
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
            };
            high: {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        liveBroadcastContent: string;
        publishTime: string;
    };
};

type YoutubeMusicPlayerProps = {
    videoId: string;
    songsData: Array<SongInfo>;
};
export default function YoutubeMusicPlayer(
    props: YoutubeMusicPlayerProps
): JSX.Element {
    // References
    const playerRef = useRef(null);
    const intervalRef = useRef<any>("");
    // States
    const [playerMode, setPlayerMode] = useState<"full" | "bottom">("full");
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [songDuration, setSongDuration] = useState<number>(100);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [isLooping, setIsLooping] = useState(true);
    const [isRepeatingOnce, setIsRepeatingOnce] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    // Props
    const { songsData } = props;

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

    const songDetails = useMemo(() => {
        const song = songsData[currentSongIndex];
        return {
            title: song.snippet.title,
            thumbnail: song.snippet.thumbnails,
            channelTitle: song.snippet.channelTitle,
            videoId: song.id.videoId,
        };
    }, [songsData, currentSongIndex]);

    const onReady = (event: any) => {
        playerRef.current = event.target;
        const duration = playerRef.current.getDuration();
        setSongDuration(duration);
    };

    const onPlayerStateChange = (event) => {
        const player = event.target;
        if (event.data === YT.PLAYING) {
            setIsPlaying(true);
            setSongDuration(event.target.getDuration());
        } else if (event.data === YT.PAUSED) {
            setIsPlaying(false);
        } else if (event.data === YT.ENDED) {
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
            
        }
    };

    useEffect(() => {
        const player = playerRef.current;
        if (!isDraggingSlider && isPlaying && player && player.getCurrentTime) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(()=> player.getCurrentTime());
            }, 1000);
            return () => clearInterval(intervalRef.current);
        }
    }, [isPlaying, isDraggingSlider]);

    function onSliderValueChange(value) {
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
                    (currentSongIndex - 1 + songsData.length) % songsData.length;
                setIsPlaying(false);
                setCurrentSongIndex(prevIndex);
            } else {
                console.log("more than 5", currentTime)
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
        } else if (player) {
            player.playVideo();
            player.seekTo(0);
            setIsPlaying(true);
        }
    }

    return (
        <div
            className={clsx([
                "fixed inset-0 bg-bgDark/80",
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
                    className={clsx(["object-cover h-full scale-[135%]"])}
                    src={songDetails.thumbnail.high.url}
                    alt="Song thumbnail"
                    width={songDetails.thumbnail.high.width}
                    height={songDetails.thumbnail.high.height}
                />
            </div>
            <div
                className={clsx(["song-details-wrapper", "my-4", "max-w-full"])}
            >
                <h2
                    className={clsx([
                        "font-bold text-xl max-w-full overflow-hidden",
                        "whitespace-nowrap overflow-ellipsis",
                    ])}
                >
                    {songDetails.title}
                </h2>
                <h4 className={clsx(["font-thin text-base font-mullish"])}>
                    {songDetails.channelTitle}
                </h4>
            </div>
            <div className={clsx(["song-controls-container w-full"])}>
                <Slider.Root
                    onValueCommit={(values) => {
                        setIsDraggingSlider(false);
                    }}
                    onValueChange={(values) => onSliderValueChange(values[0])}
                    value={[currentTime]}
                    style={{ userSelect: "none", touchAction: "none" }}
                    className={clsx(["relative flex items-center w-full h-10"])}
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
        </div>
    );
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

function PlayerButton(
    props: React.PropsWithChildren<React.ButtonHTMLAttributes<object>>
): JSX.Element {
    const { children, className, ...rest } = props;
    return (
        <button
            className={clsx(className, ["w-10 h-10", "m-0.5", "rounded-full"])}
            {...rest}
        >
            {children}
        </button>
    );
}
