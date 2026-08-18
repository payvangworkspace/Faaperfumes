#!/usr/bin/env python3
"""Scrape UAE perfume shops, download bottle photos, emit extraCatalog.js."""

from __future__ import annotations

import hashlib
import json
import os
import re
import ssl
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/Users/priyanshunigam/Desktop/newProject")
CACHE = ROOT / "scripts" / "perfume-cache.json"
DEST = ROOT / "public" / "perfumes" / "bottles"
OUT = ROOT / "src" / "extraCatalog.js"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}
CTX = ssl.create_default_context()

EXISTING = {
    "armaf club de nuit intense man",
    "riiffs goodness oud purple wave",
    "ajmal bastion",
    "oud arabia jannat e zuhur",
    "oud arabia zainab",
    "valentino born in roma",
    "french avenue liquid brun",
    "lattafa khamrah",
    "lattafa khamrah qahwa",
    "arabiyat al noor",
    "blue by ahmed",
    "prada l homme eau de toilette",
    "tom ford ombre leather",
    "chopard oud malaki",
    "afnan 9pm",
    "lattafa eclaire",
    "giorgio armani stronger with you",
    "bleu de chanel",
    "elie saab le parfum",
    "rasasi hawas",
    "jean paul gaultier scandal",
    "dior sauvage",
    "versace eros",
    "paco rabanne invictus",
    "lattafa asad",
    "viktor rolf spicebomb",
    "lattafa yara",
    "yves saint laurent libre",
    "gucci bloom",
    "mugler alien",
    "lattafa khamrah dukhan",
}

SKIP = re.compile(
    r"decant|sample|vial|deodorant|deo\b|body spray|shower gel|lotion|gift set|"
    r"tester|refill|mini\b|10ml|15ml|5ml|12ml|30ml|travel|combo|bundle|3-piece|"
    r"piece set|hair mist|attar oil|bakhoor|incense|candle",
    re.I,
)

KNOWN_BRANDS = [
    "Lattafa",
    "Armaf",
    "Afnan",
    "Rasasi",
    "Ajmal",
    "Ahmed Al Maghribi",
    "French Avenue",
    "Arabiyat",
    "Riiffs",
    "Dior",
    "Chanel",
    "Gucci",
    "Prada",
    "Versace",
    "Valentino",
    "Tom Ford",
    "Yves Saint Laurent",
    "YSL",
    "Giorgio Armani",
    "Armani",
    "Jean Paul Gaultier",
    "Paco Rabanne",
    "Rabanne",
    "Mugler",
    "Elie Saab",
    "Chopard",
    "Viktor & Rolf",
    "Dolce & Gabbana",
    "Dolce Gabbana",
    "Burberry",
    "Givenchy",
    "Hermes",
    "Hermès",
    "Bvlgari",
    "Bulgari",
    "Calvin Klein",
    "Hugo Boss",
    "Montblanc",
    "Carolina Herrera",
    "Lancome",
    "Lancôme",
    "Estee Lauder",
    "Estée Lauder",
    "Marc Jacobs",
    "Narciso Rodriguez",
    "Chloe",
    "Chloé",
    "Kayali",
    "Maison Alhambra",
    "Al Haramain",
    "Swiss Arabian",
    "Amouage",
    "Creed",
    "Mancera",
    "Montale",
    "Initio",
    "Kilian",
    "Byredo",
    "Le Labo",
    "Maison Margiela",
    "Jo Malone",
    "Guerlain",
    "Terre d'Hermes",
    "Acqua di Gio",
    "Issey Miyake",
    "Davidoff",
    "Dunhill",
    "Bentley",
    "Azzaro",
    "Coach",
    "Jimmy Choo",
    "Good Girl",
    "Libre",
    "Sauvage",
    "Invictus",
    "Eros",
    "Hawas",
    "Khamrah",
    "Yara",
    "Asad",
    "Fakhar",
    "Qaed Al Fursan",
    "Badee Al Oud",
    "Ana Abiyedh",
    "Raghba",
    "Qahira",
    "Hayaati",
    "Oud Mood",
    "Velvet Oud",
    "Supremacy",
    "Club de Nuit",
    "9PM",
    "9AM",
    "Maahir",
    "Asad Bourbon",
    "Honor & Glory",
    "Vintage Radio",
    "Angham",
    "Teriaq",
    "Her Confession",
    "Eclaire",
    "Opulent",
    "Shaheen",
]


def fetch_json(url, timeout=25):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        return json.loads(r.read().decode())


