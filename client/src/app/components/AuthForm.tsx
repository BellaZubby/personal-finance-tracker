"use client"; // required for client side reactivity
import React, { useState } from "react";
import Link from "next/link";
import AuthBtn from "./AuthBtn";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

// defining types for form data.
// This defines the shape of the form data to be collected
export interface AuthFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// defining props for form since authForm is a component that would be shared
interface AuthFormProps {
  mode: "signup" | "signin"; //determines which fields to show
  onSubmit: (data: AuthFormData) => void; // callback to parent page
  loading?: boolean;
}

const AuthForm = ({ mode, onSubmit, loading }: AuthFormProps) => {
  const router = useRouter();
  // local state to track form input values
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // to handle form input error state
  const [showPassword, setShowPassword] = useState(false); // to toggle password visibility

  // Handle input changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // defines a function that takes a change event from an HTML input element
    const { name, value } = e.target; // destructures name and value from the input element that trigger the event
    /**
     * (prev) => ... is a callback function that receives the previous state (prev)
     * ...prev: Creates a shallow copy of the previous state, to prevent any form of mutation
     * [name]: value: dynamically updates state based on the name attribute (computed property name) with the value provided by user
     */
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clears error with any input change
  };

  // Simple validation logic
  const validate = () => {
    /**
     * - type { [key: string]: string } means the object can have any number of keys, as long as each key is a string
     * - Each key maps to a string value (the error message)
     */
    const newErrors: { [key: string]: string } = {}; // This creates an empty object to store error messages

    if (mode === "signup") {
      // validation for first name
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required";
      } else if (formData.firstName.length < 3) {
        newErrors.firstName = "First name must be at aleast 3 characters";
      } else if (formData.firstName.length > 40) {
        newErrors.firstName = "First name must be at most 40 characters";
      }
      //   validation for last name
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
      } else if (formData.lastName.length < 3) {
        newErrors.firstName = "First name must be at aleast 3 characters";
      } else if (formData.lastName.length > 40) {
        newErrors.firstName = "First name must be at most 40 characters";
      }
    }

    // validation for email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // validation for password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    /**
     * Returns `true` if there are **no errors** (i.e. the form is valid).
    - `Object.keys(newErrors)` gives us an array of error keys.
    - If the array is empty, the form passed validation.
     */
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and pass data to parent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // ensures we have a valid data entry before submission
      onSubmit(formData); // send form data to parent page
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-sunPurple sm:max-w-md sm:mx-auto py-20 px-10 rounded-2xl mx-5"
    >
      {/* show name fields only for signup */}
      {mode === "signup" && (
        <>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              className="block border-b border-sunPurple outline-0 w-full placeholder:text-sm"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              className="block border-b border-sunPurple outline-0 w-full placeholder:text-sm mt-7"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </>
      )}

      {/* common fields for both signup and signin */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="block border-b border-sunPurple outline-0 w-full placeholder:text-sm mt-7"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="block border-b border-sunPurple outline-0 w-full placeholder:text-sm mt-7"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <AuthBtn className="w-full mt-5" loading={loading}>
        {/* using ternary to conditionally show the text content of the button based on the mode (signup or signin) */}
        {loading
          ? "Processing..."
          : mode === "signup"
          ? "Create Account"
          : "Login"}
      </AuthBtn>

      <div className="mt-5 text-sm">
        {mode === "signin" ? (
          <div className="flex flex-col xs:flex-row gap-3 md:gap-0 items-center justify-between">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-sunPurple font-semibold">
                Sign up
              </Link>
            </p>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sunPurple font-semibold cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="text-sunPurple font-semibold">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
