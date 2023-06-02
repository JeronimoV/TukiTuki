import Head from "next/head";
import "./global.css";
import Providers from "@/globalRedux/provider";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("@/components/NavBar/navBar"), {
  ssr: false,
});

export const metadata = {
  title: "TukiTuki",
  description:
    "Es una red social desarrollada con Next.js, actualmente se encuentra en desarrollo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans&family=Noto+Sans&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
