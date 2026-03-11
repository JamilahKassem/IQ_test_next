import { AuthProvider } from "@/app/shared/AuthContext";
import { Template } from "@/app/shared/template";
import "@/app/css/theme.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
    <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <title>IQ Test</title>
    </head>
    <body>
    <AuthProvider>
        <Template>
            {children}
        </Template>
    </AuthProvider>
    </body>
    </html>
  );
}
