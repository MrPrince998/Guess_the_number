import { Session } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { supabase, supabaseAdmin } from "../lib/supabase";

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: UserProfile | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
};

type UserProfile = {
  id: string;
  created_at: string;
  username: string;
  email: string;
  user_images: string | null;
  level: number;
  experience: number;
  coin: number;
  theme_type: string;
  is_online?: boolean;
  game_played: number;
  games_won: number;
  games_lost: number;
  invite_code: string;
};

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  handleDeleteAccount: async () => {},
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
  const { data: userData, isLoading: userLoading } = useQuery({
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

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
          console.log("User change received!", payload);

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
    console.log(sessionData?.access_token);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      queryClient.setQueryData(["session"], session);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        session: sessionData ?? null,
        mounting: sessionLoading || userLoading,
        user: userData ?? null,
        isLoggedIn: !!sessionData,
        logout,
        handleDeleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
