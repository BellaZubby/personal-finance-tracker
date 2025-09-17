"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation, useResolveResetCodeMutation } from '@/app/utils/authApi';
import Link from 'next/link';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import AuthGate from '@/app/components/AuthGate';
import { APIError } from '@/app/shared/types';




const ResetPasswordSetup = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // used to extract email and reset token embedded in the reset link
    const code = searchParams.get("code");

    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [token, setToken] = useState<string | null> (null);

    const [resolveResetCode] = useResolveResetCodeMutation();
    const [resetPassword, {isLoading}] = useResetPasswordMutation();


    useEffect(() => {
        const resolveCode = async () => {
          if (!code) {
          router.push("/signin");
          return;
        }

        try {
          const result = await resolveResetCode(code).unwrap();
          setToken(result.token);
        } catch (err:unknown) {
          const message =
          typeof err === "object" && err !== null && "data" in err
            ? (err as APIError).data?.message || "Invalid or expired reset link"
            : "An unexpected error occurred.";
        setError(message);
        }
        }

        resolveCode();
        
    }, [code, resolveResetCode, router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setValidationError("");
        setNewPassword(e.target.value);
    }
    const validatePasswordInput = () => {
        let error = ""
        // validation for email
        if (!newPassword.trim()) {
          error = "Email is required";
        }
        setValidationError(error);
        return error === ""; // returns true if valid
      };
    

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (validatePasswordInput()) {

            try {
            
            const result = await resetPassword({token: token!, newPassword}). unwrap(); // using type assertion to tell TS that email and token are not null values.

            setSuccessMessage(result.message);

            setTimeout(() => {
                 router.push("/signin");
            }, 2000)
        } catch(err:unknown) {
            if (typeof err === "object" && err !== null && "data" in err) {
          const message =
            (err as APIError).data?.message || "Password Reset Failed";
          setError(message);
        } else {
          setError("An unexpected error occurred.");
        }
        }

        }
    }


  return (
    <AuthGate redirectTo='/'>
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">

        <div className="flex flex-col items-center justify-center mb-10">
                  <Link className="flex items-center justify-center" href="/">
                    <Image
                      src={"https://res.cloudinary.com/dxveggtpi/image/upload/q_auto,f_auto/LogoMakr-2ziVYh_co1n4b.ico"}
                      alt="Akulyst-logo"
                      width={80}
                      height={80}
                    />
                  </Link>
                 <h2 className="text-xl font-bold text-center text-textColor mt-7">Reset Password</h2>
                </div>
        <div>
          <div  className='relative'>
             <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded outline-0"
        />

         <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer"
                >
                  {passwordVisible? <FaEye /> : <FaEyeSlash />}
                </button>
          </div>
        {validationError && (
            <p className="text-red-500 text-sm ml-3 mt-1">{validationError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`${isLoading ? "bg-sunPurple/50 text-black/20":"bg-sunPurple text-white"} w-full  py-2 rounded cursor-pointer`}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p> }
      </form>
    </main>
    </AuthGate>
     
  )
}

export default ResetPasswordSetup