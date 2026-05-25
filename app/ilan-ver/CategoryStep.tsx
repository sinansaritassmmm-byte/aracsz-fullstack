"use client";

export type CategoryKey = "arac" | "tarim" | "emlak" | "elektronik";

export default function CategoryStep(props: {
  selected: CategoryKey | null;
  onSelect: (c: CategoryKey) => void;
}) {
  const { selected, onSelect } = props;

  const cardStyle = (active: boolean): React.CSSProperties => ({
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background: active ? "rgba(31,209,195,0.18)" : "rgba(255,255,255,0.06)",
    padding: 16,
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,0.20)",
  });

  const titleStyle: React.CSSProperties = { fontSize: 18, fontWeight: 900 };
  const descStyle: React.CSSProperties = { marginTop: 6, opacity: 0.75, fontSize: 13 };

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        <div onClick={() => onSelect("arac")} style={cardStyle(selected === "arac")}>
          <div style={titleStyle}>Vasıta</div>
          <div style={descStyle}>Otomobil, SUV, kamyon, minibüs…</div>
        </div>

        <div onClick={() => onSelect("tarim")} style={cardStyle(selected === "tarim")}>
          <div style={titleStyle}>Tarım & Hayvancılık</div>
          <div style={descStyle}>Traktör, ekipman, yem, canlı hayvan…</div>
        </div>

        <div onClick={() => onSelect("emlak")} style={cardStyle(selected === "emlak")}>
          <div style={titleStyle}>Emlak</div>
          <div style={descStyle}>Daire, müstakil, arsa, işyeri…</div>
        </div>

        <div onClick={() => onSelect("elektronik")} style={cardStyle(selected === "elektronik")}>
          <div style={titleStyle}>Elektronik & Diğer</div>
          <div style={descStyle}>Telefon, bilgisayar, TV/ses, beyaz eşya…</div>
        </div>
      </div>
    </div>
  );
}
