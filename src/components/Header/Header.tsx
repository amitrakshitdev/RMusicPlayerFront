import clsx from "clsx";
import Image from "next/image";
import rMusicLogo from "@/assets/images/RMusic Logo.svg";
import Link from "next/link";
import SearchInput from "../common/SearchInput/SearchInput";

export default function Header() {
    return (
        <div
            className={clsx([
                "h-16",
                "items-center",
                "grid grid-cols-3",
                "px-2 lg:px-20",
            ])}
        >
            <Link href={"/"}>
                <Image
                    unoptimized
                    src={rMusicLogo}
                    alt="R Music Logo"
                    className={clsx(["cursor-pointer"])}
                />
            </Link>
            <SearchInput />
            <div className={clsx(["justify-self-end"])}>
                Login-WIP
            </div>
        </div>
    );
}
