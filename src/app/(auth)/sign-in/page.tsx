"use client";
import Image from "next/image";
import SignInForm from "./form";
import { Suspense } from "react";
import dynamic from "next/dynamic";

export default function SignIn() {
  
  return (
    <div className="flex h-screen w-full">
      
      {/* LEFT IMAGE (50%) */}
      <div className="relative h-full md:w-0 sm:w-0 xl:w-1/2 lg:w-1/2">
        <Image
          src="/sql.png"
          alt="auth"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* RIGHT FORM (50%) */}
      <div className="w-1/2 h-full flex items-center justify-center px-8 mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
      </div>

    </div>
  );
}