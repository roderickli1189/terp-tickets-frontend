"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import ListingForm from "../components/forms/listing-form";

export default function CreateListing() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <p>Loading...</p>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (!user) {
    router.push("/login");
    return (
      // if i dont include a return here type script will say the user param I pass into profile form is possible null
      <div className="flex flex-col items-center">
        <p>Loading...</p>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Create Listing</h1>
      <ListingForm user={user}></ListingForm>
    </div>
  );
}
