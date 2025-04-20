import {
    playNow,
    selectCurrentSongId,
    queueSong,
    playNext,
    removeSongFromQueue,
    selectCurrentPlaylist,
} from "@/store/playlistSlice";
import { Song } from "@/types/song";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import AlbumArt from "../AlbumArt/AlbumArt";
import { HTMLAttributes, useMemo } from "react";
import ContextMenuWrapper from "../ContextMenuWrapper/ContextMenuWrapper";

type SongCardProps = {
    data: Song;
    orientation?: "row" | "col";
} & HTMLAttributes<HTMLDivElement>;
export default function SongCard(props: SongCardProps) {
    const currentSongId = useSelector(selectCurrentSongId);
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const { data: songData, orientation = "row", className } = props;
    const dispatch = useDispatch();
    function onSongClick() {
        dispatch(playNow(songData));
    }

    const menuItems = useMemo(() => {
        return [
            {
                elemen: <div>Play Next</div>,
                onClick: () => {
                    dispatch(playNext(songData));
                },
                isDisabled: songData.videoId === currentSongId,
            },
            {
                elemen: <div>Add to Que</div>,
                onClick: () => {
                    dispatch(queueSong(songData));
                },
                isDisabled: songData.videoId === currentSongId,
            },
            {
                elemen: <div>Add to PlayList</div>,
                onClick: () => {
                    console.log("Add to PlayList");
                },
                isDisabled: false,
            },
            {
                elemen: <div>Remove from Que</div>,
                onClick: () => {
                    dispatch(removeSongFromQueue(songData.videoId));
                },
                isDisabled: ((): boolean => {
                    if (currentSongId === songData.videoId) {
                        return true;
                    } else {
                        const findIndex = currentPlaylist.findIndex(
                            (song) => song.videoId === songData.videoId
                        );
                        return findIndex === -1;
                    }
                })(),
            },
        ];
    }, [currentPlaylist, currentSongId, dispatch, songData]);
    
    return (
        <ContextMenuWrapper
            className={clsx([className, "relative", "max-w-64", "sm:max-w-72"])}
            menuItems={menuItems}
        >
            <div
                onClick={onSongClick}
                className={clsx(
                    [
                        "flex items-center",
                        "cursor-pointer select-none",
                        "p-1.5",
                        "rounded-md",
                    ],
                    `flex-${orientation}`,
                    orientation === "col" && "h-60 w-50",
                    orientation === "row" && "h-20 w-full gap-x-2",
                    "hover:bg-bgLight/10 transition-colors duration-200",
                    "active:bg-gradient-to-tr from-accent300/20 to-transparent",
                    "m-0.5",
                    currentSongId === songData.videoId && [
                        "border border-accent100/60 rounded-md bg-gradient-to-tr from-accent300/20 to-transparent",
                    ]
                )}
            >
                <AlbumArt
                    className={clsx(
                        orientation === "row" && "h-full",
                        "relative"
                    )}
                    src={songData.thumbnail.url}
                    width={songData.thumbnail.width}
                    height={songData.thumbnail.height}
                    shouldShowPlayAnimation={currentSongId === songData.videoId}
                />
                <div
                    className={clsx([
                        "relative",
                        orientation === "col" && "w-full",
                        orientation === "row" && "w-3/4",
                    ])}
                >
                    <h3
                        className={clsx([
                            "w-full overflow-hidden whitespace-nowrap overflow-ellipsis",
                            "text-base",
                            "my-1",
                        ])}
                        title={songData.title}
                    >
                        {songData.title}
                    </h3>
                    <h4
                        className={clsx([
                            "w-full overflow-hidden whitespace-nowrap overflow-ellipsis",
                            "text-sm opacity-50",
                        ])}
                        title={songData.channelTitle}
                    >
                        {songData.channelTitle}
                    </h4>
                </div>
            </div>
        </ContextMenuWrapper>
    );
}
