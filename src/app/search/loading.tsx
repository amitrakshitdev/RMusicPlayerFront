import clsx from "clsx";
import playIcon from "@/assets/images/play.svg";
import Image from "next/image";
export default function Loading() {
    return (
        <div
            className={clsx(["w-full h-full flex justify-center items-center"])}
        >
            <Image
                src={playIcon}
                alt="Loading animation"
                className={clsx(["animate-pulse w-1/5 h-1/5"])}
            />
        </div>
    );
}
