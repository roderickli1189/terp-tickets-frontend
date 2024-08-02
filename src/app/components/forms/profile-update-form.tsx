"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "../modals/success-modal";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  profilePic: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })
    .refine(
      (file) => file.length === 0 || file[0].size <= MAX_FILE_SIZE, // checking if length is zero because after submission it seems to submit again? not sure
      `Max image size is rougly 5MB give or take.`
    )
    .refine(
      (file) =>
        file.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
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
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await updateProfile(currentUser, {
          displayName: data.name,
          photoURL:
            "https://images.pexels.com/photos/907607/pexels-photo-907607.png?auto=compress&cs=tinysrgb&w=600",
        });
        console.log("Profile updated!");
      } catch (error) {
        console.error("An error occurred", error);
      }
    } else {
      console.error("No user is currently logged in.");
    }
  };

  return (
    <div>
      <SuccessModal message="User Updated Successfully"></SuccessModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
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
      </form>
    </div>
  );
}
