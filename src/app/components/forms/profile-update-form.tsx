"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        return !val || regex.test(val);
      },
      {
        message: "Invalid phone number format",
      }
    ),
  profilePic: z.instanceof(FileList),
});

type FormFields = z.infer<typeof schema>;

export default function ProfileForm() {
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
    console.log(data);
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <label className="input input-bordered flex items-center gap-2">
            Name
            <input
              {...register("name")}
              type="text"
              className="grow"
              placeholder="umd123"
            />
          </label>
        </div>

        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}

        <div className="my-3">
          <label className="input input-bordered flex items-center gap-2">
            Phone Number
            <input
              {...register("phoneNumber")}
              type="tel"
              className="grow"
              placeholder="123-456-7890"
            />
          </label>
        </div>

        {errors.phoneNumber && (
          <div className="text-red-500">{errors.phoneNumber.message}</div>
        )}

        <div className="my-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Profile Picture</span>
            </div>
            <input
              {...register("profilePic")}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        {errors.profilePic && (
          <div className="text-red-500">{errors.profilePic.message}</div>
        )}

        <div className="my-3 flex justify-center">
          <button type="submit" className="btn">
            Update
          </button>
        </div>

        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
