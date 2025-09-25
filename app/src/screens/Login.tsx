import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  AppState,
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
import { useToast } from "react-native-toast-notifications";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as zod from "zod";
import { supabase } from "../lib/supabase";
import { NavigationProp } from "../types/navigateProps.types";

const authSchema = zod.object({
  email: zod.email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const Login = () => {
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const toast = useToast();

  const buttonScale = useRef(new Animated.Value(1)).current;

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "peincerana234@gmail.com",
      password: "Prince@2005",
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => subscription.remove();
  }, []);
  const signIn = async (data: zod.infer<typeof authSchema>) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      toast.show(error.message, { type: "danger" });
      setIsLoading(false);
      return;
    }

    reset();
    setIsLoading(false);
    toast.show("Successfully signed in!", { type: "success" });
    navigation.replace("MainTabs");
  };

  // const playAsGuest = () => {
  //   animateButton();
  //   // Handle guest login
  //   console.log("Playing as guest");

  //   navigation.replace("MainTabs");
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#090e1a" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LinearGradient
            colors={["#131a29", "#0d1323", "#090e1a"]}
            style={styles.background}
          />

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>G</Text>
            </View>
            <Text style={styles.subtitle}>Guessing Number Challenge</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>
              Sign in to continue your challenge
            </Text>

            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <View style={styles.inputWrapper}>
                  <Text style={{ marginBottom: 4, color: "#d1d5db" }}>
                    Email
                  </Text>
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
                      placeholder="Email"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
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
                  <Text style={{ marginBottom: 4, color: "#d1d5db" }}>
                    Password
                  </Text>
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
                      placeholder="Password"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!isEyeOpen}
                      autoCapitalize="none"
                      editable={!formState.isSubmitting}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setIsEyeOpen(!isEyeOpen)}
                    >
                      <Ionicons
                        name={isEyeOpen ? "eye" : "eye-off"}
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

            {/* Remember Me */}
            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsRememberMeChecked(!isRememberMeChecked)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isRememberMeChecked ? styles.checkboxChecked : null,
                  ]}
                >
                  {isRememberMeChecked && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSubmit(signIn)}
                disabled={
                  !formState.isValid || formState.isSubmitting || isLoading
                }
                style={[
                  styles.loginButton,
                  isLoading ? styles.buttonDisabled : null,
                ]}
              >
                <LinearGradient
                  colors={
                    isLoading ? ["#6b7280", "#6b7280"] : ["#4f46e5", "#7c3aed"]
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
                      name="log-in"
                      size={24}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                  )}
                  <Text style={styles.loginButtonText}>
                    {isLoading ? "LOGGING IN..." : "LOGIN"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={playAsGuest}
                style={styles.guestButton}
              >
                <Ionicons
                  name="game-controller"
                  size={24}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.guestButtonText}>PLAY AS GUEST</Text>
              </TouchableOpacity>
            </Animated.View> */}
          </View>

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR CONTINUE WITH</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("Signup")}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4f46e5",
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
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: "rgba(31, 41, 55, 0.6)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  formSubtitle: {
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
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
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#4f46e5",
  },
  rememberText: {
    color: "#d1d5db",
  },
  forgotPasswordText: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  loginButton: {
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
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loadingIcon: {
    marginRight: 8,
    transform: [{ rotate: "0deg" }],
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  separatorText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(31, 41, 55, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
  },
  footerLink: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
