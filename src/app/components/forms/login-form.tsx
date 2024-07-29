"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password required" }),
});

type FormFields = z.infer<typeof schema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({ resolver: zodResolver(schema) });

  const auth = getAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        reset();
        router.push("/");
      })
      .catch((error) => {
        setError("root", {
          message: error.message,
        });
      });
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

        <div className="my-3 flex justify-center">
          <button type="submit" className="btn">
            Login
          </button>
        </div>

        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