def gender_from_title(title):
    t = title.lower()
    if any(
        x in t
        for x in ["for women", "pour femme", "for her", "pour elle"]
    ):
        return "women"
    if any(
        x in t
        for x in ["for men", "pour homme", "for him", "pour lui"]
    ):
        return "men"
    if "unisex" in t:
        return "unisex"
    if re.search(r"\b(women|woman|femme|donna|lady|her)\b", t):
        return "women"
    if re.search(r"\b(men|man|homme|uomo|him)\b", t):
        return "men"
    return None


def norm(title):
    t = title.lower()
    t = re.sub(r"[^a-z0-9]+", " ", t)
    t = re.sub(
        r"\b(eau de parfum|eau de toilette|edp|edt|parfum|perfume|for men|for women|for him|for her|unisex|100ml|90ml|80ml|75ml|50ml|125ml|150ml|200ml|ml)\b",
        "",
        t,
    )
    return re.sub(r"\s+", " ", t).strip()


def extract_size(title):
    m = re.search(r"(\d{2,3})\s*ml", title, re.I)
    return f"{m.group(1)}ml" if m else "100ml"


def extract_ml(title):
    m = re.search(r"(\d{2,3})\s*ml", title, re.I)
    return int(m.group(1)) if m else 100


def concentration(title):
    t = title.lower()
    if "extrait" in t:
        return "Extrait"
    if "parfum" in t and "eau de parfum" not in t and "edp" not in t:
        return "Parfum"
    if "edt" in t or "toilette" in t:
        return "EDT"
    return "EDP"


def brand_of(title, vendor):
    t = title.strip()
    for b in KNOWN_BRANDS:
        if t.lower().startswith(b.lower()) or b.lower() in t.lower()[:28]:
            return b
    if vendor and vendor.lower() not in {"perfume gallery", "emirates fragrance", "samawa", "default"}:
        return vendor.strip()
    parts = re.split(r"\s+", t)
    return " ".join(parts[:2]) if len(parts) > 1 else parts[0]


def family_of(title, category):
    t = title.lower()
    if any(x in t for x in ["oud", "malaki", "bakhoor"]):
        return "Woody Oriental"
    if any(x in t for x in ["leather", "tobacco"]):
        return "Leather"
    if any(x in t for x in ["vanilla", "khamrah", "eclaire", "coffee", "qahwa", "praline"]):
        return "Gourmand"
    if any(x in t for x in ["rose", "bloom", "flora", "flower", "jasmine"]):
        return "Floral"
    if any(x in t for x in ["bleu", "blue", "sauvage", "acqua", "marine", "fresh"]):
        return "Aromatic Fresh"
    if category == "women":
        return "Floral Oriental"
    if category == "unisex":
        return "Woody Floral"
    return "Woody Spicy"


