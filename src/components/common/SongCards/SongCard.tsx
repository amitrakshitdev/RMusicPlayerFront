import { playNow } from "@/store/playlistSlice";
import { Song } from "@/types/song";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import AlbumArt from "../AlbumArt/AlbumArt";
import { HTMLAttributes } from "react";

type SongCardProps = {
    data: Song;
    orientation?: "row" | "col";
} & HTMLAttributes<HTMLDivElement>;
export default function SongCard(props: SongCardProps) {
    const { data: songData, orientation = "row", className } = props;
    const dispatch = useDispatch();
    function onSongClick() {
        dispatch(playNow(songData));
    }
    return (
        <div onClick={onSongClick}
            className={clsx(
                className,
                ["flex items-center", "cursor-pointer select-none"],
                `flex-${orientation}`,
                orientation === "col" && "h-60 w-50",
                orientation === "row" && "h-16 max-w-60 gap-x-2",
            )}
        >
            <AlbumArt
                className={clsx(orientation === "row" && "h-full")}
                src={songData.thumbnail.url}
                width={songData.thumbnail.width}
                height={songData.thumbnail.height}
            />
            <div
                className={clsx([
                    "relative",
                    orientation === "col" && "w-full",
                    orientation === "row" && "w-2/3",
                ])}
            >
                <h3
                    className={clsx([
                        "w-full overflow-hidden whitespace-nowrap overflow-ellipsis",
                        "text-base",
                        "my-1",
                    ])} title={songData.title}
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
    );
}

