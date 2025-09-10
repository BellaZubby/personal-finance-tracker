'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrateAuth } from '@/app/store/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return null;
};

export default AuthInitializer;