def notes_of(name, category, family):
    seed = int(hashlib.md5(name.encode()).hexdigest(), 16)
    pools = {
        "men": {
            "top": [["Bergamot", "Lemon"], ["Apple", "Pink Pepper"], ["Grapefruit", "Cardamom"], ["Pineapple", "Mint"]],
            "heart": [["Lavender", "Geranium"], ["Cedar", "Nutmeg"], ["Jasmine", "Iris"], ["Sage", "Cinnamon"]],
            "base": [["Amber", "Musk"], ["Sandalwood", "Vetiver"], ["Tonka", "Vanilla"], ["Oud", "Leather"]],
        },
        "women": {
            "top": [["Bergamot", "Pear"], ["Rose", "Lychee"], ["Mandarin", "Pink Pepper"], ["Peach", "Freesia"]],
            "heart": [["Jasmine", "Peony"], ["Orange Blossom", "Iris"], ["Tuberose", "Rose"], ["Ylang-Ylang", "Lily"]],
            "base": [["Vanilla", "Musk"], ["Sandalwood", "Amber"], ["Patchouli", "Cashmere"], ["Benzoin", "Praline"]],
        },
        "unisex": {
            "top": [["Bergamot", "Cardamom"], ["Pink Pepper", "Tea"], ["Saffron", "Citrus"], ["Fig Leaf", "Pepper"]],
            "heart": [["Rose", "Cedar"], ["Iris", "Incense"], ["Lavender", "Orris"], ["Jasmine", "Oud"]],
            "base": [["Musk", "Amber"], ["Sandalwood", "Vetiver"], ["Vanilla", "Tonka"], ["Leather", "Patchouli"]],
        },
    }
    pool = pools.get(category, pools["unisex"])
    if "Gourmand" in family:
        return {
            "top": ["Cinnamon", "Cardamom"],
            "heart": ["Praline", "Dates"],
            "base": ["Vanilla", "Tonka", "Amber"],
        }
    if "Leather" in family:
        return {"top": ["Cardamom"], "heart": ["Leather", "Jasmine"], "base": ["Patchouli", "Amber"]}
    if "Oud" in family or "Oriental" in family:
        return {"top": ["Saffron", "Rose"], "heart": ["Oud", "Patchouli"], "base": ["Amber", "Musk"]}
    return {
        "top": pool["top"][seed % len(pool["top"])],
        "heart": pool["heart"][(seed // 7) % len(pool["heart"])],
        "base": pool["base"][(seed // 13) % len(pool["base"])],
    }


def display_name(title):
    t = re.sub(r"\s+", " ", title).strip()
    t = re.sub(r"\s*[-–|]\s*", " ", t)
    return t[:72].strip()


def scrape():
    if CACHE.exists():
        data = json.loads(CACHE.read_text())
        print("cache", len(data))
        return data
    stores = [
        ("gallery", "https://perfumegallery.ae"),
        ("emirates", "https://emiratesfragrance.com"),
        ("samawa", "https://samawa.ae"),
    ]
    allp = []
    for name, base in stores:
        for page in range(1, 8):
            url = f"{base}/products.json?limit=250&page={page}"
            try:
                obj = fetch_json(url)
            except Exception as e:
                print(name, page, "ERR", e)
                break
            products = obj.get("products") or []
            if not products:
                break
            print(name, page, len(products))
            for p in products:
                title = p.get("title") or ""
                if SKIP.search(title):
                    continue
                v = (p.get("variants") or [{}])[0]
                try:
                    price = float(v.get("price") or 0)
                except Exception:
                    continue
                if price < 45 or price > 1600:
                    continue
                img = ((p.get("images") or [{}])[0]).get("src")
                if not img:
                    continue
                g = gender_from_title(title)
                if not g:
                    continue
                cmp = v.get("compare_at_price")
                try:
                    cmp = float(cmp) if cmp else None
                except Exception:
                    cmp = None
                allp.append(
                    {
                        "store": name,
                        "title": title,
                        "vendor": p.get("vendor") or "",
                        "gender": g,
                        "price": price,
                        "compare": cmp,
                        "image": img.split("?")[0] + "?width=1200",
                    }
                )
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(allp))
    print("scraped", len(allp))
    return allp


def score(p):
    ml = extract_ml(p["title"])
    s = 0
    if 75 <= ml <= 125:
        s += 8
    elif ml > 150:
        s -= 3
    if p["compare"] and p["compare"] > p["price"]:
        s += 3
    brand = brand_of(p["title"], p["vendor"])
    if brand in KNOWN_BRANDS:
        s += 4
    if p["store"] == "gallery":
        s += 2
    if p["store"] == "emirates":
        s += 1
    # prefer mid prices for a shoppable mix
    if 70 <= p["price"] <= 650:
        s += 2
    return s


def is_existing(title):
    n = norm(title)
    return any(e in n or n in e for e in EXISTING)


def pick(allp, gender, limit):
    items = []
    for p in allp:
        g = gender_from_title(p["title"])
        if g != gender or is_existing(p["title"]):
            continue
        items.append({**p, "gender": g})
    items.sort(key=lambda p: (-score(p), p["price"]))
    seen = set()
    out = []
    brands = {}
    for p in items:
        k = norm(p["title"])
        if k in seen or len(k) < 5:
            continue
        b = brand_of(p["title"], p["vendor"])
        brands.setdefault(b, 0)
        if brands[b] >= 4 and gender != "unisex":
            continue
        if brands[b] >= 3 and gender == "unisex":
            continue
        seen.add(k)
        brands[b] += 1
        out.append(p)
        if len(out) >= limit:
            break
    return out


def slugify(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:70]


def download(url):
    req = urllib.request.Request(url, headers={**HEADERS, "Accept": "image/*"})
    with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
        return r.read(), r.headers.get_content_type()


def to_jpg(src, dest):
    subprocess.check_call(
        ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82", str(src), "--out", str(dest)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def save_image(p):
    slug = slugify(display_name(p["title"]))
    dest = DEST / f"{slug}.jpg"
    if dest.exists() and dest.stat().st_size > 8000:
        return slug, dest
    try:
        data, ctype = download(p["image"])
        if len(data) < 4000:
            return None, None
        ext = ".jpg"
        if "png" in (ctype or ""):
            ext = ".png"
        if "webp" in (ctype or ""):
            ext = ".webp"
        raw = DEST / f"{slug}.raw{ext}"
        raw.write_bytes(data)
        to_jpg(raw, dest)
        raw.unlink(missing_ok=True)
        if dest.stat().st_size < 4000:
            dest.unlink(missing_ok=True)
            return None, None
        return slug, dest
    except Exception as e:
        print("img fail", p["title"][:50], e)
        return None, None


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def emit_entry(p, slug):
    name = display_name(p["title"])
    category = p["gender"]
    family = family_of(name, category)
    notes = notes_of(name, category, family)
    brand = brand_of(name, p["vendor"])
    size = extract_size(p["title"])
    conc = concentration(p["title"])
    price = int(round(p["price"]))
    compare = int(round(p["compare"])) if p["compare"] and p["compare"] > p["price"] else int(round(price * 1.32))
    if compare <= price:
        compare = price + 20
    occasion = "Evening" if any(x in family for x in ["Oriental", "Leather", "Gourmand"]) else "All day"
    longevity = "8–10 hours" if conc in {"EDP", "Parfum", "Extrait"} else "6–8 hours"
    desc = (
        f"{name} by {brand} is a {family.lower()} {conc} for "
        f"{'everyone' if category == 'unisex' else category}. "
        f"Opening with {' and '.join(n.lower() for n in notes['top'][:2])}, "
        f"it settles into {' and '.join(n.lower() for n in notes['heart'][:2])} "
        f"before a lasting trail of {' and '.join(n.lower() for n in notes['base'][:2])}."
    )
    return {
        "name": name,
        "image": f"/perfumes/bottles/{slug}.jpg",
        "brand": brand,
        "category": category,
        "size": size,
        "concentration": conc,
        "family": family,
        "longevity": longevity,
        "occasion": occasion,
        "price": price,
        "compareAt": compare,
        "notes": notes,
        "description": desc,
    }


def to_js(entries):
    lines = ["export const extraEntries = ["]
    for e in entries:
        lines.append("  {")
        lines.append(f"    name: {js_str(e['name'])},")
        lines.append(f"    image: {js_str(e['image'])},")
        lines.append(f"    brand: {js_str(e['brand'])},")
        lines.append(f"    category: {js_str(e['category'])},")
        lines.append(f"    size: {js_str(e['size'])},")
        lines.append(f"    concentration: {js_str(e['concentration'])},")
        lines.append(f"    family: {js_str(e['family'])},")
        lines.append(f"    longevity: {js_str(e['longevity'])},")
        lines.append(f"    occasion: {js_str(e['occasion'])},")
        lines.append(f"    price: {e['price']},")
        lines.append(f"    compareAt: {e['compareAt']},")
        notes = e["notes"]
        lines.append("    notes: {")
        lines.append(f"      top: {json.dumps(notes['top'])},")
        lines.append(f"      heart: {json.dumps(notes['heart'])},")
        lines.append(f"      base: {json.dumps(notes['base'])},")
        lines.append("    },")
        lines.append(f"    description: {js_str(e['description'])},")
        lines.append("  },")
    lines.append("]")
    lines.append("")
    return "\n".join(lines)


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    allp = scrape()
    want = {"men": 40, "women": 50, "unisex": 36}
    selected = []
    for g, n in want.items():
        picked = pick(allp, g, n)
        print("picked", g, len(picked))
        selected.extend(picked)

    kept = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(save_image, p): p for p in selected}
        for fut in as_completed(futs):
            p = futs[fut]
            slug, dest = fut.result()
            if not slug:
                continue
            kept.append((p, slug))
            print("ok", p["gender"], int(p["price"]), p["title"][:60])

    # trim to exact counts after successful downloads
    final = []
    for g, n in [("men", 33), ("women", 42), ("unisex", 30)]:
        group = [x for x in kept if x[0]["gender"] == g]
        group.sort(key=lambda x: -score(x[0]))
        # we already have some existing in those categories; extra only
        take = n
        final.extend(group[:take])

    entries = [emit_entry(p, slug) for p, slug in final]
    OUT.write_text(to_js(entries))
    print("wrote", OUT, "entries", len(entries))
    print({g: sum(1 for e in entries if e["category"] == g) for g in ("men", "women", "unisex")})


if __name__ == "__main__":
    main()
