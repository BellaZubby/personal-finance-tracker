"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/app/utils/authApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/store/authSlice";
import { RootState } from "@/app/store";
import AuthGate from "@/app/components/AuthGate";
import { APIError, OTPError } from "@/app/shared/types";

interface verificationResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token: string;
}

const VerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState(" ");

  const router = useRouter();

  const dispatch = useDispatch();

  // Get email from Redux or localstorge
  const reduxEmail = useSelector(
    (state: RootState) => state.auth.pendingUser?.email
  ); // access Redux email

  // Safely access localStorage on client
  useEffect(() => {
    if (reduxEmail) {
      setEmail(reduxEmail);
    } else {
      const storedUser = localStorage.getItem("pendingUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setEmail(parsed.email);
      }
    }
  }, [reduxEmail]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleVerify = async () => {
    setError("");
    setSuccessMessage("");

    if (!otp.trim()) {
      setError("please enter OTP sent to your email");
      return;
    }

    // Simulate OTP verification
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    try {
      const result: verificationResponse = await verifyOtp({
        email,
        otp,
      }).unwrap();

      dispatch(
        login({
          user: result.user,
          token: result.token,
        })
      );

      setSuccessMessage(result.message);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        // Show resend button only if OTP expired
        const errorData = (err as OTPError).data;
        setError(errorData?.message || "Verification failed");

        // Show resend button only if OTP expired
        if (errorData?.code === "OTP_EXPIRED") {
          setShowResend(true);
        }
      } else {
        setError("Verification failed");
      }
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    setResendMessage("");
    setShowResend(false);
    setOtp("");

    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    try {
      const result = await resendOtp({ email }).unwrap();
      setResendMessage(result.message); // e.g. "OTP resent successfully"
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message = (err as APIError).data?.message || "Failed to resend OTP";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
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
            <p className="text-textColor mt-3 px-3">
              Please enter OTP sent to registered Email to verify your account
            </p>
          </div>
          <div className="space-y-4 border border-sunPurple sm:max-w-md sm:mx-auto py-20 px-10 rounded-2xl mx-5">
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
                setResendMessage("");
              }}
              disabled={isLoading}
              placeholder="Enter OTP"
              className="block border-b border-sunPurple outline-0 w-full placeholder:text-sm"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {successMessage && (
              <p className="text-green-600 text-sm mb-2">{successMessage}</p>
            )}
            {resendMessage && (
              <p className="text-green-600 text-sm mb-2">{resendMessage}</p>
            )}

            {showResend ? (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sunPurple text-sm underline mt-4"
              >
                {isResending ? "Resending OTP..." : "Resend OTP"}
              </button>
            ) : (
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className={` ${
                  isLoading
                    ? "bg-sunPurple/50 text-black/20"
                    : "bg-sunPurple text-white hover:bg-sunPurple/40 hover:text-gray-700"
                }  px-6 py-3 rounded-full text-md font-semibold shadow-md  transition-colors duration-500 ease-in-out cursor-pointer`}
              >
                {isLoading ? "Verifying" : "Verify"}
              </button>
            )}
          </div>
        </div>
      </main>
    </AuthGate>
  );
};

export default VerificationPage;
