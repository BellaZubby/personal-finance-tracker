"use client";
import React, { useState } from "react";
import AuthForm from "@/app/components/AuthForm";
import { AuthFormData } from "@/app/components/AuthForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setPendingUser } from "../../store/authSlice";
import { AppDispatch } from "@/app/store";
import { useSignupUserMutation } from "@/app/utils/authApi";
import { isErrorWithMessage } from "@/app/shared/errFunction";
import AuthGate from "@/app/components/AuthGate";

interface RegisterResponse {
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const Signup = () => {
  const [signupUser, { isLoading }] = useSignupUserMutation();
  const router = useRouter(); // use to navigate programmatically

  const dispatch = useDispatch<AppDispatch>(); // used to dispatch the redux actions

  // local state for feedback messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (data: AuthFormData) => {
    setErrorMessage(""); // clears previous errors
    setSuccessMessage("");

    try {
      const result: RegisterResponse = await signupUser(data).unwrap(); // unwrap gives you the actual response

      dispatch(
        setPendingUser({
          id: result.data.id,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
        })
      );

      setSuccessMessage(result.message);

      // navigate to verification page after short delay

      setTimeout(() => {
        router.push("/verification");
      }, 1500);

      // return () => clearTimeout(timer);
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <AuthGate redirectTo="/">
      <main className="min-h-screen flex flex-col justify-center font-inter py-10">
        <div className="">
          <div className="flex flex-col items-center justify-center mb-10">
            <Link className="flex items-center justify-center" href="/">
              <Image
                src={"https://res.cloudinary.com/dxveggtpi/image/upload/q_auto,f_auto/LogoMakr-2ziVYh_co1n4b.ico"}
                alt="Akulyst-logo"
                width={80}
                height={80}
              />
            </Link>
            <p className="text-textColor mt-3">
              <span className="text-xl font-playfair text-sunPurple font-bold">
                Sign up
              </span>{" "}
              to get started with smarter solutions.
            </p>
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

          <AuthForm mode="signup" onSubmit={handleSignup} loading={isLoading} />

          {/* Loading indicator */}
          {isLoading && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Processing your request...
            </p>
          )}
        </div>
      </main>
    </AuthGate>
  );
};

export default Signup;
