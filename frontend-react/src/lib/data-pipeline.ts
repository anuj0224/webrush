import type { Receipt, Category } from "./life-data";

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function parseCSVText(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, "");
  const lines = cleanText.split(/\r?\n/);
  const rows: string[][] = [];
  for (const line of lines) {
    if (line.trim().length > 0) {
      rows.push(parseCSVLine(line));
    }
  }
  return rows;
}

export function normalizeSpotifyRow(cols: string[], index: number): Receipt | null {
  // Columns: spotify_track_uri, ts, platform, ms_played, track_name, artist_name, album_name, reason_start, reason_end, shuffle, skipped
  if (cols.length < 7) return null;
  const ts = cols[1];
  const platform = cols[2] || "Web Player";
  const msPlayed = parseInt(cols[3] || "0", 10);
  const trackName = cols[4] || "Unknown Track";
  const artistName = cols[5] || "Unknown Artist";
  const albumName = cols[6] || "";

  const dateStr = ts ? ts.slice(0, 10) : "2023-01-01";
  const timeStr = ts ? ts.slice(11, 16) : "12:00";

  return {
    id: `SP-${String(index).padStart(6, "0")}`,
    dataset: "Spotify History",
    category: "Music",
    title: trackName,
    detail: `${artistName}${albumName ? " · " + albumName : ""} (${Math.round(msPlayed / 1000)}s played)`,
    date: dateStr,
    time: timeStr,
    location: platform,
    icon: "♪",
    tone: "music",
    rawArtist: artistName,
  };
}

export function normalizeIndiaTransactRow(cols: string[], index: number): Receipt | null {
  // Columns: trans_id, trans_date_trans_time, cc_num, merchant, category, amt, first, last, gender, street, city, state, ...
  if (cols.length < 11) return null;
  const dt = cols[1];
  let merchant = cols[3] || "";
  if (merchant.startsWith("fraud_")) merchant = merchant.slice(6);
  const catRaw = (cols[4] || "").toLowerCase();
  const amt = parseFloat(cols[5] || "0");
  const first = cols[6] || "";
  const last = cols[7] || "";
  const city = cols[9] || "";
  const state = cols[10] || "";

  let category: Category = "Purchases";
  let icon = "◇";
  let tone = "purchases";

  if (catRaw === "entertainment") {
    category = "Entertainment";
    icon = "▶";
    tone = "entertainment";
  } else if (catRaw === "travel") {
    category = "Places";
    icon = "⌖";
    tone = "places";
  }

  let dateStr = "2023-01-01";
  let timeStr = "00:00";
  if (dt) {
    const [dPart, tPart] = dt.trim().split(/\s+/);
    if (dPart) {
      const parts = dPart.split("/");
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        dateStr = `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
      }
    }
    if (tPart) {
      const tParts = tPart.split(":");
      if (tParts.length >= 2 && tParts[0] && tParts[1]) {
        timeStr = `${tParts[0].padStart(2, "0")}:${tParts[1].padStart(2, "0")}`;
      }
    }
  }

  const locName = [city, state].filter(Boolean).join(", ") || "India";

  return {
    id: `IT-${String(index).padStart(5, "0")}`,
    dataset: "India Transactions",
    category,
    title: `${merchant || "Merchant"} · ₹${amt.toLocaleString("en-IN")}`,
    detail: `Category: ${catRaw || "Transaction"}${first ? " · Customer: " + first + " " + last : ""}`,
    date: dateStr,
    time: timeStr,
    location: locName,
    icon,
    tone,
    rawAmount: amt,
  };
}

export function normalizeHouseholdRow(cols: string[], index: number): Receipt | null {
  // Columns: Date, Mode, Category, Subcategory, Note, Amount, Income/Expense, Currency
  if (cols.length < 6) return null;
  const dt = cols[0];
  const mode = cols[1] || "Cash";
  const cat = cols[2] || "";
  const subcat = cols[3] || "";
  const note = cols[4] || "";
  const amount = parseFloat(cols[5] || "0");
  const type = cols[6] || "Expense";

  let dateStr = "2018-01-01";
  let timeStr = "12:00";
  if (dt) {
    const [dPart, tPart] = dt.trim().split(/\s+/);
    if (dPart) {
      const parts = dPart.split("/");
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        dateStr = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
    if (tPart) {
      const tParts = tPart.split(":");
      if (tParts.length >= 2 && tParts[0] && tParts[1]) {
        timeStr = `${tParts[0].padStart(2, "0")}:${tParts[1].padStart(2, "0")}`;
      }
    }
  }

  let category: Category = "Purchases";
  let icon = "◇";
  let tone = "purchases";

  const catLower = cat.toLowerCase();
  if (catLower === "transportation") {
    category = "Places";
    icon = "⌖";
    tone = "places";
  } else if (catLower === "festivals" || catLower === "culture") {
    category = "Events";
    icon = "○";
    tone = "events";
  }

  return {
    id: `HT-${String(index).padStart(4, "0")}`,
    dataset: "Household Ledger",
    category,
    title: `${subcat || cat || "Transaction"} · ₹${amount.toLocaleString("en-IN")}`,
    detail: `${note ? note + " · " : ""}${mode} (${type})`,
    date: dateStr,
    time: timeStr,
    location: mode,
    icon,
    tone,
    rawAmount: amount,
  };
}
