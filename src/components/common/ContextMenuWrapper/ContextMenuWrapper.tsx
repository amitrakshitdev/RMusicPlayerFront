import clsx from "clsx";
import { ContextMenu } from "radix-ui";
import React, { HTMLAttributes } from "react";

type ContextMenuWrapperProps = {
    menuItems: Array<{
        elemen: React.JSX.Element;
        onClick: () => void;
        isDisabled: boolean;
    }>;
} & React.PropsWithChildren<HTMLAttributes<HTMLSpanElement>>;

function ContextMenuWrapper(props: ContextMenuWrapperProps) {
    const { children, className, menuItems } = props;

    return (
        <ContextMenu.Root>
            <ContextMenu.Trigger className={clsx([className])}>
                {children}
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Content
                    className={clsx([
                        "bg-accent300/40",
                        "rounded-md",
                        "backdrop-blur-md",
                        "z-10"
                    ])}
                >
                    {menuItems
                        .filter((item) => !item.isDisabled)
                        .map((item, idx) => (
                            <ContextMenu.Item
                                key={idx}
                                onClick={item.onClick}
                                className={clsx([
                                    "w-full px-4 py-2",
                                    "hover:bg-white/20 active:bg-white/40 hover:outline-0",
                                    "cursor-pointer",
                                ])}
                            >
                                {item.elemen}
                            </ContextMenu.Item>
                        ))}
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
}

export default ContextMenuWrapper;
