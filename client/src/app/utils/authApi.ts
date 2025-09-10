import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthFormData } from "../components/AuthForm";
import { baseQueryWithRefresh } from "./baseQueryWithRefresh";

export const authApi = createApi({
  reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl:
//     process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
//     credentials: "include", // sends cookies with every request
//   }),
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (data: AuthFormData) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    signinUser: builder.mutation({
      query: (data: { email: string; password: string }) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: { email: string; otp: string }) => ({
        url: "/auth/verification",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    // resolve reset-code

    resolveResetCode: builder.mutation({
  query: (code: string) => ({
    url: "/auth/resolve-code",
    method: "POST",
    body: { code },
  }),
}),

    
    resetPassword: builder.mutation({
      // query: (data: { email: string; token: string; newPassword: string }) => ({
      query: (data: {token: string; newPassword: string }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation <void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // update user profile (first and/or lastname)
    updateUser: builder.mutation({
      query: (data: {firstName?: string; lastName?: string}) => ({
        url: "/auth/update-user",
        method: "PATCH",
        body: data,  
    }),
    }),

    // delete user account
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/delete-user",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useSigninUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
  useResolveResetCodeMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = authApi;
