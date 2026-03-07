import { useState } from "react";
import Link from "next/link";
import { Fragment } from "react";

const products = [
    {
        id: 1,
        name: "PCS",
        superscript: "®",
        title: "Premium Acrylic Photo",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005015/premium-acrylic-photo_ojccxc.webp",
        bg: "#ffffff",
        redirectTo: "/products/acrylic-photo",
    },
    {
        id: 2,
        name: "PCS",
        superscript: "®",
        title: "Framed Acrylic Photo",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005022/framed-acrylic-photo_jpyvie.webp",
        bg: "#ffffff",
        redirectTo: "/products/framed-acrylic-photo",
    },
    {
        id: 3,
        name: "PCS",
        superscript: "®",
        title: "Wall Clocks",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005017/wall-clock_cz1g2q.webp",
        bg: "#ffffff",
        redirectTo: "/products/acrylic-wall-clock",
    },
    {
        id: 4,
        name: "PCS",
        superscript: "®",
        title: "Acrylic Cut",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005007/acrylic-cutout_wxsn8e.webp",
        bg: "#ffffff",
        redirectTo: "/products/acrylic-cutout",
    },
    {
        id: 5,
        name: "PCS",
        superscript: "®",
        title: "Name plates",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005010/acrylic-nameplate_cecbxw.webp",
        bg: "#ffffff",
        redirectTo: "/products/acrylic-nameplate",
    },
    {
        id: 6,
        name: "PCS",
        superscript: "®",
        title: "Mini Photo Gallery Set",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772005010/mini-photo-gallery_d73vpc.webp",
        bg: "#ffffff",
        redirectTo: "/products/miniphoto-gallery",
    },
    {
        id: 7,
        name: "PCS",
        superscript: "®",
        title: "Acrylic Photo",
        image: "https://res.cloudinary.com/dewxpvl5s/image/upload/v1772008153/acrylic-photo_qkgakw.webp",
        bg: "#ffffff",
        redirectTo: "/products/acrylic-photo",
    },
];

function ProductCard({ product }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={product.redirectTo}>
            <div
                className="flex flex-col items-center group cursor-pointer bg-white"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Image Container */}
                <div
                    className="w-full overflow-hidden rounded-sm relative"
                    style={{
                        backgroundColor: product.bg,
                        aspectRatio: "4/3",
                        boxShadow: hovered
                            ? "0 8px 30px rgba(0,0,0,0.15)"
                            : "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "box-shadow 0.3s ease",
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        style={{
                            transform: hovered ? "scale(1.04)" : "scale(1)",
                            transition: "transform 0.4s ease",
                        }}
                    />
                    {/* Subtle overlay on hover */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.08) 0%, transparent 60%)",
                            opacity: hovered ? 1 : 0,
                            transition: "opacity 0.3s ease",
                        }}
                    />
                </div>

                {/* Title */}
                <p
                    className="mt-3 text-center text-sm font-medium tracking-wide"
                    style={{
                        color: "#2d2d2d",
                        fontFamily: "'Segoe UI', sans-serif",
                        fontSize: "0.92rem",
                        letterSpacing: "0.01em",
                    }}
                >
                    {product.name} {" "}
                    {product.title}
                </p>
            </div>
        </Link>
    );
}

export default function PCSSection() {
    return (

        <Fragment>
            <section
                className="w-full pt-20 pb-6  px-6 bg-white"
                style={{
                    backgroundColor: "#ffffff",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >

                {/* Grid */}
                <div className="mx-auto grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 max-w-[1100px]">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Responsive styles */}
                <style>{`
        @media (max-width: 900px) {
          .PCS-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .PCS-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
            </section>

        </Fragment>
    );
}