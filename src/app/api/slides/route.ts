import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export interface HeroSlide {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  badge?: string;
  linkUrl?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    image: "https://fedardistribuidora.com.ar/portada/EVITA%20SOLDADURA%20(1).jpg",
    title: "PRACTICOS ORGANIZADORES PARA TODOS LOS ARTICULOS",
    subtitle: "Sistema Mostrador",
    badge: "+1.500 ferreterías y buloneras activas",
    linkUrl: "/productos",
  },
  {
    id: "default-2",
    image: "https://fedardistribuidora.com.ar/portada/54%20PLASTICO%201%20(4)%20(1)%20(3)%20(1)%20(1).jpg",
    title: "EXHIBIDOR INCLUIDO EN CADA GAVETERO",
    subtitle: "Organización de Mostrador",
    badge: "Exhibidor incluido con el surtido",
    linkUrl: "/productos",
  },
  {
    id: "default-3",
    image: "https://fedardistribuidora.com.ar/portada/54%20PLASTICO%201%20(4)%20(1)%20(1).jpg",
    title: "VISITA PERIODICA DEL VENDEDOR",
    subtitle: "Atención Personalizada",
    badge: "Reposición periódica por corredor",
    linkUrl: "/productos",
  },
  {
    id: "default-4",
    image: "https://fedardistribuidora.com.ar/portada/vacio%20(1).jpg",
    title: "SURTIDO DE MEDIDAS Y MODELOS",
    subtitle: "Stock Permanente",
    badge: "Stock permanente para entrega inmediata",
    linkUrl: "/productos",
  },
];

export async function GET() {
  try {
    const portadaBaseUrl =
      process.env.PORTADA_URL ||
      process.env.NEXT_PUBLIC_PORTADA_URL ||
      "https://fedardistribuidora.com.ar/portada";

    const rows = await query<any>(`
      SELECT 
        p.PO_ID,
        p.PO_ARCHIVO,
        p.PO_TITULO,
        p.PO_DESCRIPCION,
        p.PO_IDPRODUCTO,
        p.PO_ORDENAR,
        p.PO_STATUS,
        prod.PR_TITULO AS PRODUCTO_TITULO,
        prod.PR_URL AS PRODUCTO_URL
      FROM PORTADA p
      LEFT JOIN PRODUCTOS prod ON prod.PR_ID = p.PO_IDPRODUCTO
      ORDER BY p.PO_ORDENAR ASC, p.PO_ID DESC
    `);

    if (rows && rows.length > 0) {
      // If there are active slides (PO_STATUS = 1), filter by them; otherwise use all rows
      const activeRows = rows.filter((r: any) => r.PO_STATUS === 1);
      const targetRows = activeRows.length > 0 ? activeRows : rows;

      const dynamicSlides: HeroSlide[] = targetRows
        .filter((r: any) => r.PO_ARCHIVO && r.PO_ARCHIVO.trim() !== "")
        .map((r: any, idx: number) => {
          const fileName = r.PO_ARCHIVO.trim();
          const imgUrl = fileName.startsWith("http")
            ? fileName
            : `${portadaBaseUrl.replace(/\/$/, "")}/${encodeURI(fileName)}`;

          const title = (r.PO_TITULO || "").trim() || "Organizador de Mostrador";
          const subtitle = (r.PO_DESCRIPCION || "").trim() || "Sistema Mostrador";

          let linkUrl = "/productos";
          if (r.PRODUCTO_URL) {
            linkUrl = `/productos/${r.PRODUCTO_URL.toLowerCase()}`;
          } else if (r.PO_IDPRODUCTO > 0) {
            linkUrl = `/productos/${r.PO_IDPRODUCTO}`;
          }

          return {
            id: r.PO_ID || `slide-${idx}`,
            image: imgUrl,
            title,
            subtitle,
            badge: "+1.500 ferreterías y buloneras activas",
            linkUrl,
          };
        });

      if (dynamicSlides.length > 0) {
        return NextResponse.json({
          success: true,
          slides: dynamicSlides,
        });
      }
    }

    return NextResponse.json({
      success: true,
      slides: DEFAULT_SLIDES,
    });
  } catch {
    return NextResponse.json({
      success: true,
      slides: DEFAULT_SLIDES,
    });
  }
}
