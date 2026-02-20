import { useState } from "react";
import { login } from "@/utils/Api";
import { toast } from "react-toastify";
import Link from "next/link";
import Layout from "@/components/core/account/Layout";
import Loading from "@/components/core/account/Loading";
import { saveToDB } from "@/utils/indexedDB";
import { useRouter } from "next/router";

export default function LoginForm({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
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
          router.push("/").then(() => {
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
    <Layout gradientFrom="purple-700" gradientTo="pink-500">
      {isLoading && <Loading />}
      <div className={`mx-auto p-8 ${isLoading ? "opacity-60" : ""}`}>
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl text-black font-semibold">Login</h1>
          <Link href="/">
            <div className="transition duration-300">Home</div>
          </Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
        >
          <div className="relative">
            <input
              required
              autoComplete="off"
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-b-blue-600"
              placeholder="Username"
            />
            <label
              htmlFor="username"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Username <span className="text-red-600">*</span>
            </label>
          </div>
          <div className="relative">
            <input
              required
              autoComplete="off"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-b-blue-600"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Password <span className="text-red-600">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>
          <button
            type="submit"
            className="relative inline-block w-full px-6 py-3 my-4 text-xs font-bold text-center text-white uppercase align-middle transition-all ease-in border-0 rounded-lg select-none shadow-soft-md bg-150 bg-x-25 leading-pro bg-gradient-to-tl from-purple-800 to-purple-700 hover:shadow-soft-2xl hover:scale-102"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
}
