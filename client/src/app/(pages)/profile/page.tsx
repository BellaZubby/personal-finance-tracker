"use client";
import React, { useEffect, useState } from "react";
import { logout } from "@/app/store/authSlice";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/utils/authApi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/app/store/authSlice";
import { RootState } from "@/app/store";
import ProtectedRoute from "@/app/components/protectedRoute";

const Profile = () => {
  // extract user and rehydration status from redux
  const user = useSelector((state: RootState) => state.auth.user);

  // RTK Query mutations
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  //  Local state for editing names
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [deleteSuccessMsg, deleteSuccessMsg] = useState("");

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  // Optional: dispatch to update Redux store
  const dispatch = useDispatch();
  const router = useRouter();

  // sync local state with Redux user once rehydrated
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
    }
  }, [user]);

  const handleUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // ✅ Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("First name and last name cannot be empty.");
      return;
    }

    try {
      const result = await updateUser({ firstName, lastName }).unwrap();

      localStorage.setItem("user", JSON.stringify(result.user));

      // ✅ Update Redux store if needed
      dispatch(updateProfile(result.user));
      setSuccessMessage(result.message);
      setEditing(false);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message = (err as any).data?.message || "Update failed";
        setErrorMessage(message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  //   set duration for successMessage display
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage(""); // Clear after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup on unmount or message change
    }
  }, [successMessage]);

  const handleDelete = async () => {
    try {
      await deleteUser().unwrap();

      setSuccessMessage("Account deleted successfully");

      setShowModal(false);

      // ✅ Optionally clear auth state or redirect
      setTimeout(() => {
        dispatch(logout());
        router.replace("/signin");
      }, 2500);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message = (err as any).data?.message || "Delete failed";
        setErrorMessage(message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
    // }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-inter">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-sunPurple text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <p className="text-gray-700 font-semibold">{user?.email}</p>
              <p className="text-sm text-gray-500">Registered Email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!editing}
                className={`${
                  editing
                    ? "focus:outline-none focus:ring-sunPurple focus:border-sunPurple border rounded-md"
                    : "bg-transparent border-b border-sunPurple"
                } mt-1 block w-full px-3 py-2`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!editing}
                className={`${
                  editing
                    ? "focus:outline-none focus:ring-sunPurple focus:border-sunPurple border rounded-md"
                    : "bg-transparent border-b border-sunPurple"
                } mt-1 block w-full px-3 py-2`}
              />
            </div>
            <div className="flex justify-between mt-6">
              {editing ? (
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="bg-sunPurple text-white px-4 py-2 rounded hover:bg-sunPurple/90 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="sm:bg-sunPurple text-sunPurple hover:underline font-semibold cursor-pointer sm:text-white sm:px-7 sm:py-2 sm:rounded-md sm:hover:text-gray-200  sm:hover:bg-sunPurple/80 transition duration-300 ease-in-out sm:hover:no-underline"
                >
                  Edit Name
                </button>
              )}

              <button
                onClick={() => setShowModal(true)}
                disabled={deleting}
                className="sm:bg-red-500 font-semibold cursor-pointer sm:text-white sm:px-5 sm:py-2 sm:rounded-md sm:hover:text-gray-200 sm:hover:bg-red-700 transition duration-300 ease-in-out text-red-500 hover:underline sm:hover:no-underline"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
            <div>
              {/* Feedback messages */}
              {successMessage && (
                <p className="text-green-600 text-center mb-4">
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-center mb-4">{errorMessage}</p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* start modal*/}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-inter">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete your account?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* end */}
    </ProtectedRoute>
  );
};

export default Profile;
