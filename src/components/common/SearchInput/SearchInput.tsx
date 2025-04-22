"use client"

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

export default function SearchInput() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    function handleSubmit(ev: FormEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        if (inputRef.current && inputRef.current.value.trim()) {
            const hostname = window.location.origin;
            const searchQuery = inputRef.current.value.trim();
            const searchUrl = `${hostname}/search?q=${encodeURIComponent(searchQuery)}`;
            router.push(searchUrl);
            inputRef.current.blur();
        } else {
            // alert("Please enter a valid search query.");
        }
    }
    return (
        <form onSubmit={(ev)=> {handleSubmit(ev)}}>
            <input
                ref={inputRef}
                type="text"
                className={clsx([
                    "w-full h-8",
                    "border border-accent100/10 rounded-sm",
                    "bg-gradient-to-r from-accent500/10 to-accent400/5",
                    "pl-1 sm:pl-3 md:pl-4",
                    "text-white/80",
                    "outline-0",
                    "font-century-gothic",
                    "focus:bg-accent500/20",
                ])}
                placeholder="Search music..."
            />
        </form>
    );
}