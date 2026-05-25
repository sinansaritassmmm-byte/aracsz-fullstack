"use client";

import { useEffect, useState } from "react";
import ListingDetailActions from "@/components/ListingDetailActions";

export default function IlanDetayClient({
  listingId,
  owner,
}: {
  listingId: string;
  owner: { id: string; name: string | null; email: string | null } | null;
}) {
  const [meId, setMeId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        // next-auth default session endpoint
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!alive) return;

        const id = data?.user?.id ?? data?.user?.sub ?? null;
        setMeId(id ? String(id) : null);
      } catch {
        if (!alive) return;
        setMeId(null);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const isOwner = !!meId && !!owner?.id && meId === owner.id;

  return <ListingDetailActions listingId={listingId} isOwner={isOwner} owner={owner ?? { id: "", name: null, email: null }} />;
}
