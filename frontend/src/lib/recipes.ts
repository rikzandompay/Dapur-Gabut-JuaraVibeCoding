export type Recipe = {
  slug: string;
  name: string;
  tagline: string;
  time: string;
  servings: string;
  difficulty: string;
  matchedIngredients: string[];
  ingredients: { qty: string; item: string }[];
  steps: string[];
};

export const sampleRecipe: Recipe = {
  slug: "nasi-goreng-bayam",
  name: "Nasi Goreng Bayam & Telur Mata Sapi",
  tagline:
    "Sajian rumahan yang harum, ringan, dan kaya nutrisi — siap di meja Anda dalam waktu kurang dari 20 menit.",
  time: "18 menit",
  servings: "2 porsi",
  difficulty: "Mudah",
  matchedIngredients: ["Telur", "Nasi", "Bayam"],
  ingredients: [
    { qty: "2 piring", item: "Nasi putih dingin" },
    { qty: "2 butir", item: "Telur ayam" },
    { qty: "1 ikat", item: "Bayam segar, dipetik" },
    { qty: "3 siung", item: "Bawang putih, cincang halus" },
    { qty: "2 siung", item: "Bawang merah, iris tipis" },
    { qty: "1 sdm", item: "Kecap manis" },
    { qty: "1 sdt", item: "Garam laut" },
    { qty: "½ sdt", item: "Lada putih" },
    { qty: "2 sdm", item: "Minyak goreng" },
  ],
  steps: [
    "Panaskan minyak di wajan dengan api sedang, lalu tumis bawang putih dan bawang merah hingga harum dan keemasan.",
    "Masukkan bayam, aduk sebentar hingga sedikit layu agar warnanya tetap hijau cerah.",
    "Tambahkan nasi putih dingin, aduk merata bersama bumbu hingga setiap butir nasi terlapisi.",
    "Bumbui dengan kecap manis, garam, dan lada putih. Aduk hingga warna nasi merata dan harum tercium.",
    "Di wajan terpisah, ceplok dua butir telur mata sapi dengan tepi renyah dan kuning telur setengah matang.",
    "Sajikan nasi goreng di piring saji, letakkan telur di atasnya, dan hidangkan selagi hangat.",
  ],
};
