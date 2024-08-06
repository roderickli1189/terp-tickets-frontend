"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "../modals/success-modal";
import { useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  event: z.string().min(1, { message: "Event type required" }),
  date: z.string().min(1, { message: "Date required" }),
  description: z.string().min(1, { message: "Description required" }),
  ticket: z
    .unknown()
    .transform((value) => value as FileList)
    .refine((file) => file.length > 0, "Picture must be attached")
    .refine((file) => {
      if (file.length > 0) {
        return file[0].size <= MAX_FILE_SIZE;
      }
      return false;
    }, "Max image size is roughly 5MB.")
    .refine((file) => {
      if (file.length > 0) {
        return ACCEPTED_IMAGE_TYPES.includes(file[0].type);
      } else {
        return false;
      }
    }, "Only .jpg, .jpeg, .png, and .webp formats are supported."),
  // when checking if the ticket is valid i must make sure the file is not null because it runs
  // continuous checks even post submission
});

type FormFields = z.infer<typeof schema>;

type ProfileFormProps = {
  user: User;
};

const ListingForm: React.FC<ProfileFormProps> = ({ user }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      event: "",
    },
  });

  const auth = getAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    try {
      const apiURL = "http://localhost:8000/create-listing";
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-type": "application/JSON" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error with creating listing"); //later come back and return the proper error message
      }
      console.log("api was successfully reached");
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  return (
    <div>
      <SuccessModal message="User Updated Successfully"></SuccessModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Event Type</span>
            </div>
            <select {...register("event")} className="select select-bordered">
              <option value="" disabled>
                Pick one
              </option>
              <option value="Football">Football</option>
              <option value="Men Basketball">Men Basketball</option>
              <option value="Women Basketball">Women Basketball</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        {errors.event && (
          <div className="text-red-500">{errors.event.message}</div>
        )}

        <div className="my-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Event Date</span>
            </div>
            <input
              {...register("date")}
              type="date"
              className="input input-bordered"
            />
          </label>
        </div>

        {errors.date && (
          <div className="text-red-500">{errors.date.message}</div>
        )}

        <label className="form-control">
          <div className="label">
            <span className="label-text">Event Description</span>
          </div>
          <textarea
            {...register("description")}
            className="textarea textarea-bordered h-24"
            placeholder="description"
          ></textarea>
        </label>

        {errors.description && (
          <div className="text-red-500">{errors.description.message}</div>
        )}

        <div className="my-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Ticket Picture</span>
            </div>
            <input
              {...register("ticket")}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </label>
        </div>

        {errors.ticket && (
          <div className="text-red-500">{errors.ticket.message}</div>
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

export default ListingForm;
