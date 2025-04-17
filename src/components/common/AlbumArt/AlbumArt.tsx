import Image from "next/image";
import { HTMLAttributes } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";

type AlbumArtProps = {
    src: string | StaticImageData;
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

export default AlbumArt;