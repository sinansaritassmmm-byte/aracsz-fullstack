import ListingDetailClient from "./ListingDetailClient";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ListingDetailClient id={id} />;
}
