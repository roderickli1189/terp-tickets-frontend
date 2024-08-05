"use client";

import LoginForm from "../components/forms/login-form";
import Link from "next/link";

export default function Login() {
  return (
    <main className="flex flex-col items-center">
      <h1>Login Here</h1>
      <LoginForm></LoginForm>
      <Link className="hover:text-blue-400" href="/sign-up">
        Dont have any account? Sign up here
      </Link>
    </main>
  );
}
