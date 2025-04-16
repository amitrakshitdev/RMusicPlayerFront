import { Song } from "@/types/song";
import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import { HTMLAttributes } from "react";
import musicIcon from "@/components/YoutubeMusicPlayer/assets/music.svg"
type SongCardProps = {
    data: Song;
    orientation?: "row" | "col"
};
export default function SongCard(props: SongCardProps) {
    const { data: songData, orientation = "row" } = props;
    
    return (
        <div className={clsx(["flex items-center"],
            `flex-${orientation}`,
            orientation === "col" && "h-60 w-50",
            orientation === "row" && "h-16 w-60 sm:w-[300px] gap-x-2"
        )}>
            <AlbumArt
                className={clsx(
                    orientation === "row" && "h-full"
                )}
                src={songData.thumbnail.url}
                width={songData.thumbnail.width}
                height={songData.thumbnail.height}
            />
            <div className={clsx(["relative",
                orientation === "col" && "w-full",
                orientation === "row" && "w-2/3",
            ])}>
                <h3 className={clsx(["w-full overflow-hidden whitespace-nowrap overflow-ellipsis",
                    "text-base", "my-1"
                ])}>{songData.title}</h3>
                <h4 className={clsx(["w-full overflow-hidden whitespace-nowrap overflow-ellipsis",
                    "text-sm opacity-50"
                ])}>{songData.channelTitle}</h4>
            </div>
        </div>
    );
}

type AlbumArtProps = {
    src: string;
    width: number;
    height: number;
} & HTMLAttributes<HTMLImageElement>;

function AlbumArt(props: AlbumArtProps) {
    const { src, width, height, className } = props;
    return (
        <motion.div
            className={clsx(
                [
                    "album-art-container",
                    "aspect-square",
                    "overflow-hidden rounded-sm",
                ],
                className
            )}
        >
            <Image
                className={clsx(["object-cover h-full scale-[135%]"])}
                src={src}
                alt="Song album art"
                width={width}
                height={height}
            />
        </motion.div>
    );
}
