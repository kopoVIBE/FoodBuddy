"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/app-context";
import { signup, login, SignupData, LoginData } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const { isDarkMode, setUserInfo } = useApp();
  const [currentView, setCurrentView] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 로그인 상태
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // 회원가입 상태
  const [signupData, setSignupData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    defaultStyleId: "FRIENDLY",
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 유효성 검사 상태
  const [validation, setValidation] = useState({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
  });

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { isValid: false, message: "" };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "올바른 이메일 형식이 아닙니다." };
    }
    return { isValid: true, message: "올바른 이메일 형식입니다." };
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    if (!password) {
      return { isValid: false, message: "" };
    }

    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return { isValid: false, message: "비밀번호는 8자 이상이어야 합니다." };
    }
    if (!hasLetter) {
      return { isValid: false, message: "영문자를 포함해야 합니다." };
    }
    if (!hasNumber) {
      return { isValid: false, message: "숫자를 포함해야 합니다." };
    }
    if (!hasSpecial) {
      return { isValid: false, message: "특수문자를 포함해야 합니다." };
    }

    return { isValid: true, message: "안전한 비밀번호입니다." };
  };

  // 비밀번호 확인 유효성 검사
  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      return { isValid: false, message: "" };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
    }
    return { isValid: true, message: "비밀번호가 일치합니다." };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginPayload: LoginData = {
        email: loginData.email,
        password: loginData.password,
      };

      console.log("로그인 시도:", loginPayload);
      const response = await login(loginPayload);
      console.log("로그인 성공:", response);

      // 중앙 저장소에 사용자 정보 저장
      setUserInfo(response.nickname, response.token);

      // 성공 시 홈으로 이동
      router.push("/");
    } catch (error: any) {
      console.error("로그인 실패:", error);
      alert(error.response?.data || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사 확인
    if (!validation.email.isValid) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    if (!validation.password.isValid) {
      alert("비밀번호 조건을 만족해주세요.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!signupData.nickname.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const signupPayload: SignupData = {
        email: signupData.email,
        password: signupData.password,
        nickname: signupData.nickname,
        defaultStyleId: signupData.defaultStyleId,
      };

      console.log("회원가입 시도:", signupPayload);
      const response = await signup(signupPayload);
      console.log("회원가입 성공:", response);

      // 회원가입 성공 후 자동 로그인
      const loginPayload: LoginData = {
        email: signupData.email,
        password: signupData.password,
      };

      const loginResponse = await login(loginPayload);

      // 중앙 저장소에 사용자 정보 저장
      setUserInfo(loginResponse.nickname, loginResponse.token);

      // 성공 시 홈으로 이동
      router.push("/");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      alert(error.response?.data || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="FoodBuddy Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#EB4C34]">FoodBuddy</h1>
          <p
            className={`text-sm mt-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            맛있는 순간을 기록하고 공유하세요
          </p>
        </div>

        {/* 인증 카드 */}
        <Card
          className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2">
              {currentView === "signup" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentView("login")}
                  className="h-8 w-8 absolute left-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle
                className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-center`}
              >
                {currentView === "login" ? "로그인" : "회원가입"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {currentView === "login" ? (
              // 로그인 폼
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* 이메일 */}
                  <div className="space-y-2">
                    <Label
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      이메일
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={loginData.email}
                        onChange={(e) => {
                          const email = e.target.value;
                          setLoginData({ ...loginData, email });
                          const emailValidation = validateEmail(email);
                          setValidation((prev) => ({
                            ...prev,
                            email: emailValidation,
                          }));
                        }}
                        className={`pl-10 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : ""
                        } ${
                          validation.email.message && !validation.email.isValid
                            ? "border-red-500"
                            : validation.email.isValid
                            ? "border-green-500"
                            : ""
                        }`}
                        required
                      />
                    </div>
                    {validation.email.message && (
                      <p
                        className={`text-xs ${
                          validation.email.isValid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {validation.email.message}
                      </p>
                    )}
                  </div>

                  {/* 비밀번호 */}
                  <div className="space-y-2">
                    <Label
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      비밀번호
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className={`pl-10 pr-10 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 로그인 버튼 */}
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !Boolean(loginData.email.trim()) ||
                      !Boolean(loginData.password.trim()) ||
                      Boolean(
                        validation.email.message && !validation.email.isValid
                      )
                    }
                    className="w-full bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "로그인 중..." : "로그인"}
                  </Button>
                </form>

                {/* 회원가입 링크 */}
                <div className="text-center mt-6">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    아직 계정이 없으신가요?{" "}
                    <button
                      onClick={() => setCurrentView("signup")}
                      className="text-[#EB4C34] hover:text-[#EB4C34CC] font-medium underline"
                    >
                      회원가입
                    </button>
                  </p>
                </div>
              </>
            ) : (
              // 회원가입 폼
              <form onSubmit={handleSignup} className="space-y-4">
                {/* 이름 */}
                <div className="space-y-2">
                  <Label
                    className={isDarkMode ? "text-white" : "text-gray-900"}
                  >
                    이름
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={signupData.nickname}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          nickname: e.target.value,
                        })
                      }
                      className={`pl-10 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : ""
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label
                    className={isDarkMode ? "text-white" : "text-gray-900"}
                  >
                    이메일
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={signupData.email}
                      onChange={(e) => {
                        const email = e.target.value;
                        setSignupData({ ...signupData, email });
                        const emailValidation = validateEmail(email);
                        setValidation((prev) => ({
                          ...prev,
                          email: emailValidation,
                        }));
                      }}
                      className={`pl-10 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : ""
                      } ${
                        validation.email.message && !validation.email.isValid
                          ? "border-red-500"
                          : validation.email.isValid
                          ? "border-green-500"
                          : ""
                      }`}
                      required
                    />
                  </div>
                  {validation.email.message && (
                    <p
                      className={`text-xs ${
                        validation.email.isValid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {validation.email.message}
                    </p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label
                    className={isDarkMode ? "text-white" : "text-gray-900"}
                  >
                    비밀번호
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={signupData.password}
                      onChange={(e) => {
                        const password = e.target.value;
                        setSignupData({
                          ...signupData,
                          password,
                        });
                        const passwordValidation = validatePassword(password);
                        const confirmPasswordValidation =
                          validateConfirmPassword(
                            password,
                            signupData.confirmPassword
                          );
                        setValidation((prev) => ({
                          ...prev,
                          password: passwordValidation,
                          confirmPassword: confirmPasswordValidation,
                        }));
                      }}
                      className={`pl-10 pr-10 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : ""
                      } ${
                        validation.password.message &&
                        !validation.password.isValid
                          ? "border-red-500"
                          : validation.password.isValid
                          ? "border-green-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {validation.password.message && (
                    <p
                      className={`text-xs ${
                        validation.password.isValid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {validation.password.message}
                    </p>
                  )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="space-y-2">
                  <Label
                    className={isDarkMode ? "text-white" : "text-gray-900"}
                  >
                    비밀번호 확인
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={signupData.confirmPassword}
                      onChange={(e) => {
                        const confirmPassword = e.target.value;
                        setSignupData({
                          ...signupData,
                          confirmPassword,
                        });
                        const confirmPasswordValidation =
                          validateConfirmPassword(
                            signupData.password,
                            confirmPassword
                          );
                        setValidation((prev) => ({
                          ...prev,
                          confirmPassword: confirmPasswordValidation,
                        }));
                      }}
                      className={`pl-10 pr-10 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : ""
                      } ${
                        validation.confirmPassword.message &&
                        !validation.confirmPassword.isValid
                          ? "border-red-500"
                          : validation.confirmPassword.isValid
                          ? "border-green-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {validation.confirmPassword.message && (
                    <p
                      className={`text-xs ${
                        validation.confirmPassword.isValid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {validation.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* 회원가입 버튼 */}
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !validation.email.isValid ||
                    !validation.password.isValid ||
                    !validation.confirmPassword.isValid ||
                    !signupData.nickname.trim()
                  }
                  className="w-full bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "회원가입 중..." : "회원가입"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* 하단 텍스트 */}
        {currentView === "signup" && (
          <div className="text-center mt-6">
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              회원가입 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
