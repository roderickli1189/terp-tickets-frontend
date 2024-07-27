"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

type FormFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await signInWithEmailAndPassword(data.email, data.password);
      reset();
      console.log("sign in worked");
      router.push("/");
    } catch (error) {
      console.log(error);
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

        <div className="my-3 flex justify-center">
          <button type="submit" className="btn">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
