import EditListingClient from "./EditListingClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold">İlan Düzenle</h1>
      </div>

      <EditListingClient listingId={id} />
    </div>
  );
}
