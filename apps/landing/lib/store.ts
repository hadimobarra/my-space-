import { create } from "zustand";

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDarkMode: (value) => set({ isDarkMode: value }),
}));

interface NavStore {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useNavStore = create<NavStore>((set) => ({
  activeSection: "hero",
  setActiveSection: (section) => set({ activeSection: section }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));

interface CommandStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

interface LocaleStore {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: "en",
  setLocale: (locale) => set({ locale }),
}));
