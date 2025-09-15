import { useLogoutUserMutation } from "../utils/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useRouter } from "next/navigation";
import { APIError } from "./types";

export const useLogoutHandler = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap(); // pass empty object
      dispatch(logout());
      router.replace("/signin");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message = (err as APIError).data?.message || "Logout failed";
        console.error(message);
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };

  return handleLogout;
};
