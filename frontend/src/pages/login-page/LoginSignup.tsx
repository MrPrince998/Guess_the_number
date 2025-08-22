import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Sword, UserPlus, User } from "lucide-react";
import { PostHook, getErrorMessage } from "@/hook/apiCall";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LoginSignupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  setOpenDialog: (
    dialog:
      | "first"
      | "second"
      | "third"
      | "profile"
      | "createRoom"
      | "joinRoom"
      | null
  ) => void;
}

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Validation schemas
const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const signupSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      "Must contain uppercase, lowercase, and number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const LoginSignup = ({
  open,
  onOpenChange,
  onSuccess,
  setOpenDialog,
}: LoginSignupProps) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState({
    login: false,
    signup: false,
    confirm: false,
  });
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const loginMutation = PostHook<AuthResponse, LoginPayload>(
    "post",
    "/api/auth/login",
    ["auth"]
  );

  const signupMutation = PostHook<AuthResponse, SignupPayload>(
    "post",
    "/api/auth/register",
    ["auth"]
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: tab === "login" ? loginSchema : signupSchema,
    onSubmit: async (values) => {
      if (tab === "login") {
        handleLogin(values);
      } else {
        handleSignup(values);
      }
    },
  });

  const handleLogin = (values: typeof formik.values) => {
    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (data) => {
          if (data?.token && data?.user) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success(`Welcome back, ${data.user.username}!`);
            onOpenChange(false);
            formik.resetForm();
            onSuccess?.();
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleSignup = (values: typeof formik.values) => {
    signupMutation.mutate(
      {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: (data) => {
          toast.success(`${data.message} `);
          setTab("login");
          formik.resetForm();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    onOpenChange(false);
    onSuccess?.(); // Optional: Call success callback if needed
  };

  const handleCancel = () => {
    onOpenChange(false);
    formik.resetForm();
  };

  const handleTabChange = (value: string) => {
    setTab(value as "login" | "signup");
    formik.resetForm();
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  const handleProfileClick = () => {
    setOpenDialog("profile");
  };

  return (
    <>
      {!isAuthenticated ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <User className="text-white" size={20} />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-xl border-0 bg-gradient-to-b from-indigo-50 to-blue-100 overflow-hidden p-0 shadow-xl">
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white">
              <DialogHeader>
                <div className="flex items-center justify-center gap-3">
                  <Sword className="w-8 h-8" />
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {tab === "login" ? "Welcome Back" : "Join the Duel"}
                  </DialogTitle>
                </div>
              </DialogHeader>
            </div>

            {/* Main content */}
            <div className="p-6">
              <Tabs value={tab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 bg-indigo-100 mb-6">
                  <TabsTrigger
                    value="login"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Login Form */}
                    {tab === "login" && (
                      <TabsContent value="login" className="space-y-4">
                        <form
                          onSubmit={formik.handleSubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="login-email"
                              className="text-indigo-700"
                            >
                              Email
                            </Label>
                            <Input
                              id="login-email"
                              type="email"
                              name="email"
                              placeholder="your@email.com"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={cn(
                                "bg-white border-indigo-200",
                                formik.touched.email &&
                                  formik.errors.email &&
                                  "border-red-500"
                              )}
                              disabled={isLoading}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <p className="text-sm text-red-500">
                                {formik.errors.email}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="login-password"
                              className="text-indigo-700"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="login-password"
                                type={showPassword.login ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cn(
                                  "bg-white border-indigo-200 pr-10",
                                  formik.touched.password &&
                                    formik.errors.password &&
                                    "border-red-500"
                                )}
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                                onClick={() =>
                                  togglePasswordVisibility("login")
                                }
                              >
                                {showPassword.login ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                            {formik.touched.password &&
                              formik.errors.password && (
                                <p className="text-sm text-red-500">
                                  {formik.errors.password}
                                </p>
                              )}
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              className="text-sm text-indigo-600 hover:underline"
                              onClick={() =>
                                toast("Password reset coming soon!")
                              }
                            >
                              Forgot password?
                            </button>
                          </div>

                          <div className="space-y-3 pt-2">
                            <Button
                              type="submit"
                              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                              disabled={isLoading}
                            >
                              {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Login
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full py-3 border-indigo-300 hover:bg-indigo-50"
                              onClick={handleCancel}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    )}

                    {/* Signup Form */}
                    {tab === "signup" && (
                      <TabsContent value="signup" className="space-y-4">
                        <form
                          onSubmit={formik.handleSubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="signup-username"
                              className="text-indigo-700"
                            >
                              Username
                            </Label>
                            <Input
                              id="signup-username"
                              type="text"
                              name="username"
                              placeholder="duelmaster"
                              value={formik.values.username}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={cn(
                                "bg-white border-indigo-200",
                                formik.touched.username &&
                                  formik.errors.username &&
                                  "border-red-500"
                              )}
                              disabled={isLoading}
                            />
                            {formik.touched.username &&
                              formik.errors.username && (
                                <p className="text-sm text-red-500">
                                  {formik.errors.username}
                                </p>
                              )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="signup-email"
                              className="text-indigo-700"
                            >
                              Email
                            </Label>
                            <Input
                              id="signup-email"
                              type="email"
                              name="email"
                              placeholder="your@email.com"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={cn(
                                "bg-white border-indigo-200",
                                formik.touched.email &&
                                  formik.errors.email &&
                                  "border-red-500"
                              )}
                              disabled={isLoading}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <p className="text-sm text-red-500">
                                {formik.errors.email}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="signup-password"
                              className="text-indigo-700"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="signup-password"
                                type={showPassword.signup ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cn(
                                  "bg-white border-indigo-200 pr-10",
                                  formik.touched.password &&
                                    formik.errors.password &&
                                    "border-red-500"
                                )}
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                                onClick={() =>
                                  togglePasswordVisibility("signup")
                                }
                              >
                                {showPassword.signup ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                            {formik.touched.password &&
                              formik.errors.password && (
                                <p className="text-sm text-red-500">
                                  {formik.errors.password}
                                </p>
                              )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="signup-confirmPassword"
                              className="text-indigo-700"
                            >
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="signup-confirmPassword"
                                type={
                                  showPassword.confirm ? "text" : "password"
                                }
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cn(
                                  "bg-white border-indigo-200 pr-10",
                                  formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword &&
                                    "border-red-500"
                                )}
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700"
                                onClick={() =>
                                  togglePasswordVisibility("confirm")
                                }
                              >
                                {showPassword.confirm ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                  {formik.errors.confirmPassword}
                                </p>
                              )}
                          </div>

                          <div className="space-y-3 pt-2">
                            <Button
                              type="submit"
                              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                              disabled={isLoading}
                            >
                              {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Sign Up
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full py-3 border-indigo-300 hover:bg-indigo-50"
                              onClick={handleCancel}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500 text-center">
                            By signing up, you agree to our Terms and Privacy
                            Policy
                          </p>
                        </form>
                      </TabsContent>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
              onClick={handleProfileClick}
              aria-label="Profile"
            >
              <User className="text-white" size={20} />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default LoginSignup;
