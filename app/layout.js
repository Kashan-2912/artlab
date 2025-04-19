import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import React from "react"
import { MenuBar } from "@/components/menu-bar"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableSystemTheme>
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[5]">
            {/* <MenuBar /> */}
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
