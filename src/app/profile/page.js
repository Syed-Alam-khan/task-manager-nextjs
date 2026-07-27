'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import {
  IoPersonOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoSaveOutline,
  IoKeyOutline,
} from 'react-icons/io5';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, fetchProfile, updateProfile, changePassword } = useProfile();

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        name: profile?.name || user?.name || '',
        email: profile?.email || user?.email || '',
      });
    }
  }, [profile, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      toast.error('Name and email are required.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile(profileForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your profile information and security settings
          </p>
        </div>

        {/* Profile Card */}
        <Card
          title="Personal Information"
          subtitle="Update your display name and email address"
          action={
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
              {profileForm.name ? profileForm.name[0] : 'U'}
            </div>
          }
        >
          {loading && !profile ? (
            <Loader text="Loading profile..." />
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  icon={IoPersonOutline}
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={IoMailOutline}
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={IoSaveOutline}
                  loading={isUpdatingProfile}
                >
                  Save Profile
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Password Security Card */}
        <Card
          title="Security & Password"
          subtitle="Change your password to keep your account secure"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              icon={IoLockClosedOutline}
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                icon={IoKeyOutline}
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                  if (passwordError) setPasswordError('');
                }}
                required
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={IoKeyOutline}
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  });
                  if (passwordError) setPasswordError('');
                }}
                error={passwordError}
                required
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                icon={IoKeyOutline}
                loading={isChangingPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
