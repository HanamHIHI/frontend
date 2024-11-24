"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Script from "next/script";


interface Props {
  children?: React.ReactNode;
}

const queryClient = new QueryClient();

export const NextProviders = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export const NextLayout = ({ children }: Props) => {
  return (
    <>
      <div className="w-4 h-4">{children}</div>
      <Script
        type="text/javascript"
        strategy='beforeInteractive'
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}`}
      />
    </>
  );
};