import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "@/components/core/account/Layout";
import Loading from "@/components/core/account/Loading";
import TextField from "@/components/fields/TextField";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { forgotPassword } from "@/utils/Api";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      toast.error("Enter your email or username.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await forgotPassword({ identifier: identifier.trim() });
      if (response?.data) {
        toast.success("Password reset instructions sent.");
        setCodeSent(true);
      } else {
        toast.error(`Request failed: ${response?.message || "Unknown error"}`, { autoClose: false });
      }
    } catch (error) {
      toast.error(`Request failed: ${error.message || "Unknown error"}`, { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout gradientFrom="sky-600" gradientTo="cyan-500" className="bg-slate-50" panelClassName="w-[360px] md:w-[460px]">
      {isLoading ? <Loading /> : null}
      <div className={`mx-auto p-6 md:p-8 ${isLoading ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Forgot Password</h1>
          <Link href="/login" className="text-sm text-sky-700 hover:text-sky-800">Back to Login</Link>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Enter your email or username to start password recovery.
          {codeSent ? " Code sent. Continue to OTP verification when ready." : ""}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-5 space-y-4"
        >
          <AuthFieldRow label="Email or Username" required>
            <CustomTooltip content="Use the email or username linked to your account." open={activeField === "identifier"}>
              <div className="w-full">
                <TextField
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onFocus={() => setActiveField("identifier")}
                  onBlur={() => setActiveField("")}
                  placeholder="Email or username"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </div>
            </CustomTooltip>
          </AuthFieldRow>

          <button
            type="submit"
            className="relative inline-block w-full rounded-lg border-0 bg-gradient-to-tl from-sky-700 to-cyan-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-soft-md transition-all hover:shadow-soft-2xl"
          >
            Send Reset Link
          </button>

          <div className="space-y-2 text-center text-xs text-slate-500">
            {codeSent ? (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/otp-verification?flow=forgot-password&identifier=${encodeURIComponent(identifier.trim())}`
                  )
                }
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-sky-700 hover:border-sky-300 hover:text-sky-800"
              >
                Continue to OTP Verification
              </button>
            ) : null}
            <p>
              Need 2FA verification instead?{" "}
              <Link href="/otp-verification?flow=login" className="font-semibold text-sky-700 hover:text-sky-800">
                Verify OTP
              </Link>
            </p>
          </div>
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
