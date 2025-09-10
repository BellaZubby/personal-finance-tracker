"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/app/utils/authApi";
import Link from "next/link";
import Image from "next/image";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
//   const router = useRouter();


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setValidationError("");
    setEmail(e.target.value);
}
const validateEmailInput = () => {
    let error = ""
    // validation for email
    if (!email.trim()) {
      error = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error = "Email is invalid";
    }
    setValidationError(error);
    return error === ""; // returns true if valid
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");
    setValidationError("");

    if (validateEmailInput()) {
      try {
        const result = await forgotPassword({ email }).unwrap();
        console.log(result);
        setSuccessMessage(result.message);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "data" in err) {
          const message =
            (err as any).data?.message || "Failed to send reset link";
          setError(message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 font-inter">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">

        <div className="flex flex-col items-center justify-center mb-10">
                  <Link className="flex items-center justify-center" href="/">
                    <Image
                      src={"/akulyst-logo.png"}
                      alt="Akulyst-logo"
                      width={80}
                      height={80}
                    />
                  </Link>
                 <h2 className="text-xl font-bold text-center text-textColor mt-7">Forgot Password</h2>
                </div>
        <div>
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded outline-0"
          />
          {validationError && (
            <p className="text-red-500 text-sm ml-3 mt-1">{validationError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`${isLoading ? "bg-sunPurple/50 text-black/20":"bg-sunPurple text-white"} w-full  py-2 rounded cursor-pointer`}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </main>
  );
};

export default ForgotPassword;
