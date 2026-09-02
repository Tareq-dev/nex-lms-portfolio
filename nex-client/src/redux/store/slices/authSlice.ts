import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  AuthPayload,
  AuthSession,
  AuthUser,
  Role,
} from "@/types/auth";

export interface AuthState {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;

  /*
   * localStorage check শেষ হয়েছে কি না।
   *
   * এটি false থাকা অবস্থায় আমরা জানি না
   * user সত্যিই logged out, নাকি session
   * এখনো localStorage থেকে load হয়নি।
   */
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setAuth: (
      state,
      action: PayloadAction<AuthPayload>,
    ) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    hydrateAuth: (
      state,
      action: PayloadAction<
        AuthSession | null
      >,
    ) => {
      const savedSession =
        action.payload;

      if (savedSession) {
        state.user = savedSession.user;
        state.role = savedSession.role;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      }

      state.hydrated = true;
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.hydrated = true;
    },

    updateAuthUser: (
      state,
      action: PayloadAction<
        Partial<AuthUser>
      >,
    ) => {
      if (!state.user) {
        return;
      }

      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const {
  setAuth,
  hydrateAuth,
  logout,
  updateAuthUser,
} = authSlice.actions;

export default authSlice.reducer;