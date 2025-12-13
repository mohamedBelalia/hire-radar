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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { User } from "@/types";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";

interface ProfileContentProps {
  defaultTab?: string;
}

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
    email: "",
    role: "",
  });

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    github: false,
    google: false,
    twitter: false,
  });

  // Update form data when profile loads
  // Note: This syncs form state with async profile data - necessary use case
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "candidate" && candidateProfile) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          firstName: candidateProfile.full_name?.split(" ")[0] || "",
          lastName:
            candidateProfile.full_name?.split(" ").slice(1).join(" ") || "",
          email: candidateProfile.email || currentUser.email || "",
          role: "Product Designer",
        });
      } else if (currentUser.role === "employer" && employerProfile) {
        // For employers, show company name as first name
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          firstName: employerProfile.company_name || "",
          lastName: "",
          email: employerProfile.email || currentUser.email || "",
          role: "Employer",
        });
      } else {
        // Fallback to currentUser data if profile not loaded yet
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          firstName: currentUser.full_name?.split(" ")[0] || "",
          lastName: currentUser.full_name?.split(" ").slice(1).join(" ") || "",
          email: currentUser.email || "",
          role:
            currentUser.role === "candidate" ? "Product Designer" : "Employer",
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
        });
        toast.success("Profile updated successfully!");
      } catch {
        toast.error("Failed to update profile. Please try again.");
      }
    } else if (currentUser?.role === "employer") {
      try {
        await updateEmployer.mutateAsync({
          email: formData.email,
        });
        toast.success("Profile updated successfully!");
      } catch {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleConnectAccount = (account: "github" | "google" | "twitter") => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [account]: !prev[account],
    }));
    toast.success(
      connectedAccounts[account]
        ? `${account.charAt(0).toUpperCase() + account.slice(1)} disconnected`
        : `${account.charAt(0).toUpperCase() + account.slice(1)} connected`,
    );
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
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
