"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";

type FormFields = {
  username: string;
  password: string;
  verifyPassword: string;
  email: string;
};

export default function SignUpForm() {
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      reset();
      console.log("sign up worked");
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

        <div className="my-3 flex justify-center">
          <button type="submit" className="btn">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
