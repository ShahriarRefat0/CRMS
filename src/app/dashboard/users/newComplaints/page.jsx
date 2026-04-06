"use client";

import ComplaintsForm from "@/shared/ComplaintsForm";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();

  return (
    <div>
      <ComplaintsForm session={session} />
    </div>
  );
};

export default Page;