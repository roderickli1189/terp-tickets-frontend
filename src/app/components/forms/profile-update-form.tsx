"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, updateProfile, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "../modals/success-modal";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z
  .object({
    name: z.string(),
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
  })
  .refine((data) => data.name.trim() !== "" || data.profilePic.length > 0, {
    message: "form cannot be empty",
    path: ["name"], // Idk how to make it show up in root seems to only work for schema def vars
  });

type FormFields = z.infer<typeof schema>;

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
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
    const currentUser = auth.currentUser;
    if (currentUser) {
      setLoading(true);
      try {
        const payload: { displayName?: string; photoURL?: string } = {};
        if (data.name) {
          payload.displayName = data.name;
        }
        if (data.profilePic.length == 1) {
          console.log("detected image");
          const picture = data.profilePic[0];

          const storageRef = ref(
            storage,
            `users/${user?.uid}/profilePicture.png`
          );

          const snapshot = await uploadBytes(storageRef, picture);

          const downloadURL = await getDownloadURL(snapshot.ref);

          payload.photoURL = downloadURL;
        }
        await updateProfile(currentUser, payload);
        const modal = document.getElementById("success") as HTMLDialogElement;
        reset();
        modal.showModal();
        modal.addEventListener("close", () => {
          window.location.reload();
        });
      } catch (error: any) {
        setError("root", {
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No user is currently logged in.");
    }
  };

  return (
    <div>
      <SuccessModal message="User Updated Successfully"></SuccessModal>
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
          <button disabled={loading} type="submit" className="btn">
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update"
            )}
          </button>
        </div>

        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
