import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { PostHook, getErrorMessage } from "@/hook/apiCall";
import toast from "react-hot-toast";
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
    .min(6, "Password must be at least 6 characters long"),
});

const signupSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const LoginSignup = ({ open, onOpenChange, onSuccess }: LoginSignupProps) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [isLoginEyeOn, setLoginIsEyeOn] = useState<boolean>(false);
  const [isSignupEyeOn, setSignupIsEyeOn] = useState<boolean>(false);
  const [isConfirmPasswordEyeOn, setConfirmPasswordEyeOn] =
    useState<boolean>(false);

  // Check if user is authenticated
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // API hooks
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

  // Form handling
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

  // ✅ FIXED: Login handler without problematic GetHook call
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
          } else {
            toast.error("Login failed - invalid response");
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  // Signup handler
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
          if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Account created successfully! Please login.");
            setTab("login");
            formik.resetForm();
          } else {
            toast.error("Registration failed - invalid response");
          }
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
  };

  // Cancel handler
  const handleCancel = () => {
    onOpenChange(false);
    formik.resetForm();
  };

  // Tab change handler
  const handleTabChange = (value: string) => {
    setTab(value as "login" | "signup");
    formik.resetForm();
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  const handleEyeToggle = (type: "login" | "signup" | "confirm") => {
    if (type === "login") {
      setLoginIsEyeOn(!isLoginEyeOn);
    } else if (type === "signup") {
      setSignupIsEyeOn(!isSignupEyeOn);
    } else if (type === "confirm") {
      setConfirmPasswordEyeOn(!isConfirmPasswordEyeOn);
    }
  };

  // If user is authenticated, show logout dropdown
  if (isAuthenticated) {
    return (
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <div></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is not authenticated, show login/signup dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          <Tabs value={tab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-200">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={tab}
            >
              {/* Login Tab */}
              <TabsContent value="login">
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your credentials to access your account
                    </p>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : ""
                        }
                        disabled={isLoading}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={isLoginEyeOn ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`${
                            formik.touched.password && formik.errors.password
                              ? "border-red-500"
                              : ""
                          } pr-10`}
                          disabled={isLoading}
                        />
                        <span
                          className="cursor-pointer absolute right-3 top-1 text-gray-500"
                          onClick={() => handleEyeToggle("login")}
                        >
                          {isLoginEyeOn ? <Eye /> : <EyeClosed />}
                        </span>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => toast.loading("Feature coming soon!")}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full"
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
                        className="w-full"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Create an account</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your details to get started
                    </p>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        name="username"
                        placeholder="yourusername"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.username && formik.errors.username
                            ? "border-red-500"
                            : ""
                        }
                        disabled={isLoading}
                      />
                      {formik.touched.username && formik.errors.username && (
                        <p className="text-sm text-red-500">
                          {formik.errors.username}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : ""
                        }
                        disabled={isLoading}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={isSignupEyeOn ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`${
                            formik.touched.password && formik.errors.password
                              ? "border-red-500"
                              : ""
                          } pr-10`}
                          disabled={isLoading}
                        />
                        <span
                          className="cursor-pointer absolute right-3 top-1 text-gray-500"
                          onClick={() => handleEyeToggle("signup")}
                        >
                          {isSignupEyeOn ? <Eye /> : <EyeClosed />}
                        </span>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-sm text-red-500">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirmPassword">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-confirmPassword"
                          type={isConfirmPasswordEyeOn ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`${
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                              ? "border-red-500"
                              : ""
                          } pr-10`}
                          disabled={isLoading}
                        />
                        <span
                          className="cursor-pointer absolute right-3 top-1 text-gray-500"
                          onClick={() => handleEyeToggle("confirm")}
                        >
                          {isConfirmPasswordEyeOn ? <Eye /> : <EyeClosed />}
                        </span>
                      </div>
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {formik.errors.confirmPassword}
                          </p>
                        )}
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full"
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
                        className="w-full"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>

                  <p className="text-xs text-muted-foreground text-center px-4">
                    By clicking "Sign Up", you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignup;
