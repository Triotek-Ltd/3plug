import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "@/components/core/account/Layout";
import Loading from "@/components/core/account/Loading";
import TextField from "@/components/fields/TextField";
import PasswordField from "@/components/fields/PasswordField";
import SelectField from "@/components/fields/SelectField";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { signup } from "@/utils/Api";

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    account_type: "business",
    password: "",
    confirm_password: "",
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const accountTypeOptions = [
    { label: "Business", value: "business" },
    { label: "Publisher / Contributor", value: "publisher" },
  ];

  const handleSubmit = async () => {
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        account_type: form.account_type,
        password: form.password,
      };

      const response = await signup(payload);

      if (response?.data) {
        toast.success("Account created successfully.");
        router.push("/login");
        return;
      }

      toast.error(`Signup failed: ${response?.message || "Unknown error"}`, { autoClose: false });
    } catch (error) {
      toast.error(`Signup failed: ${error.message || "Unknown error"}`, { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      gradientFrom="sky-600"
      gradientTo="cyan-500"
      className="bg-slate-50"
      panelClassName="w-[360px] md:w-[520px]"
    >
      {isLoading ? <Loading /> : null}
      <div className={`mx-auto p-6 md:p-8 ${isLoading ? "opacity-60" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold text-black">Create Account</h1>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            Home
          </Link>
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Choose account type during signup. After login, account details are managed from Profile.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-5 space-y-4 text-sm text-gray-700"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="First Name" required>
              <FieldWithTooltip
                tooltip="Use the person or contact first name shown on the account profile."
                open={activeField === "first_name"}
              >
                <TextField
                  required
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  onFocus={() => setActiveField("first_name")}
                  onBlur={() => setActiveField((v) => (v === "first_name" ? "" : v))}
                  placeholder="First name"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
            <FieldRow label="Last Name" required>
              <FieldWithTooltip
                tooltip="Use the person or contact last name for the account owner."
                open={activeField === "last_name"}
              >
                <TextField
                  required
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  onFocus={() => setActiveField("last_name")}
                  onBlur={() => setActiveField((v) => (v === "last_name" ? "" : v))}
                  placeholder="Last name"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
          </div>

          <FieldRow label="Username" required>
            <FieldWithTooltip
              tooltip="This becomes your login username. Use a stable, unique name."
              open={activeField === "username"}
            >
              <TextField
                required
                value={form.username}
                onChange={(e) => updateField("username", e.target.value)}
                onFocus={() => setActiveField("username")}
                onBlur={() => setActiveField((v) => (v === "username" ? "" : v))}
                placeholder="Username"
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
              />
            </FieldWithTooltip>
          </FieldRow>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="Email" required>
              <FieldWithTooltip
                tooltip="Use an email you can access for verification and account notices."
                open={activeField === "email"}
              >
                <TextField
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField((v) => (v === "email" ? "" : v))}
                  placeholder="Email address"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
            <FieldRow label="Phone" required>
              <FieldWithTooltip
                tooltip="Enter a phone number used for account verification or support contact."
                open={activeField === "phone"}
              >
                <TextField
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onFocus={() => setActiveField("phone")}
                  onBlur={() => setActiveField((v) => (v === "phone" ? "" : v))}
                  placeholder="Phone number"
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
          </div>

          <FieldRow label="Account Type" required>
            <FieldWithTooltip
              tooltip="Choose the primary path for this account. You will manage account details later from Profile."
              open={activeField === "account_type"}
            >
              <SelectField
                value={form.account_type}
                options={accountTypeOptions}
                onChange={(value) => updateField("account_type", value)}
                onFocus={() => setActiveField("account_type")}
                onBlur={() => setActiveField((v) => (v === "account_type" ? "" : v))}
                placeholder="Select account type"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              />
            </FieldWithTooltip>
          </FieldRow>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldRow label="Password" required>
              <FieldWithTooltip
                tooltip="Use a strong password with mixed letters, numbers, and symbols where supported."
                open={activeField === "password"}
              >
                <PasswordField
                  required
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField((v) => (v === "password" ? "" : v))}
                  placeholder="Password"
                  inlineToggle
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
            <FieldRow label="Confirm Password" required>
              <FieldWithTooltip
                tooltip="Re-enter the same password to confirm it."
                open={activeField === "confirm_password"}
              >
                <PasswordField
                  required
                  value={form.confirm_password}
                  onChange={(e) => updateField("confirm_password", e.target.value)}
                  onFocus={() => setActiveField("confirm_password")}
                  onBlur={() => setActiveField((v) => (v === "confirm_password" ? "" : v))}
                  placeholder="Confirm password"
                  inlineToggle
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:border-sky-400"
                />
              </FieldWithTooltip>
            </FieldRow>
          </div>

          <button
            type="submit"
            className="relative inline-block w-full rounded-lg border-0 bg-gradient-to-tl from-sky-700 to-cyan-600 px-6 py-3 text-xs font-bold uppercase text-white shadow-soft-md transition-all hover:shadow-soft-2xl"
          >
            Create Account
          </button>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}

function FieldRow({ label, required = false, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div className="min-h-8">{children}</div>
    </div>
  );
}

function FieldWithTooltip({ tooltip, open, children }) {
  return (
    <CustomTooltip content={tooltip} open={open}>
      <div className="w-full">{children}</div>
    </CustomTooltip>
  );
}
