import {Geist_Mono, Raleway} from "next/font/google";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

const raleway = Raleway({
    variable: "--font-raleway",
    subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "ZARYA | Потерянная душа: возвращение к себе",
    description: "Потерянная душа: возвращение к себе",
};

export default function RootLayout({children}) {
    return (
        <html lang="ru" className={`${raleway.variable} ${geistMono.variable}`}>
            <body className="antialiased">
                {children}
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
