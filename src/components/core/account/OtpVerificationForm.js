import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "@/components/core/account/Layout";
import Loading from "@/components/core/account/Loading";
import TextField from "@/components/fields/TextField";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { resendOtp, validateOtp } from "@/utils/Api";

export default function OtpVerificationForm() {
  const router = useRouter();
  const flow = Array.isArray(router.query.flow) ? router.query.flow[0] : router.query.flow || "login";
  const identifierFromQuery = Array.isArray(router.query.identifier)
    ? router.query.identifier[0]
    : router.query.identifier || "";
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [form, setForm] = useState({ username: identifierFromQuery, otp: "" });
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!identifierFromQuery) return;
    setForm((prev) => (prev.username ? prev : { ...prev, username: identifierFromQuery }));
  }, [identifierFromQuery]);

  const handleVerify = async () => {
    if (!form.username.trim() || !form.otp.trim()) {
      toast.error("Username and OTP are required.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await validateOtp({
        username: form.username.trim(),
        otp: form.otp.trim(),
      });
      if (response?.data) {
        toast.success("OTP verified successfully.");
        setVerified(true);
        if (flow === "login") {
          router.push("/home");
        }
      } else {
        toast.error(`OTP verification failed: ${response?.message || "Unknown error"}`, { autoClose: false });
      }
    } catch (error) {
      toast.error(`OTP verification failed: ${error.message || "Unknown error"}`, { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.username.trim()) {
      toast.error("Enter username to resend OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await resendOtp({ username: form.username.trim() });
      if (response?.data) {
        toast.success("OTP resent.");
      } else {
        toast.error(`Resend failed: ${response?.message || "Unknown error"}`, { autoClose: false });
      }
    } catch (error) {
      toast.error(`Resend failed: ${error.message || "Unknown error"}`, { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout gradientFrom="sky-600" gradientTo="cyan-500" className="bg-slate-50" panelClassName="w-[360px] md:w-[480px]">
      {isLoading ? <Loading /> : null}
      <div className={`mx-auto p-6 md:p-8 ${isLoading ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">OTP Verification</h1>
          <Link
            href={flow === "forgot-password" ? "/forgot-password" : "/login"}
            className="text-sm text-sky-700 hover:text-sky-800"
          >
            {flow === "forgot-password" ? "Back to Forgot Password" : "Back to Login"}
          </Link>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {flow === "forgot-password"
            ? "Enter the code sent during password recovery to continue the reset flow."
            : "Complete two-factor authentication with the one-time code sent to your registered contact."}
        </p>
        {verified && flow === "forgot-password" ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Code verified. Continue with the password reset step configured by your backend flow.
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="mt-5 space-y-4"
        >
          <AuthFieldRow label="Username" required>
            <CustomTooltip content="Use the same username used during login." open={activeField === "username"}>
              <div className="w-full">
                <TextField
                  required
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                  onFocus={() => setActiveField("username")}
                  onBlur={() => setActiveField((v) => (v === "username" ? "" : v))}
                  placeholder="Username"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>
            </CustomTooltip>
          </AuthFieldRow>

          <AuthFieldRow label="One-Time Password (OTP)" required>
            <CustomTooltip content="Enter the OTP code exactly as sent to you." open={activeField === "otp"}>
              <div className="w-full">
                <TextField
                  required
                  value={form.otp}
                  onChange={(e) => setForm((prev) => ({ ...prev, otp: e.target.value }))}
                  onFocus={() => setActiveField("otp")}
                  onBlur={() => setActiveField((v) => (v === "otp" ? "" : v))}
                  placeholder="Enter OTP code"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold tracking-[0.2em] text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>
            </CustomTooltip>
          </AuthFieldRow>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="submit"
              className="relative inline-block w-full rounded-lg border-0 bg-gradient-to-tl from-sky-700 to-cyan-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-soft-md transition-all hover:shadow-soft-2xl"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="inline-block w-full rounded-lg border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase text-slate-700 transition-all hover:border-sky-300 hover:text-sky-700"
            >
              Resend OTP
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Trouble signing in?{" "}
            <Link href="/forgot-password" className="font-semibold text-sky-700 hover:text-sky-800">
              Reset password
            </Link>
          </p>
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
