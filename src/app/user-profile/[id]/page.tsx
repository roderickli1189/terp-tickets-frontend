"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import ProfileForm from "@/app/components/forms/profile-update-form";
import { useRouter } from "next/navigation";

export default function userProfile({ params }: { params: { id: string } }) {
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
      <h1 className="mb-5">User Profile</h1>
      <div className="card bg-base-100 w-96 shadow-xl">
        <h2 className="text-center">Profile Picture</h2>
        <figure className="px-10">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile Picture"
              className="rounded-xl"
            />
          ) : (
            <div className="rounded-xl text-center text-gray-500">
              No profile picture
            </div>
          )}
        </figure>
        <div className="card-body items-center text-center">
          <h2>Name : {user?.displayName || "None"}</h2>
          <h2>Email : {user?.email || "None"}</h2>
        </div>
      </div>
      <h1 className="mt-7">Update Profile</h1>
      <ProfileForm user={user}></ProfileForm>
    </div>
  );
}
