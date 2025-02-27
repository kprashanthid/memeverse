import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Meme = {
  id: string;
  name: string;
  url: string;
  liked?: boolean;
};

type MemeState = {
  likedMemes: Meme[];
  uploadedMemes: Meme[];
  fetchedMemes: Meme[];
};

const initialState: MemeState = {
  likedMemes: [],
  uploadedMemes: [],
  fetchedMemes: [],
};

const memeSlice = createSlice({
  name: "memes",
  initialState,
  reducers: {
    setFetchedMemes: (state, action: PayloadAction<Meme[]>) => {
      state.fetchedMemes = action.payload;
    },
    addFetchedMeme: (state, action: PayloadAction<Meme>) => {
      const exists = state.fetchedMemes.find((m) => m.id === action.payload.id);
      if (!exists) {
        state.fetchedMemes.push(action.payload);
      }
    },
    toggleLike: (state, action: PayloadAction<Meme>) => {
      const exists = state.likedMemes.find(
        (meme) => meme.id === action.payload.id
      );
      if (exists) {
        state.likedMemes = state.likedMemes.filter(
          (meme) => meme.id !== action.payload.id
        );
      } else {
        state.likedMemes.push(action.payload);
      }
    },
    uploadMeme: (state, action: PayloadAction<Meme>) => {
      state.uploadedMemes.push(action.payload);
    },
  },
});

export const { toggleLike, uploadMeme, setFetchedMemes, addFetchedMeme } =
  memeSlice.actions;
export default memeSlice.reducer;
