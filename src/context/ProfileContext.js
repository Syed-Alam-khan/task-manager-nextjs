'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import profileService from '@/services/profileService';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      if (data.success) {
        setProfile(data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const data = await profileService.updateProfile(profileData);
      if (data.success) {
        setProfile(data.user);
        setUser(data.user);
        toast.success(data.message || 'Profile updated successfully');
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      const data = await profileService.changePassword(passwordData);
      if (data.success) {
        toast.success(data.message || 'Password changed successfully');
        return data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
