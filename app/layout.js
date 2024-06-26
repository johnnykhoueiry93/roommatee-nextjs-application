import "bootstrap/dist/css/bootstrap.css";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "../context/ClientWrapper";
import { Provider } from 'jotai';
import Nav from "../components/navigation/Nav.tsx";
import LabelBottomNavigation from "../components/navigation/LabelBottomNavigation.tsx";
import BootstrapClient from "../components/BootstrapClient.js";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Provider> */}
        <ClientWrapper>
          <body className={inter.className}>
            <Nav />
            {children}
            <BootstrapClient />
            <LabelBottomNavigation/>
          </body>
        </ClientWrapper>
      {/* </Provider> */}
    </html>
  );
}
