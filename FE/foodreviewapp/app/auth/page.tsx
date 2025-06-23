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

export default function AuthPage() {
  const router = useRouter();
  const { isDarkMode } = useApp();
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 (임시로 토큰 저장 후 홈으로 이동)
    console.log("로그인:", loginData);
    localStorage.setItem("authToken", "dummy-token");
    router.push("/");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 로직 (임시로 토큰 저장 후 홈으로 이동)
    console.log("회원가입:", signupData);
    localStorage.setItem("authToken", "dummy-token");
    router.push("/");
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
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
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
                    className="w-full bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white mt-6"
                  >
                    로그인
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
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
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
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
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
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
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
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
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
                </div>

                {/* 회원가입 버튼 */}
                <Button
                  type="submit"
                  className="w-full bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white"
                >
                  회원가입
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
