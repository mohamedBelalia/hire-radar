"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Loader2,
  User as UserIcon,
  Lock,
  Bell,
  Star,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth/hook";
import {
  useCandidateProfile,
  useUpdateCandidateProfile,
} from "@/features/profile/hooks";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
} from "@/features/profile/hooks";
import { githubConnect, getConnectedAccounts } from "@/features/auth/api";
import type { User } from "@/types";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProfileContentProps {
  defaultTab?: string;
}

export default function ProfileContent({
  defaultTab = "profile",
}: ProfileContentProps) {
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData as User | undefined;
  const userId = useCurrentUserId();
  const [activeTab, setActiveTab] = useState(defaultTab);

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
  const { data: employerProfile, isLoading: isLoadingEmployer } =
    useEmployerProfile(userId);
  const updateCandidate = useUpdateCandidateProfile(userId);
  const updateEmployer = useUpdateEmployerProfile(userId);

  const isLoading =
    currentUser?.role === "candidate" ? isLoadingCandidate : isLoadingEmployer;
  const profile =
    currentUser?.role === "candidate" ? candidateProfile : employerProfile;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
  });

  const queryClient = useQueryClient();

  // Fetch connected accounts from backend
  const { data: connectedAccountsData } = useQuery({
    queryKey: ["connected-accounts"],
    queryFn: getConnectedAccounts,
    retry: false,
  });

  // Map connected accounts to state
  const connectedAccounts = {
    github:
      connectedAccountsData?.connected_accounts?.some(
        (acc) => acc.provider === "github" && acc.connected,
      ) || false,
    google:
      connectedAccountsData?.connected_accounts?.some(
        (acc) => acc.provider === "google" && acc.connected,
      ) || false,
    twitter: false, // Not implemented yet
  };

  // Check URL params for OAuth callback results
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("github_linked") === "success") {
        toast.success("GitHub account connected successfully!");
        queryClient.invalidateQueries({ queryKey: ["connected-accounts"] });
        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);
      } else if (params.get("error")) {
        const error = params.get("error");
        toast.error(`Failed to connect GitHub: ${error}`);
        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [queryClient]);

  // Update form data when profile loads
  // Note: This syncs form state with async profile data - necessary use case
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "candidate" && candidateProfile) {
        setFormData({
          firstName: candidateProfile.full_name?.split(" ")[0] || "",
          lastName:
            candidateProfile.full_name?.split(" ").slice(1).join(" ") || "",
          email: candidateProfile.email || currentUser.email || "",
          role: "Product Designer",
          companyName: "",
          phone: candidateProfile.phone || "",
          location: candidateProfile.location || "",
          bio: candidateProfile.bio || "",
          website: "",
        });
      } else if (currentUser.role === "employer" && employerProfile) {
        // For employers, show company name as first name
        setFormData({
          firstName: employerProfile.full_name?.split(" ")[0] || "",
          lastName:
            employerProfile.full_name?.split(" ").slice(1).join(" ") || "",
          companyName: employerProfile.company_name || "",
          email: employerProfile.email || currentUser.email || "",
          role: "Employer",
          phone: employerProfile.phone || "",
          location: employerProfile.location || "",
          bio: employerProfile.bio || "",
          website: employerProfile.website || "",
        });
      } else {
        // Fallback to currentUser data if profile not loaded yet
        setFormData({
          firstName: currentUser.full_name?.split(" ")[0] || "",
          lastName: currentUser.full_name?.split(" ").slice(1).join(" ") || "",
          email: currentUser.email || "",
          role:
            currentUser.role === "candidate" ? "Product Designer" : "Employer",
          companyName: "",
          phone: currentUser.phone || "",
          location: currentUser.location || "",
          bio: currentUser.bio || "",
          website: "",
        });
      }
    }
  }, [profile, candidateProfile, employerProfile, currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.role === "candidate") {
      try {
        await updateCandidate.mutateAsync({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
        });
        toast.success("Profile updated successfully!");
      } catch {
        toast.error("Failed to update profile. Please try again.");
      }
    } else if (currentUser?.role === "employer") {
      try {
        await updateEmployer.mutateAsync({
          email: formData.email,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          company_name: formData.companyName || undefined,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
          website: formData.website || undefined,
        });
        toast.success("Profile updated successfully!");
      } catch {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleConnectAccount = async (
    account: "github" | "google" | "twitter",
  ) => {
    if (account === "github") {
      try {
        const { auth_url } = await githubConnect();
        // Redirect to GitHub OAuth
        window.location.href = auth_url;
      } catch (error) {
        toast.error("Failed to initiate GitHub connection");
      }
    } else if (account === "google") {
      // Google OAuth is handled separately for login, not account linking
      toast.info("Google account is linked via login");
    } else {
      toast.info("Twitter connection not yet implemented");
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
      <TabsList className="grid w-full grid-cols-3">
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
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentUser?.role === "employer" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    updateCandidate.isPending || updateEmployer.isPending
                  }
                >
                  {(updateCandidate.isPending || updateEmployer.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    {connectedAccounts.github ? "Connected" : "Not Connected"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleConnectAccount("github")}
              >
                {connectedAccounts.github ? "Disconnect" : "Connect"}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">Google</div>
                  <div className="text-sm text-muted-foreground">
                    {connectedAccounts.google ? "Connected" : "Not Connected"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleConnectAccount("google")}
              >
                {connectedAccounts.google ? "Disconnect" : "Connect"}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">Twitter</div>
                  <div className="text-sm text-muted-foreground">
                    {connectedAccounts.twitter ? "Connected" : "Not Connected"}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleConnectAccount("twitter")}
              >
                {connectedAccounts.twitter ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>
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
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Password</div>
                <div className="text-sm text-muted-foreground">
                  Last changed 3 months ago
                </div>
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">MacBook Pro</span>
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    San Francisco, CA • Active now
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold">iPhone 12</div>
                  <div className="text-sm text-muted-foreground">
                    New York, NY • 2 days ago
                  </div>
                </div>
              </div>
              <Button variant="outline">Revoke</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Email notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications about account activity
                </div>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Push notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications about account activity
                </div>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Monthly newsletter</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications about account activity
                </div>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">Security alerts</div>
                <div className="text-sm text-muted-foreground">
                  Receive notifications about account activity
                </div>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
