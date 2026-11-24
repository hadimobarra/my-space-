"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { CommandMenuProps } from "./command-menu";

const CommandMenu = dynamic(() => import("./command-menu").then((m) => m.CommandMenu), { ssr: false });

/** Loads the command menu the first time someone opens it (⌘K / Ctrl+K or the search button). */
export function CommandMenuLoader(props: Omit<CommandMenuProps, "onClose">) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("command-menu", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("command-menu", show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return open ? <CommandMenu {...props} onClose={() => setOpen(false)} /> : null;
}
