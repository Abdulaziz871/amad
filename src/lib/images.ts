import fs from "node:fs";
import path from "node:path";

const photoExtensions = ["jpg", "jpeg", "png", "webp"];
const logoExtensions = ["svg", "png", "webp"];

function findFile(base: string, dir: string, baseName: string, extensions: string[]): string | null {
  for (const ext of extensions) {
    const relPath = `/${base}/${dir}/${baseName}.${ext}`;
    const absPath = path.join(process.cwd(), "public", relPath);
    if (fs.existsSync(absPath)) return relPath;
  }

  // Fallback: match any file in the folder that starts with baseName
  // (e.g. "alinma-logo.svg" for baseName "alinma").
  const dirPath = path.join(process.cwd(), "public", base, dir);
  if (fs.existsSync(dirPath)) {
    const match = fs
      .readdirSync(dirPath)
      .find((file) => {
        const ext = path.extname(file).slice(1).toLowerCase();
        const name = path.basename(file, path.extname(file)).toLowerCase();
        return extensions.includes(ext) && name.startsWith(baseName.toLowerCase());
      });
    if (match) return `/${base}/${dir}/${match}`;
  }

  return null;
}

export function programHeroImage(slug: string): string | null {
  return findFile("images", "programs", slug, photoExtensions);
}

export function galleryImage(id: string): string | null {
  return findFile("images", "gallery", id, photoExtensions);
}

export function galleryImages(): string[] {
  const dirPath = path.join(process.cwd(), "public", "images", "gallery");
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((file) => photoExtensions.includes(path.extname(file).slice(1).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/images/gallery/${file}`);
}

export function journeyImage(index: number): string | null {
  return findFile("images", "journey", String(index + 1), photoExtensions);
}

export function ctaImage(name: string): string | null {
  return findFile("images", "cta", name, photoExtensions);
}

export function partnerLogo(name: string, tone?: "white" | "black" | "dark"): string | null {
  if (tone) {
    const toned = findFile("logos", "partners", `${name}-${tone}`, logoExtensions);
    if (toned) return toned;
  }
  return findFile("logos", "partners", name, logoExtensions);
}
