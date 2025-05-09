import clsx from "clsx";
import { JSX } from "react";

export default function PlayerButton(
    props: React.PropsWithChildren<React.ButtonHTMLAttributes<object>>
): JSX.Element {
    const { children, className, ...rest } = props;
    return (
        <button
            className={clsx(className, [
                "disabled:opacity-50",
                "cursor-pointer",
                "w-10 h-10",
                "m-0.5",
                "rounded-full",
                "flex items-center justify-center",
                "active:bg-white/20",
                "hover:scale-110"
            ])}
            {...rest}
        >
            {children}
        </button>
    );
}