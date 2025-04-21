import clsx from "clsx";
import Image from "next/image";
import rMusicLogo from "@/assets/images/RMusic Logo.svg";
import Link from "next/link";

export default function Header() {
    return (
        <div className={clsx(["h-16",
            "items-center",
            "grid grid-cols-3",
            "lg:px-20 px-10"
        ])}>
            <Link href={"/"}>
                <Image unoptimized src={rMusicLogo} alt="R Music Logo" className={clsx(["cursor-pointer"])}/>
            </Link>
            <input type="text" className={clsx(["w-auto h-8", "border border-accent100/10 rounded-sm",
                "flex-['1.5 1 1.5']",
                "bg-gradient-to-r from-accent500/10 to-accent400/5",
                "pl-4",
                "text-white/80", "outline-0", "font-century-gothic",
                "focus:bg-accent500/20"
            ])} placeholder="Search music..."/>
            <div className={clsx(["justify-self-end"])}>
                Login
            </div>
        </div>
    )
}