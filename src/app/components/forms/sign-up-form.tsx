"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be longer than 6 characters" }),
    verifyPassword: z
      .string()
      .min(6, { message: "Verify password must be longer than 6 characters" }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords do not match",
    path: ["verifyPassword"],
  });

type FormFields = z.infer<typeof schema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const auth = getAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      reset();
      router.push("/login");
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <label className="input input-bordered flex items-center gap-2">
            Email
            <input
              {...register("email")}
              type="text"
              className="grow"
              placeholder="testudo@gmail.com"
            />
          </label>
        </div>

        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}

        <div className="my-3">
          <label className="input input-bordered flex items-center gap-2">
            Password
            <input
              {...register("password")}
              type="password"
              className="grow"
              placeholder="umd123"
            />
          </label>
        </div>

        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}

        <div className="my-3">
          <label className="input input-bordered flex items-center gap-2">
            Verify Password
            <input
              {...register("verifyPassword")}
              type="password"
              className="grow"
              placeholder="umd123"
            />
          </label>
        </div>

        {errors.verifyPassword && (
          <div className="text-red-500">{errors.verifyPassword.message}</div>
        )}

        <div className="my-3 flex justify-center">
          <button disabled={loading} type="submit" className="btn">
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
