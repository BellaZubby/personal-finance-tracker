"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const UserAvatar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated || !user) return null;

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "";
  return <div>{initials}</div>;
};

export default UserAvatar;
