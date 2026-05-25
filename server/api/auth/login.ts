import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Şimdilik mock doğrulama. Bunu DB'ye göre bağlayacağız.
  if (email && password) {
    return NextResponse.json({
      success: true,
      token: "mock-jwt-token",
      user: { email, name: "Sinan Sarıtaş" },
    });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
