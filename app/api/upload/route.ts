import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "Cloudinary environment bilgileri eksik.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Dosya bulunamadı." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, message: "Sadece görsel dosyası yüklenebilir." },
        { status: 400 }
      );
    }

    const maxSizeMb = 8;
    if (file.size > maxSizeMb * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: `Fotoğraf ${maxSizeMb} MB'dan büyük olamaz.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "aracsz",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { ok: false, message: "Cloudinary görsel URL'i dönmedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
    });
  } catch (error: any) {
    console.error("UPLOAD_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Upload sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}