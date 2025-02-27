import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import zoro from "../../app/profile/zoro.jpg";
import { StaticImageData } from "next/image";

type UserState = {
  name: string;
  bio: string;
  profilePic: StaticImageData | string;
};

const initialState: UserState = {
  name: "Guest",
  bio: "Meme lover!",
  profilePic: zoro,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;
