import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";
const storedDarkMode = isBrowser
  ? localStorage.getItem("darkMode") === "true"
  : false;

const initialState = {
  darkMode: storedDarkMode,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
