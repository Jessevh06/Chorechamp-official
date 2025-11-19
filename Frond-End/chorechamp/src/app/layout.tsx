import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ChoreChamp",
    description: "Hou je huishouden eerlijk & leuk",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="nl">
        <body className="cc-body">
        <AuthProvider>
            <Navbar />
            <main className="cc-main">{children}</main>
            <footer className="cc-footer">
                <div className="cc-footer-inner">
                    <span>© {new Date().getFullYear()} ChoreChamp</span>
                    <span className="cc-footer-sub">
                Gemaakt met Next.js & Spring Boot
              </span>
                </div>
            </footer>
        </AuthProvider>
        </body>
        </html>
    );
}
