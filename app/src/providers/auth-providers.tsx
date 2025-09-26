import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { AppState } from "react-native";
import { supabase, supabaseAdmin } from "../lib/supabase";
import {
  achievements,
  AuthData,
  userAchievements,
  UserProfile,
} from "../types/types";

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  handleDeleteAccount: async () => {},
  levelData: [],
  achievements: [],
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  // fetch session
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    refetchOnWindowFocus: false,
  });

  // fetch user when sesssion exists
  const { data: userData, isLoading: userLoading } = useQuery<UserProfile>({
    queryKey: ["user", sessionData?.user.id],
    queryFn: async () => {
      if (!sessionData) return null;
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", sessionData?.user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(sessionData?.user.id),
    staleTime: Infinity,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // 30 seconds
  });

  const channel = supabase
    .channel("user-updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `id=eq.${sessionData?.user.id}`,
      },
      (payload) => {
        queryClient.setQueryData(["user", sessionData?.user.id], payload.new);
      }
    )
    .subscribe();

  const fetchUserAchievements = async (userId: string) => {
    const { data, error } = await supabase
      .from("player_achievements")
      .select("*")
      .eq("player_id", userId);
    if (error) throw error;
    return data as userAchievements[];
  };

  // fetch user achievements
  const { data: userAchievements } = useQuery<userAchievements[]>({
    queryKey: ["user-achievements", sessionData?.user.id],
    queryFn: () => fetchUserAchievements(sessionData!.user.id),
    enabled: Boolean(sessionData?.user.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });

  // fetch all achievements
  const { data: allAchievements } = useQuery<achievements[]>({
    queryKey: ["all-achievements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("achievements").select("*");
      if (error) throw error;
      return data as achievements[];
    },
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // update user online in every 30 seconds
  useEffect(() => {
    if (!userData?.id) return;

    const interval = setInterval(async () => {
      await supabase
        .from("players")
        .update({ is_online: true })
        .eq("id", userData?.id);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [userData?.id]);

  // update user online based on app state
  useEffect(() => {
    if (!userData?.id) return;

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppstate) => {
        if (nextAppstate === "active") {
          await supabase
            .from("players")
            .update({ is_online: true })
            .eq("id", userData?.id);
        } else {
          await supabase
            .from("players")
            .update({ is_online: false })
            .eq("id", userData?.id);
        }
      }
    );

    return () => subscription.remove();
  }, [userData?.id]);

  const { data: levelData } = useQuery({
    queryKey: ["levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("level_thresholds")
        .select("*");

      console.log("Supabase data:", data, "error:", error);
      return data;
    },
    enabled: true,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  console.log("levelData", levelData);

  useEffect(() => {
    if (!sessionData?.user.id) return;

    // subscribe to updates for this user
    const channel = supabase
      .channel("user-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `id=eq.${sessionData.user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ["user", sessionData.user.id],
          });
          queryClient.setQueryData(
            ["user", sessionData.user.id],
            (old: UserProfile) => ({
              ...old,
              ...payload.new,
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionData?.user.id, queryClient]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      queryClient.setQueryData(["session"], null);
      queryClient.setQueryData(["user"], null);
    }
  };

  const deleteAccount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        user.id
      );

      if (deleteError) {
        console.error("Error deleting user data:", deleteError.message);
        throw deleteError;
      }

      // Then sign out (you can't delete auth.users from client side)
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Logout error:", signOutError.message);
      } else {
        queryClient.setQueryData(["session"], null);
        queryClient.setQueryData(["user"], null);
      }
    } catch (error: any) {
      console.error("Delete account error:", error.message);
    }
  };

  // listen for auth changes

  // const deleteAccount = async (userId: string) => {
  //   console.log("Deleting account for userId:", userId);
  //   try {
  //     const { data, error } = await supabase.functions.invoke("delete-user", {
  //       body: { userId: userData.id },
  //     });

  //     if (error) {
  //       console.error("Error deleting user data:", error);
  //       console.error("Error deleting user data:", error.message);
  //       throw error;
  //     }

  //     console.log("User deletion response:", data);

  //     await logout();
  //   } catch (error: any) {
  //     console.error("Delete account error:", error.message);
  //   }
  // };

  const handleDeleteAccount = async () => {
    if (!userData?.id) return;
    await deleteAccount();
    // await deleteAccount(userData.id);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      queryClient.setQueryData(["session"], session);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const data = { ...userData, achievements: userAchievements };

  return (
    <AuthContext.Provider
      value={{
        session: sessionData ?? null,
        mounting: sessionLoading || userLoading,
        user: userData
          ? {
              ...userData,
              id: userData.id ?? "",
              achievements: userAchievements ?? [],
            }
          : null,
        isLoggedIn: !!sessionData,
        logout,
        handleDeleteAccount,
        levelData: levelData || [],
        achievements: allAchievements || [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
