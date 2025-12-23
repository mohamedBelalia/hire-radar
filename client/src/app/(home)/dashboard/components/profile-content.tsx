"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Loader2,
  User as UserIcon,
  Lock,
  Bell,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth/hook";
import {
  useCandidateProfile,
  useUploadCandidateCV,
} from "@/features/profile/hooks";
import { useEmployerProfile } from "@/features/profile/hooks";
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/features/notifications/hooks";
import type { User, Notification } from "@/types";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import apiClient from "@/lib/apiClient";
import { getToken } from "@/lib";
import { formatDistanceToNow } from "date-fns";
import { DeleteAccount } from "@/components/delete-account";
import CareerTab from "@/components/career-tab";
import UploadCV from "@/components/profile/UploadCV";
import MyJobsPage from "../employer/my-jobs/page";

interface ProfileContentProps {
  defaultTab?: string;
}

interface PasswordUpdatePayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type UserProfile = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  headLine: string;
  github_url?: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
};

export default function ProfileContent({
  defaultTab = "profile",
}: ProfileContentProps) {
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData as User | undefined;
  const userId = useCurrentUserId();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateCandidateLoading, setUpdateCandidateLoading] = useState(false);
  const [updateEmployerLoading, setUpdateEmployerLoading] = useState(false);
  const uploadCV = useUploadCandidateCV(userId);

  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useNotifications();
  const markAsReadMutation = useMarkNotificationRead();

  const notifications = (notificationsData || []) as Notification[];

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read);
    try {
      await Promise.all(
        unreadNotifications.map((n) => markAsReadMutation.mutateAsync(n.id)),
      );
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleUpdatePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.trim().length < 8 || confirmPassword.trim().length < 8) {
      setError("Password must be at least 8 charachters");
      return;
    }

    const payload: PasswordUpdatePayload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    setLoading(true);
    try {
      const response = await apiClient.put(
        "/api/auth/update-password",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response.status === 200) {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Failed to update password.");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (
        typeof err === "object" &&
        err !== null &&
        apiError.response?.data?.message
      ) {
        setError(apiError.response.data.message);
      } else {
        setError((err as Error).message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  // Listen for tab changes from sidebar
  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };

    window.addEventListener("tab-change", handleTabChange as EventListener);
    return () => {
      window.removeEventListener(
        "tab-change",
        handleTabChange as EventListener,
      );
    };
  }, []);

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Fetch profile data based on role
  const { data: candidateProfile, isLoading: isLoadingCandidate } =
    useCandidateProfile(userId);
  const { isLoading: isLoadingEmployer } = useEmployerProfile(userId);

  const isLoading =
    currentUser?.role === "candidate" ? isLoadingCandidate : isLoadingEmployer;

  // Form state
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    headLine: "",
    github_url: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
  });

  // Update form data when profile loads
  // Note: This syncs form state with async profile data - necessary use case
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "candidate") {
        setFormData({
          firstName: currentUser.full_name?.split(" ")[0] || "",
          lastName: currentUser.full_name?.split(" ").slice(1).join(" ") || "",
          email: currentUser.email || currentUser.email || "",
          companyName: currentUser.companyName || "",
          headLine: currentUser.headLine || "",
          github_url: currentUser.github_url || "",
          phone: currentUser.phone || "",
          location: currentUser.location || "",
          bio: currentUser.bio || "",
          website: currentUser.website,
        });
      } else if (currentUser.role === "employer") {
        setFormData({
          firstName: currentUser.full_name?.split(" ")[0] || "",
          lastName: currentUser.full_name?.split(" ").slice(1).join(" ") || "",
          email: currentUser.email || currentUser.email || "",
          companyName: currentUser?.companyName || "",
          headLine: currentUser?.headLine || "",
          phone: currentUser?.phone || "",
          location: currentUser?.location || "",
          bio: currentUser?.bio || "",
          website: currentUser?.website || "",
        });
      } else {
        setFormData({
          firstName: currentUser.full_name?.split(" ")[0] || "",
          lastName: currentUser.full_name?.split(" ").slice(1).join(" ") || "",
          email: currentUser.email || "",
          companyName: "",
          github_url: "",
          headLine: "",
          phone: currentUser.phone || "",
          location: currentUser.location || "",
          bio: currentUser.bio || "",
          website: "",
        });
      }
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.role === "candidate") {
      try {
        setUpdateCandidateLoading(true);
        const response = await apiClient.put(
          `/api/candidates/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        if (response.status === 200) {
          toast.success("Profile updated successfully!");
        }
      } catch {
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setUpdateCandidateLoading(false);
      }
    } else if (currentUser?.role === "employer") {
      try {
        setUpdateEmployerLoading(true);
        const response = await apiClient.put(
          `/api/employers/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        if (response.status === 200) {
          toast.success("Profile updated successfully!");
        }
      } catch {
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setUpdateEmployerLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className={`grid w-full grid-cols-4`}>
        <TabsTrigger value="profile">
          <UserIcon className="mr-2 h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security">
          <Lock className="mr-2 h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </TabsTrigger>
        {currentUser?.role === "candidate" && (
          <TabsTrigger value="career">
            <GraduationCap className="mr-2 h-4 w-4" />
            Career
          </TabsTrigger>
        )}

        {currentUser?.role === "employer" && (
          <TabsTrigger value="jobs">
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            Posted jobs
          </TabsTrigger>
        )}
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* First name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="Jhon"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Last name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    placeholder="Oracle"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+212627096056"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <Label htmlFor="headLine">Headline</Label>
                  <Input
                    id="headLine"
                    placeholder="Full stack engineer"
                    value={formData.headLine}
                    onChange={(e) =>
                      handleInputChange("headLine", e.target.value)
                    }
                  />
                </div>

                {/* Website / Location / Github */}
                <div
                  className={`grid gap-6 md:col-span-2 ${currentUser?.role === "candidate"
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
                    }`}
                >
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="www.oracle.com"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="213 LOT LOUBANE HAMA"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>

                  {currentUser?.role === "candidate" && (
                    <div className="space-y-2">
                      <Label htmlFor="github_url">Github url</Label>
                      <Input
                        id="github_url"
                        placeholder="www.github.com/username"
                        value={formData.github_url}
                        onChange={(e) =>
                          handleInputChange("github_url", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell us about you..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateCandidateLoading || updateEmployerLoading}
                >
                  {(updateCandidateLoading || updateEmployerLoading) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* CV Upload Section - Only for Candidates */}
        {currentUser?.role === "candidate" && (
          <UploadCV
            profile={
              candidateProfile || {
                id: userId || "",
                full_name: currentUser?.full_name || "",
                email: currentUser?.email || "",
                skills: [],
                cv_url: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            }
            onUpload={async (file) => {
              try {
                await uploadCV.mutateAsync(file);
                toast.success("CV uploaded successfully!");
              } catch (error) {
                toast.error("Failed to upload CV. Please try again.");
                throw error;
              }
            }}
            isUploading={uploadCV.isPending}
          />
        )}
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Enabled
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Delete your account</div>
                <div className="text-sm text-muted-foreground">
                  Permanently removing a user account and all its associated
                  data from a platform or service
                </div>
              </div>
              <DeleteAccount />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change your password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button
                className="w-full"
                onClick={handleUpdatePassword}
                disabled={
                  loading ||
                  newPassword === "" ||
                  currentPassword === "" ||
                  confirmPassword === ""
                }
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Career Tab */}
      <TabsContent value="career" className="space-y-6">
        <CareerTab />
      </TabsContent>

      <TabsContent value="jobs" className="space-y-6">
        <MyJobsPage />
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent activity and system updates
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={
                isLoadingNotifications ||
                !notifications.some((n) => !n.is_read)
              }
            >
              Mark all as read
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoadingNotifications ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="space-y-4">
                  <div
                    className={`flex items-start gap-4 rounded-lg p-4 transition ${!notification.is_read
                        ? "border bg-muted/30"
                        : "opacity-70"
                      }`}
                  >
                    <span
                      className={`mt-2 h-2 w-2 rounded-full ${!notification.is_read ? "bg-primary" : "bg-transparent"
                        }`}
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {notification.created_at
                            ? formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true },
                            )
                            : ""}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      {!notification.is_read && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              markAsReadMutation.mutate(notification.id)
                            }
                          >
                            Mark as read
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
