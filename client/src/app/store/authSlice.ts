/**
 * createSlice - A helper from Redux Toolkit to define state + reducers in one place
 * PayloadAction - A TypeScript type that helps define the shape of data passed to actions.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// define the type and structure for form inputs/user object
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// defines the structure of our authentication state with a user object and a boolean: isAuthenticated
interface AuthState {
  user: User | null; // holds logged-in user's info or null if logged out
  isAuthenticated: boolean; // tracks login status
  token: string | null; // Add this
  pendingUser: User | null;
  rehydrated: boolean;
}

// defines the initial state/default state when the app loads: no user and authentication is set to false
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  pendingUser: null,
  rehydrated: false,
};

// we create our slice (that updates the state based on executed actions) which is imported into the store and becomes globally accessible
const authSlice = createSlice({
  // creates the reducer and actions
  name: "auth",
  initialState, // app initial stat
  reducers: {
    // actions used to update state

    // when a user signup before verification

    setPendingUser: (state, action: PayloadAction<User>) => {
      state.pendingUser = action.payload;

      localStorage.setItem("pendingUser", JSON.stringify(action.payload));
    },

    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      // sets the user and flips the auth flag to true
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.pendingUser = null;

      // Persist token to localStorage
      // localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.removeItem("pendingUser");
      state.rehydrated = true;
    },

    logout: (state) => {
      // clears the user and resets the flag to false
      state.user = null;
      // state.token = null;
      state.isAuthenticated = false;
      state.pendingUser = null;
      state.rehydrated = false;

      // localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("pendingUser");
    },

    rehydrateAuth: (state) => {
      // const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (user) {
        // state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }

      state.rehydrated = true;
    },

    updateProfile: (state, action) => {
      if (!state.user) return; // ✅ Exit early if user is null
      const { firstName, lastName } = action.payload;
      if (firstName) state.user.firstName = firstName;
      if (lastName) state.user.lastName = lastName;

      // Save updated user to localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, setPendingUser, rehydrateAuth, updateProfile } =
  authSlice.actions; // we export both actions to use in components

export default authSlice.reducer; // export the reducer to plug into your Redux store
