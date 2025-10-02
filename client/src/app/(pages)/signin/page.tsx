"use client";

import AuthForm from "@/app/components/AuthForm";
import { AuthFormData } from "@/app/components/AuthForm";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/app/store/authSlice";
import { AppDispatch } from "@/app/store";
import { useSigninUserMutation } from "@/app/utils/authApi";
import { useState } from "react";
import AuthGate from "@/app/components/AuthGate";
import { APIError } from "@/app/shared/types";

const Signin = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const [signinUser, { isLoading }] = useSigninUserMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignin = async (data: AuthFormData) => {
    setErrorMessage("");

    try {
      const result = await signinUser(data).unwrap();

      dispatch(
        login({
          user: result.user,
          // token: result.token,
        })
      );

      router.push("/dashboard");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message = (err as APIError).data?.message || "Login failed";
        setErrorMessage(message);

        // Redirect if user is unverified
        if (message.includes("User not verified")) {
          setTimeout(() => { // creates a little delay before the redirect
            router.push("/verification"); 
          }, 1500)
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
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
                src={
                  "https://res.cloudinary.com/dxveggtpi/image/upload/q_auto,f_auto/LogoMakr-2ziVYh_co1n4b.ico"
                }
                alt="Akulyst-logo"
                width={80}
                height={80}
              />
            </Link>
            <p className="text-textColor mt-3">
              Welcome back. Let&apos;s get you{" "}
              <span className="text-xl font-playfair text-sunPurple font-bold">
                signed in.
              </span>
            </p>
          </div>

          <div>
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
          </div>
          <AuthForm mode="signin" onSubmit={handleSignin} loading={isLoading} />
        </div>
      </main>
    </AuthGate>
  );
};

export default Signin;
