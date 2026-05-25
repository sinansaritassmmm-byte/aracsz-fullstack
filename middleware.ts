import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/giris-yap",
  "/uye-ol",
  "/ilanlar",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/ilanlar/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname.startsWith("/kategori/")) return true;
  return false;
}

function isProtectedPath(pathname: string) {
  return (
    pathname === "/ilan-ver" ||
    pathname.startsWith("/profil") ||
    pathname.startsWith("/mesajlar") ||
    pathname.startsWith("/hesabim")
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL("/giris-yap", req.url);

    if (pathname !== "/giris-yap") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};