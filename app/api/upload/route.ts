import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await cloudinary.uploader.upload(body.image, {
    folder: "profiles",
  });

  return Response.json({ url: result.secure_url });
}