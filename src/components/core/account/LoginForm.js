import { useState } from "react";
import { login } from "@/utils/Api";
import { toast } from "react-toastify";
import Link from "next/link";
import Layout from "@/components/core/account/Layout";
import Loading from "@/components/core/account/Loading";
import TextField from "@/components/fields/TextField";
import PasswordField from "@/components/fields/PasswordField";
import { saveToDB } from "@/utils/indexedDB";
import { useRouter } from "next/router";

export default function LoginForm({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login({
        username: credentials.username,
        password: credentials.password,
      });

      if (response?.data) {
        toast.success("Login successful!");
        const { token, firstTimeLogin } = response.data;

        if (token) {
          await saveToDB("authToken", token);
        }

        if (firstTimeLogin) {
          toast.info(
            "OTP sent to your registered phone number for first-time login.",
            { autoClose: 5000 }
          );
          router.push("/otp-verification");
        } else {
          router.push("/home").then(() => {
            router.reload();
          });
        }
      } else {
        toast.error(`Login failed: ${response?.message || "Unknown error"}`, {
          autoClose: false,
        });
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message || "Unknown error"}`, {
        autoClose: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      gradientFrom="sky-600"
      gradientTo="cyan-500"
      className="bg-slate-50"
      panelClassName="w-[360px] md:w-[460px]"
    >
      {isLoading && <Loading />}
      <div className={`mx-auto p-6 md:p-8 ${isLoading ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Log In</h1>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/signup" className="transition duration-300 text-sky-700 hover:text-sky-800">
              Sign Up
            </Link>
            <Link href="/" className="transition duration-300 text-slate-600 hover:text-slate-900">
              Home
            </Link>
          </div>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Access your 3plug platform workspace. Account type is managed from signup/profile, not here.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="mt-5 space-y-4 text-sm text-gray-700"
        >
          <AuthFieldRow label="Username" required>
            <TextField
              required
              autoComplete="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="Enter username"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
            />
          </AuthFieldRow>

          <AuthFieldRow label="Password" required>
            <PasswordField
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter password"
              inlineToggle
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
            />
          </AuthFieldRow>

          <div className="flex items-center justify-start text-xs">
            <Link href="/forgot-password" className="font-semibold text-sky-700 hover:text-sky-800">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="relative inline-block w-full rounded-lg border-0 bg-gradient-to-tl from-sky-700 to-cyan-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-soft-md transition-all hover:shadow-soft-2xl"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}

function AuthFieldRow({ label, required = false, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div className="min-h-8">{children}</div>
    </div>
  );
}
