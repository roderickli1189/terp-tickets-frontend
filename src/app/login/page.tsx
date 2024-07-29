"use client";

import LoginForm from "../components/forms/login-form";

export default function Login() {
  return (
    <main className="flex flex-col items-center">
      <h1>Login Here</h1>
      <LoginForm></LoginForm>
    </main>
  );
}
