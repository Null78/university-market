"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import {useRouter} from 'next/navigation'
interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const router = useRouter();
  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </SessionProvider>
  );
};

export default Providers;
