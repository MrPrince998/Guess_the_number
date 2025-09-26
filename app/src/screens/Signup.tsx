import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as zod from "zod";
import { supabase } from "../lib/supabase";
import { NavigationProp } from "../types/navigateProps.types";

const { width, height } = Dimensions.get("window");

const signupSchema = zod
  .object({
    username: zod
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: zod.string().email("Please enter a valid email address"),
    password: zod
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: zod
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = zod.infer<typeof signupSchema>;

const Signup = () => {
  const [passwordEyeOpen, setPasswordEyeOpen] = useState(false);
  const [confirmPasswordEyeOpen, setConfirmPasswordEyeOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const navigation = useNavigation<NavigationProp>();

  const buttonScale = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const strengthStyles = [
    styles.strength0,
    styles.strength1,
    styles.strength2,
    styles.strength3,
    styles.strength4,
  ];

  const { control, handleSubmit, formState, watch, reset } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (passwordValue) {
      if (passwordValue.length >= 8) strength += 1;
      if (/[A-Z]/.test(passwordValue)) strength += 1;
      if (/[0-9]/.test(passwordValue)) strength += 1;
      if (/[^A-Za-z0-9]/.test(passwordValue)) strength += 1;
    }
    setPasswordStrength(strength);
  }, [passwordValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isTermsAccepted) {
      // Show error about terms not accepted
      Toast.show("You must accept the terms and conditions", {
        type: "danger",
        placement: "top",
        animationType: "slide-in",
        duration: 3000,
        animationDuration: 300,
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username },
      },
    });
    if (error) {
      alert("Error signing up: " + error.message);
      return;
    } else {
      reset();
      setIsTermsAccepted(false);

      navigation.replace("Login");
      Toast.show("Successfully signed up! Please verify your email.", {
        type: "success",
        placement: "top",
        animationType: "slide-in",
        duration: 3000,
        animationDuration: 300,
      });
    }
  };

  const onError: SubmitErrorHandler<FormData> = (errors) => {
    console.log("Form errors:", errors);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#090e1a", "#131a29", "#0d1323"]}
        style={styles.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#4f46e5", "#7c3aed"]}
              style={styles.logoCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>G</Text>
            </LinearGradient>
            <Text style={styles.subtitle}>Guessing Number Challenge</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>
              Join the challenge and test your skills
            </Text>

            <Controller
              control={control}
              name="username"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      error ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={20}
                      color={error ? "#ff6b6b" : "#9ca3af"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter your username"
                      placeholderTextColor="#6b7280"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!formState.isSubmitting}
                      style={styles.input}
                    />
                  </View>
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      error ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="mail"
                      size={20}
                      color={error ? "#ff6b6b" : "#9ca3af"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor="#6b7280"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!formState.isSubmitting}
                      style={styles.input}
                    />
                  </View>
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      error ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={error ? "#ff6b6b" : "#9ca3af"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Create a strong password"
                      placeholderTextColor="#6b7280"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordEyeOpen}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!formState.isSubmitting}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setPasswordEyeOpen(!passwordEyeOpen)}
                    >
                      <Ionicons
                        name={passwordEyeOpen ? "eye" : "eye-off"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>

                  {passwordValue && (
                    <View style={styles.passwordStrengthContainer}>
                      <View style={styles.strengthBarContainer}>
                        {[1, 2, 3, 4].map((i) => (
                          <View
                            key={i}
                            style={[
                              styles.strengthBar,
                              i <= passwordStrength ? strengthStyles[i] : null,
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={styles.strengthText}>
                        {passwordStrength === 0 && "Very Weak"}
                        {passwordStrength === 1 && "Weak"}
                        {passwordStrength === 2 && "Fair"}
                        {passwordStrength === 3 && "Good"}
                        {passwordStrength === 4 && "Strong"}
                      </Text>
                    </View>
                  )}

                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      error ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={error ? "#ff6b6b" : "#9ca3af"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Confirm your password"
                      placeholderTextColor="#6b7280"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!confirmPasswordEyeOpen}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!formState.isSubmitting}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setConfirmPasswordEyeOpen(!confirmPasswordEyeOpen)
                      }
                    >
                      <Ionicons
                        name={confirmPasswordEyeOpen ? "eye" : "eye-off"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isTermsAccepted ? styles.checkboxChecked : null,
                  ]}
                >
                  {isTermsAccepted && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms & Conditions</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {!isTermsAccepted && formState.submitCount > 0 && (
                <Text style={styles.termsError}>You must accept the terms</Text>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit, onError)}
                disabled={formState.isSubmitting || isLoading}
                style={[
                  styles.signupButton,
                  formState.isSubmitting || isLoading
                    ? styles.buttonDisabled
                    : null,
                  !isTermsAccepted ? styles.buttonDisabled : null,
                ]}
              >
                <LinearGradient
                  colors={
                    isLoading || !isTermsAccepted
                      ? ["#6b7280", "#6b7280"]
                      : ["#4f46e5", "#7c3aed"]
                  }
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <Ionicons
                      name="refresh"
                      size={24}
                      color="#fff"
                      style={styles.loadingIcon}
                    />
                  ) : (
                    <Feather
                      name="user-plus"
                      size={24}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  )}
                  <Text style={styles.signupButtonText}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.loginRedirectContainer}>
              <Text style={styles.loginRedirectText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text style={styles.loginRedirectLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090e1a",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(31, 41, 55, 0.7)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
    color: "#d1d5db",
    fontWeight: "500",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(55, 65, 81, 0.5)",
    borderRadius: 12,
    height: 56,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
    marginRight: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 6,
    marginLeft: 8,
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  strengthBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    backgroundColor: "#374151",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  strength0: {
    backgroundColor: "#ef4444",
  },
  strength1: {
    backgroundColor: "#f59e0b",
  },
  strength2: {
    backgroundColor: "#f59e0b",
  },
  strength3: {
    backgroundColor: "#10b981",
  },
  strength4: {
    backgroundColor: "#10b981",
  },
  strengthText: {
    fontSize: 12,
    color: "#9ca3af",
    width: 70,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "transparent",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#4f46e5",
  },
  termsText: {
    color: "#d1d5db",
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  termsError: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 34,
  },
  signupButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#4f46e5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingIcon: {
    marginRight: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginRedirectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginRedirectText: {
    color: "#d1d5db",
    fontWeight: "500",
  },
  loginRedirectLink: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});
