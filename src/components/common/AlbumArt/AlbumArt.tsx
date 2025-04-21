import Image from "next/image";
import { HTMLAttributes } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import songPlayingIcon from "./song-playing.svg";
import { useSelector } from "react-redux";
import { selectIsPlaying } from "@/store/playlistSlice";
type AlbumArtProps = {
    src: string | StaticImageData;
    width: number;
    height: number;
    shouldShowPlayAnimation?: boolean;
} & HTMLAttributes<HTMLImageElement>;

function AlbumArt(props: AlbumArtProps) {
    const {
        src,
        width,
        height,
        className,
        shouldShowPlayAnimation = false,
    } = props;
    const isGlobalPlaying = useSelector(selectIsPlaying);
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
                unoptimized
                className={clsx(["object-cover h-full scale-[135%]"])}
                src={src}
                alt="Song album art"
                width={width}
                height={height}
            />
            {shouldShowPlayAnimation && isGlobalPlaying && (
                <Image
                    src={songPlayingIcon}
                    alt="Animation playing on the song card"
                    className={clsx(["absolute", "w-full h-full inset-0",
                        "scale-75 opacity-70 animate-bounce transition duration-[3000ms]",
                        ""
                    ])}
                />
            )}
        </motion.div>
    );
}

export default AlbumArt;
