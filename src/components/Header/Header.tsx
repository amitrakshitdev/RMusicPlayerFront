import clsx from "clsx";

export default function Header() {
    return (
        <div className={clsx(["h-14",
            "flex items-center justify-center"
        ])}>
            <input type="text" className={clsx(["w-1/3 h-8", "border border-accent100/10 rounded-sm",
                "bg-gradient-to-r from-accent500/10 to-accent400/5",
                "pl-4",
                "text-white/80", "outline-0", "font-century-gothic",
                "focus:bg-accent500/20"
            ])} placeholder="Search music..."/>
        </div>
    )
}