"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ScrollIndicator() {
  const { t } = useTranslation();
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <span className="text-xs text-muted font-medium">{t("hero.scroll")}</span>
      <motion.div
        className="w-5 h-8 rounded-full border-2 border-muted/30 flex justify-center pt-1.5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-2 rounded-full bg-primary"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
