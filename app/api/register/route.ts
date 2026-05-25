import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    const password = String(body?.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Bu e-posta ile kayıtlı bir kullanıcı zaten var.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Üyelik başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}