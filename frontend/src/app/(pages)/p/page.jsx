"use client";
import React, { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Shape,
  Group,
  Line,
  Circle,
  Text,
} from "react-konva";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/section/Sidebar";
import DeliveryEstimator from "@/components/section/EstimateDelivery";


const FRAME_SHAPES = {
  square: { cornerRadius: 0, hasDualBorder: false, isCircle: false },
  "rounded-rect": { cornerRadius: 20, hasDualBorder: false, isCircle: false },
  "extra-rounded": { cornerRadius: 50, hasDualBorder: false, isCircle: false },
  circle: { cornerRadius: 0, hasDualBorder: false, isCircle: true },
  diamond: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isDiamond: true,
  },
  star: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isStar: true,
  },
  hexagon: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isPolygon: true,
    sides: 6,
  },
  octagon: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isPolygon: true,
    sides: 8,
  },
  heart: {
    cornerRadius: 0,
    hasDualBorder: false,
    isCircle: false,
    isHeart: true,
  },
  "dual-square": {
    cornerRadius: 0,
    hasDualBorder: true,
    isCircle: false,
    innerBorderGap: 12,
  },
  "dual-rounded": {
    cornerRadius: 20,
    hasDualBorder: true,
    isCircle: false,
    innerBorderGap: 12,
  },
  "dual-circle": {
    cornerRadius: 0,
    hasDualBorder: true,
    isCircle: true,
    innerBorderGap: 12,
  },
  "square-clock": { cornerRadius: 8, isClock: true },
  "rounded-square-clock": { cornerRadius: 30, isClock: true },
  "circle-clock": { isCircle: true, isClock: true },
  "leaf-clock": { isLeaf: true, isClock: true },
  "hexagon-clock": { isHexagon: true, isClock: true },
  "octagon-clock": { isOctagon: true, isClock: true },
  "diamond-clock": { isDiamond: true, isClock: true },
};

const SIZE_OPTIONS = [
  {
    label: "12x9",
    widthCm: 30.48,
    heightCm: 22.86,
    widthInch: 12,
    heightInch: 9,
  },
  {
    label: "16x12",
    widthCm: 40.64,
    heightCm: 30.48,
    widthInch: 16,
    heightInch: 12,
  },
  {
    label: "18x12",
    widthCm: 45.72,
    heightCm: 30.48,
    widthInch: 18,
    heightInch: 12,
  },
];

const THICKNESS_OPTIONS = [
  { label: "3mm", value: 3 },
  { label: "5mm", value: 5 },
  { label: "8mm", value: 8 },
];

const PRICES = {
  frame: {
    "12x9": { 3: 649, 5: 949, 8: 1349 },
    "16x12": { 3: 999, 5: 1449, 8: 2299 },
    "18x12": { 3: 1399, 5: 1899, 8: 2699 },
  },
  "acrylic-cutout": {
    "12x9": { 3: 1499, 5: 2099, 8: 2899 },
    "16x12": { 3: 1699, 5: 2299, 8: 3099 },
    "18x12": { 3: 1899, 5: 2499, 8: 3299 },
  },
  "acrylic-clock": {
    "12x9": { 3: 999, 5: 1399, 8: 1799 },
    "16x12": { 3: 1299, 5: 1599, 8: 1999 },
    "18x12": { 3: 1499, 5: 1799, 8: 2199 },
  },
  "mini-gallery": {
    "12x9": { 3: 649, 5: 849, 8: 1299 },
    "16x12": { 3: 899, 5: 1399, 8: 2399 },
    "18x12": { 3: 1099, 5: 1799, 8: 2899 },
  },
  "clear-acrylic-photo": {
    "12x9": { 3: 749, 5: 999, 8: 1299 },
    "16x12": { 3: 999, 5: 1499, 8: 1999 },
    "18x12": { 3: 1899, 5: 2199, 8: 2899 },
  },
};

const getProductType = (isKeychain, isClock, isGal, isCutout) => {
  if (isKeychain) return "clear-acrylic-photo";
  if (isClock) return "acrylic-clock";
  if (isGal) return "mini-gallery";
  if (isCutout) return "acrylic-cutout";
  return "frame";
};

export default function FrameProductPage() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]); // ✅ 12x9
  const [selectedThickness, setSelectedThickness] = useState(3);
  const [orientation, setOrientation] = useState("landscape");
  const [designData, setDesignData] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [mockupImg, setMockupImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAcrylicCutout, setIsAcrylicCutout] = useState(false);
  const [isAcrylicClock, setIsAcrylicClock] = useState(false);
  const [isGallery, setIsGallery] = useState(false);
  const [isAcrylicKeychain, setIsAcrylicKeychain] = useState(false);

  // const saveToCart = () => {
  //   if (!designData || !photoImg) return;

  //   // Create a small thumbnail for cart preview (max 150x150)
  //   const createThumbnail = () => {
  //     const canvas = document.createElement('canvas');
  //     const maxSize = 150;
  //     const scale = Math.min(maxSize / photoImg.width, maxSize / photoImg.height);

  //     canvas.width = photoImg.width * scale;
  //     canvas.height = photoImg.height * scale;

  //     const ctx = canvas.getContext('2d');
  //     ctx.drawImage(photoImg, 0, 0, canvas.width, canvas.height);

  //     // Use lower quality JPEG to save space
  //     return canvas.toDataURL('image/jpeg', 0.6);
  //   };

  //   const thumbnailData = createThumbnail();

  //   // Create cart item WITHOUT the full-size image
  //   const cartItem = {
  //     id: Date.now().toString(),
  //     // Store ONLY the thumbnail, not the full image
  //     imageUri: thumbnailData,
  //     previewImage: thumbnailData,
  //     // Copy other design data but exclude large image fields
  //     frameShapeId: designData.frameShapeId,
  //     frameColor: designData.frameColor,
  //     matColor: designData.matColor,
  //     productType: designData.productType,
  //     keychainShape: designData.keychainShape,
  //     layoutName: designData.layoutName,
  //     photoCount: designData.photoCount,
  //     clockNumberColor: designData.clockNumberColor,
  //     clockHandColor: designData.clockHandColor,
  //     clockSecondHandColor: designData.clockSecondHandColor,
  //     hasClockOverlay: designData.hasClockOverlay,
  //     // Cart-specific data
  //     selectedSize: selectedSize.label,
  //     selectedThickness,
  //     orientation,
  //     price: PRICES[getProductType(isAcrylicKeychain, isAcrylicClock, isGallery, isAcrylicCutout)]?.[selectedSize.label]?.[selectedThickness],
  //     timestamp: Date.now(),
  //     previewWidthCm: selectedSize.widthCm,
  //     previewHeightCm: selectedSize.heightCm,
  //     widthInch: selectedSize.widthInch,
  //     heightInch: selectedSize.heightInch,
  //     finalWidthCm: orientation === "portrait" ? selectedSize.heightCm : selectedSize.widthCm,
  //     finalHeightCm: orientation === "portrait" ? selectedSize.widthCm : selectedSize.heightCm,
  //     finalWidthInch: orientation === "portrait" ? selectedSize.heightInch : selectedSize.widthInch,
  //     finalHeightInch: orientation === "portrait" ? selectedSize.widthInch : selectedSize.heightInch,
  //     isAcrylicCutout,
  //     isAcrylicClock,
  //     isGallery,
  //     isAcrylicKeychain,
  //   };

  //   try {
  //     const token = localStorage.getItem("token");
  //     const userCartKey = `frameCart_${token?.substring(0, 20)}`;

  //     let cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
  //     cart.push(cartItem);
  //     localStorage.setItem(userCartKey, JSON.stringify(cart));

  //     console.log("✅ Added to cart successfully");
  //     router.push("/cart");
  //   } catch (e) {
  //     if (e.name === "QuotaExceededError") {
  //       console.error("LocalStorage quota exceeded, clearing old items...");

  //       const token = localStorage.getItem("token");
  //       const userCartKey = `frameCart_${token?.substring(0, 20)}`;

  //       try {
  //         // Keep only the last 3 items + new item
  //         let cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
  //         cart = cart.slice(-3); // Keep last 3 items
  //         cart.push(cartItem);

  //         localStorage.removeItem(userCartKey);
  //         localStorage.setItem(userCartKey, JSON.stringify(cart));

  //         alert("Cart was optimized. Added new item successfully!");
  //         router.push("/cart");
  //       } catch (secondError) {
  //         console.error("Still too large:", secondError);
  //         alert("Unable to add item. Please try with a different image or contact support.");
  //       }
  //     } else {
  //       console.error("Error saving to cart:", e);
  //       alert("Failed to add item to cart. Please try again.");
  //     }
  //   }
  // };
  const saveToCart = () => {
    if (!designData || !photoImg) return;

    // ✅ Check login first
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   // Save intended destination then redirect to login
    //   sessionStorage.setItem('redirectAfterLogin', '/frame-product'); // change to your actual path
    //   router.push('/login');
    //   return;
    // }
    // ✅ Use token if available, fallback to a guest key
    const token = localStorage.getItem('token');
    const userCartKey = `frameCart_${token ? token.substring(0, 20) : 'guest'}`;

    const createThumbnail = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 150;
      const scale = Math.min(maxSize / photoImg.width, maxSize / photoImg.height);
      canvas.width = photoImg.width * scale;
      canvas.height = photoImg.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(photoImg, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.6);
    };

    const thumbnailData = createThumbnail();

    const cartItem = {
      id: Date.now().toString(),
      imageUri: thumbnailData,
      previewImage: thumbnailData,
      frameShapeId: designData.frameShapeId,
      frameColor: designData.frameColor,
      matColor: designData.matColor,
      productType: designData.productType,
      keychainShape: designData.keychainShape,
      layoutName: designData.layoutName,
      photoCount: designData.photoCount,
      clockNumberColor: designData.clockNumberColor,
      clockHandColor: designData.clockHandColor,
      clockSecondHandColor: designData.clockSecondHandColor,
      hasClockOverlay: designData.hasClockOverlay,
      selectedSize: selectedSize.label,
      selectedThickness,
      orientation,
      price: PRICES[getProductType(isAcrylicKeychain, isAcrylicClock, isGallery, isAcrylicCutout)]?.[selectedSize.label]?.[selectedThickness],
      timestamp: Date.now(),
      previewWidthCm: selectedSize.widthCm,
      previewHeightCm: selectedSize.heightCm,
      widthInch: selectedSize.widthInch,
      heightInch: selectedSize.heightInch,
      finalWidthCm: orientation === "portrait" ? selectedSize.heightCm : selectedSize.widthCm,
      finalHeightCm: orientation === "portrait" ? selectedSize.widthCm : selectedSize.heightCm,
      finalWidthInch: orientation === "portrait" ? selectedSize.heightInch : selectedSize.widthInch,
      finalHeightInch: orientation === "portrait" ? selectedSize.widthInch : selectedSize.heightInch,
      isAcrylicCutout,
      isAcrylicClock,
      isGallery,
      isAcrylicKeychain,
    };

    try {
      // ✅ token is guaranteed to exist here
      const token = localStorage.getItem('token');
      const userCartKey = `frameCart_${token ? token.substring(0, 20) : 'guest'}`;
      let cart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
      cart.push(cartItem);
      localStorage.setItem(userCartKey, JSON.stringify(cart));
      console.log('✅ Added to cart successfully');
      router.push('/cart');
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        const userCartKey = `frameCart_${token ? token.substring(0, 20) : 'guest'}`;
        try {
          let cart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
          cart = cart.slice(-3);
          cart.push(cartItem);
          localStorage.removeItem(userCartKey);
          localStorage.setItem(userCartKey, JSON.stringify(cart));
          alert('Cart was optimized. Added new item successfully!');
          router.push('/cart');
        } catch (secondError) {
          alert('Unable to add item. Please try with a different image.');
        }
      } else {
        console.error('Error saving to cart:', e);
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  useEffect(() => {
    let savedData = window.frameDesignData;

    if (!savedData || !savedData.productType) {
      const stored = localStorage.getItem("frameDesignData");
      if (stored) {
        try {
          savedData = JSON.parse(stored);
          console.log("Loaded design data from localStorage");
        } catch (e) {
          console.error("Failed to parse stored design data:", e);
        }
      }
    }

    if (!savedData) {
      savedData = {
        imageUri:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        frameShapeId: "rounded-rect",
        frameColor: "#000000",
        matColor: "transparent",
        widthCm: 30,
        heightCm: 20,
        thicknessMm: 20,
        productType: "frame",
      };
    }

    console.log("Loaded design data:", savedData);
    setDesignData(savedData);
    if (savedData.productType === "frame") {
      savedData.matColor = "transparent";
    }

    const isCutout = savedData.productType === "acrylic-cutout";
    const isClock = savedData.productType === "acrylic-clock";
    const isGal = savedData.productType === "mini-gallery";
    const isKeychain = savedData.productType === "clear-acrylic-photo";

    setIsAcrylicCutout(isCutout);
    setIsAcrylicClock(isClock);
    setIsGallery(isGal);
    setIsAcrylicKeychain(isKeychain);

    // Initialize orientation from design data if available
    if (
      savedData.orientation === "landscape" ||
      savedData.orientation === "portrait"
    ) {
      setOrientation(savedData.orientation);
    } else if (savedData.widthCm && savedData.heightCm) {
      setOrientation(
        savedData.widthCm >= savedData.heightCm ? "landscape" : "portrait",
      );
    }

    // Load mockup image
    if (!isGal) {
      const mockup = new window.Image();
      mockup.crossOrigin = "anonymous";

      if (isKeychain) {
        setMockupImg(null);
      } else {
        // Different mockup for acrylic cutout
        const mockupPath = isCutout
          ? "/acrylic-cutout-mokeup-image.png"
          : "/bg-image.png";
        const cdnPath = isCutout
          ? "https://res.cloudinary.com/dewxpvl5s/image/upload/v1767601440/cutout-mockup_example.png"
          : "https://res.cloudinary.com/dewxpvl5s/image/upload/v1767601440/gallery-preview-bg-image_vqwvtk.png";

        mockup.src = mockupPath;
        mockup.onload = () => {
          console.log("Mockup loaded successfully");
          setMockupImg(mockup);
        };
        mockup.onerror = () => {
          console.warn("Local mockup failed, trying CDN...");
          mockup.src = cdnPath;
          mockup.onload = () => {
            console.log("CDN mockup loaded successfully");
            setMockupImg(mockup);
          };
          mockup.onerror = () => {
            console.error("All mockup sources failed");
            setMockupImg(null);
          };
        };
      }
    }

    // ✅ IMPROVED IMAGE LOADING
    const imageSource = savedData.previewImage || savedData.imageUri;

    if (!imageSource) {
      console.error("No image source found in savedData");
      setLoading(false);
      return;
    }

    console.log("Loading image from:", imageSource.substring(0, 100));

    const img = new window.Image();

    // Set crossOrigin BEFORE setting src for external URLs
    if (!imageSource.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      console.log("✅ Image loaded successfully:", img.width, "x", img.height);
      setPhotoImg(img);
      setLoading(false);
    };

    img.onerror = (err) => {
      console.error("❌ Failed to load image:", err);
      console.error("Image source was:", imageSource.substring(0, 100));

      // Try fallback image
      if (!imageSource.includes("unsplash")) {
        console.log("Trying fallback image...");
        img.src =
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800";
      } else {
        setLoading(false);
      }
    };

    // Set src AFTER setting up event handlers
    img.src = imageSource;
  }, []); // Empty dependency array

  const [containerWidth, setContainerWidth] = useState(400);

  useEffect(() => {
    const updateContainerWidth = () => {
      const vw = window.innerWidth;
      // Scale down more aggressively as viewport gets smaller
      setContainerWidth(
        vw < 480
          ? vw * 0.8 // Extra small mobile
          : vw < 640
            ? vw * 0.75 // Mobile
            : vw < 768
              ? vw * 0.7 // Small tablet
              : vw < 1024
                ? vw * 0.6 // Tablet
                : Math.min(vw * 0.5, 450), // Desktop with cap
      );
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  //  const cmToPx = (cm) => {
  //   const maxInch = Math.max(
  //     (currentDimensions?.widthInch || 12),
  //     (currentDimensions?.heightInch || 9),
  //   );

  //   let maxCm;

  //   // 📱 MOBILE (containerWidth <= 450)
  //   if (containerWidth <= 450) {
  //     maxCm =
  //       maxInch <= 12
  //         ? 65  // 12x9 (was 110)
  //         : maxInch <= 18
  //           ? 75  // 16x12, 18x12 (was 120)
  //           : maxInch <= 24
  //             ? 80  // 21x15 (was 125)
  //             : maxInch <= 30
  //               ? 100 // 30x20 (was 170)
  //               : maxInch <= 35
  //                 ? 110 // 35x23 (was 180)
  //                 : maxInch <= 48
  //                   ? 145 // 48x36 (was 250)
  //                   : 170; // (was 300)
  //   }
  //   // 📱 SMALL TABLET (containerWidth 451-768)
  //   else if (containerWidth <= 768) {
  //     maxCm =
  //       maxInch <= 12
  //         ? 60  // 12x9 (was 105)
  //         : maxInch <= 18
  //           ? 70  // 16x12, 18x12 (was 115)
  //           : maxInch <= 24
  //             ? 75  // 21x15 (was 125)
  //             : maxInch <= 30
  //               ? 90  // 30x20 (was 155)
  //               : maxInch <= 35
  //                 ? 100 // 35x23 (was 165)
  //                 : maxInch <= 48
  //                   ? 120 // 48x36 (was 200)
  //                   : 150; // (was 250)
  //   }
  //   // 💻 TABLET (containerWidth 769-1280)
  //   else if (containerWidth <= 1280) {
  //     maxCm =
  //       maxInch <= 12
  //         ? 55  // 12x9 (was 95)
  //         : maxInch <= 18
  //           ? 65  // 16x12, 18x12 (was 105)
  //           : maxInch <= 24
  //             ? 70  // 21x15 (was 115)
  //             : maxInch <= 30
  //               ? 85  // 30x20 (was 145)
  //               : maxInch <= 35
  //                 ? 95  // 35x23 (was 155)
  //                 : maxInch <= 48
  //                   ? 115 // 48x36 (was 190)
  //                   : 145; // (was 240)
  //   }
  //   // 🖥️ LAPTOP/DESKTOP (containerWidth > 1280)
  //   else {
  //     maxCm =
  //       maxInch <= 12
  //         ? 50  // 12x9 (was 90)
  //         : maxInch <= 18
  //           ? 60  // 16x12, 18x12 (was 100)
  //           : maxInch <= 24
  //             ? 65  // 21x15 (was 110)
  //             : maxInch <= 30
  //               ? 80  // 30x20 (was 140)
  //               : maxInch <= 35
  //                 ? 90  // 35x23 (was 150)
  //                 : maxInch <= 48
  //                   ? 110 // 48x36 (was 190)
  //                   : 140; // (was 240)
  //   }

  //   return (cm * containerWidth) / maxCm;
  // };

  const cmToPx = (cm) => {
    const maxInch = Math.max(
      currentDimensions?.widthInch || 12,
      currentDimensions?.heightInch || 9,
    );

    let maxCm;

    // 📱 MOBILE (containerWidth <= 450) - REDUCED SIZES
    if (containerWidth <= 450) {
      maxCm =
        maxInch <= 12
          ? 78 // 12x9 - Reduced from 65
          : maxInch <= 18
            ? 95 // 16x12, 18x12 - Reduced from 75
            : maxInch <= 24
              ? 60 // 21x15 - Reduced from 80
              : maxInch <= 30
                ? 70 // 30x20 - Reduced from 100
                : maxInch <= 35
                  ? 80 // 35x23 - Reduced from 110
                  : maxInch <= 48
                    ? 100 // 48x36 - Reduced from 145
                    : 120; // Reduced from 170
    }
    // 📱 SMALL TABLET (containerWidth 451-768)
    else if (containerWidth <= 768) {
      maxCm =
        maxInch <= 12
          ? 60 // 12x9
          : maxInch <= 18
            ? 70 // 16x12, 18x12
            : maxInch <= 24
              ? 75 // 21x15
              : maxInch <= 30
                ? 90 // 30x20
                : maxInch <= 35
                  ? 100 // 35x23
                  : maxInch <= 48
                    ? 120 // 48x36
                    : 150;
    }
    // 💻 TABLET (containerWidth 769-1280)
    else if (containerWidth <= 1280) {
      maxCm =
        maxInch <= 12
          ? 55 // 12x9
          : maxInch <= 18
            ? 65 // 16x12, 18x12
            : maxInch <= 24
              ? 70 // 21x15
              : maxInch <= 30
                ? 85 // 30x20
                : maxInch <= 35
                  ? 95 // 35x23
                  : maxInch <= 48
                    ? 115 // 48x36
                    : 145;
    }
    // 🖥️ LAPTOP/DESKTOP (containerWidth > 1280)
    else {
      maxCm =
        maxInch <= 12
          ? 50 // 12x9
          : maxInch <= 18
            ? 60 // 16x12, 18x12
            : maxInch <= 24
              ? 65 // 21x15
              : maxInch <= 30
                ? 80 // 30x20
                : maxInch <= 35
                  ? 90 // 35x23
                  : maxInch <= 48
                    ? 110 // 48x36
                    : 140;
    }

    return (cm * containerWidth) / maxCm;
  };

  const getCurrentDimensions = () => {
    if (orientation === "portrait") {
      return {
        widthCm: selectedSize.heightCm,
        heightCm: selectedSize.widthCm,
        widthInch: selectedSize.heightInch,
        heightInch: selectedSize.widthInch,
      };
    }
    return {
      widthCm: selectedSize.widthCm,
      heightCm: selectedSize.heightCm,
      widthInch: selectedSize.widthInch,
      heightInch: selectedSize.heightInch,
    };
  };

  const currentDimensions = getCurrentDimensions();

  // Get proper radius for different clock shapes
  const getShapeRadius = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    const baseSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    const shapeConfig = FRAME_SHAPES[designData?.frameShapeId] || {};

    if (shapeConfig.isHexagon || shapeConfig.isOctagon) {
      return baseSize * 0.35;
    } else if (shapeConfig.isDiamond) {
      return baseSize * 0.3;
    } else if (shapeConfig.isLeaf) {
      return baseSize * 0.32;
    }
    return baseSize * 0.38;
  };

  const renderKeychainFrame = () => {
    if (!photoImg) return null;

    const keychainSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.6;
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const shapeId = designData.keychainShape || "circle";

    // Render metal chain above keychain
    const renderMetalChain = (topY) => {
      const chainLinks = 4;
      const linkHeight = 18;
      const linkWidth = 12;
      const startY = topY - chainLinks * linkHeight - 30;

      return (
        <Group>
          {/* Main keyring at top */}
          <Group>
            {/* Ring shadow */}
            <Circle
              x={centerX}
              y={startY}
              radius={22}
              fill="rgba(0,0,0,0.15)"
              offsetY={-3}
            />
            {/* Ring outer */}
            <Circle
              x={centerX}
              y={startY}
              radius={20}
              stroke="#a8a8a8"
              strokeWidth={4}
            />
            {/* Ring inner */}
            <Circle
              x={centerX}
              y={startY}
              radius={16}
              stroke="#606060"
              strokeWidth={2}
            />
            {/* Ring highlight */}
            <Circle
              x={centerX - 8}
              y={startY - 8}
              radius={6}
              fill="rgba(255, 255, 255, 0.4)"
            />
          </Group>

          {/* Chain links */}
          {Array.from({ length: chainLinks }).map((_, i) => {
            const linkY = startY + 20 + i * linkHeight;
            const rotation = i % 2 === 0 ? 0 : 90;

            return (
              <Group key={i} x={centerX} y={linkY} rotation={rotation}>
                {/* Link shadow */}
                <Rect
                  x={-linkWidth / 2}
                  y={-linkHeight / 2}
                  width={linkWidth}
                  height={linkHeight}
                  cornerRadius={linkWidth / 2}
                  fill="rgba(0,0,0,0.1)"
                  offsetY={-2}
                />
                {/* Link outer */}
                <Rect
                  x={-linkWidth / 2}
                  y={-linkHeight / 2}
                  width={linkWidth}
                  height={linkHeight}
                  cornerRadius={linkWidth / 2}
                  stroke="#909090"
                  strokeWidth={3}
                  fill="transparent"
                />
                {/* Link inner detail */}
                <Rect
                  x={-linkWidth / 2 + 2}
                  y={-linkHeight / 2 + 2}
                  width={linkWidth - 4}
                  height={linkHeight - 4}
                  cornerRadius={(linkWidth - 4) / 2}
                  stroke="#606060"
                  strokeWidth={1}
                  fill="transparent"
                />
                {/* Link highlight */}
                <Rect
                  x={-linkWidth / 2}
                  y={-linkHeight / 2 + 2}
                  width={3}
                  height={linkHeight / 3}
                  cornerRadius={1.5}
                  fill="rgba(255, 255, 255, 0.4)"
                />
              </Group>
            );
          })}
        </Group>
      );
    };

    // Circle keychain
    if (shapeId === "circle") {
      const radius = keychainSize / 2;
      const scale = Math.max(
        keychainSize / photoImg.width,
        keychainSize / photoImg.height,
      );
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;
      const topHoleY = centerY - radius + 15;

      return (
        <Group>
          {/* Metal chain */}
          {renderMetalChain(topHoleY)}

          {/* Bottom shadow for depth */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(0,0,0,0.15)"
            offsetX={-3}
            offsetY={-6}
          />

          {/* Main keychain base */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="#ffffff"
            stroke="#d0d0d0"
            strokeWidth={2}
          />

          {/* Photo clipped to circle */}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>

          {/* Glossy acrylic overlay */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              const linear = ctx.createLinearlinear(
                // change
                centerX - radius,
                centerY - radius,
                centerX + radius,
                centerY + radius,
              );
              linear.addColorStop(0, "rgba(255, 255, 255, 0.4)");
              linear.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
              linear.addColorStop(1, "rgba(255, 255, 255, 0.05)");
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Highlight shine */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.ellipse(
                centerX - radius * 0.3,
                centerY - radius * 0.3,
                radius * 0.4,
                radius * 0.6,
                -0.3,
                0,
                Math.PI * 2,
              );
              const linear = ctx.createRadiallinear(
                // moon = change
                centerX - radius * 0.3,
                centerY - radius * 0.3,
                0,
                centerX - radius * 0.3,
                centerY - radius * 0.3,
                radius * 0.4,
              );
              ctx.fillStyle = linear;
              linear.addColorStop(0, "rgba(255, 255, 255, 0.5)");
              linear.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
              linear.addColorStop(1, "rgba(255, 255, 255, 0)");
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Metal ring hole shadow */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY - radius + 15, 11, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(0,0,0,0.2)"
            offsetY={-2}
          />

          {/* Metal ring hole base */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY - radius + 15, 10, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="#c0c0c0"
            stroke="#909090"
            strokeWidth={1}
          />

          {/* Metal ring inner hole */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY - radius + 15, 6, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="#505050"
            stroke="#707070"
            strokeWidth={0.5}
          />

          {/* Metal ring highlight */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX - 2, centerY - radius + 13, 3, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(255, 255, 255, 0.6)"
          />
        </Group>
      );
    }

    // Heart keychain
    if (shapeId === "heart") {
      const size = keychainSize;
      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;
      const topHoleY = centerY - size / 2 + size * 0.05;

      return (
        <Group>
          {/* Metal chain */}
          {renderMetalChain(topHoleY)}

          {/* Bottom shadow */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;
              const offsetX = centerX - width / 2;
              const offsetY = centerY - height / 2;

              ctx.beginPath();
              ctx.moveTo(offsetX + width / 2, offsetY + height);
              ctx.bezierCurveTo(
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX,
                offsetY + height * 0.75,
                offsetX,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX,
                offsetY,
                offsetX + width / 4,
                offsetY,
                offsetX + width / 2,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width * 0.75,
                offsetY,
                offsetX + width,
                offsetY,
                offsetX + width,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width,
                offsetY + height * 0.75,
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX + width / 2,
                offsetY + height,
              );
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(0,0,0,0.15)"
            offsetX={-3}
            offsetY={-6}
          />

          {/* Main heart base */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;
              const offsetX = centerX - width / 2;
              const offsetY = centerY - height / 2;

              ctx.beginPath();
              ctx.moveTo(offsetX + width / 2, offsetY + height);
              ctx.bezierCurveTo(
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX,
                offsetY + height * 0.75,
                offsetX,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX,
                offsetY,
                offsetX + width / 4,
                offsetY,
                offsetX + width / 2,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width * 0.75,
                offsetY,
                offsetX + width,
                offsetY,
                offsetX + width,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width,
                offsetY + height * 0.75,
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX + width / 2,
                offsetY + height,
              );
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="#ffffff"
            stroke="#d0d0d0"
            strokeWidth={2}
          />

          {/* Photo layer */}
          <Group
            clipFunc={(ctx) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;
              const offsetX = centerX - width / 2;
              const offsetY = centerY - height / 2;

              ctx.beginPath();
              ctx.moveTo(offsetX + width / 2, offsetY + height);
              ctx.bezierCurveTo(
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX,
                offsetY + height * 0.75,
                offsetX,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX,
                offsetY,
                offsetX + width / 4,
                offsetY,
                offsetX + width / 2,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width * 0.75,
                offsetY,
                offsetX + width,
                offsetY,
                offsetX + width,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width,
                offsetY + height * 0.75,
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX + width / 2,
                offsetY + height,
              );
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>

          {/* Glossy overlay */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;
              const offsetX = centerX - width / 2;
              const offsetY = centerY - height / 2;

              ctx.beginPath();
              ctx.moveTo(offsetX + width / 2, offsetY + height);
              ctx.bezierCurveTo(
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX,
                offsetY + height * 0.75,
                offsetX,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX,
                offsetY,
                offsetX + width / 4,
                offsetY,
                offsetX + width / 2,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width * 0.75,
                offsetY,
                offsetX + width,
                offsetY,
                offsetX + width,
                offsetY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                offsetX + width,
                offsetY + height * 0.75,
                offsetX + width / 2,
                offsetY + height - height / 4,
                offsetX + width / 2,
                offsetY + height,
              );
              ctx.closePath();

              const linear = ctx.createLinearlinear(
                offsetX,
                offsetY,
                offsetX + width,
                offsetY + height,
              );
              linear.addColorStop(0, "rgba(255, 255, 255, 0.4)");
              linear.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
              linear.addColorStop(1, "rgba(255, 255, 255, 0.05)");
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Shine highlight */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size * 0.3;
              const height = size * 0.6;

              ctx.beginPath();
              ctx.ellipse(
                centerX - size * 0.15,
                centerY - size * 0.15,
                width,
                height,
                -0.3,
                0,
                Math.PI * 2,
              );
              ctx.closePath();

              const linear = ctx.createRadiallinear(
                centerX - size * 0.15,
                centerY - size * 0.15,
                0,
                centerX - size * 0.15,
                centerY - size * 0.15,
                width,
              );
              linear.addColorStop(0, "rgba(255, 255, 255, 0.5)");
              linear.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
              linear.addColorStop(1, "rgba(255, 255, 255, 0)");
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Metal ring with effects */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(
                centerX,
                centerY - size / 2 + size * 0.05,
                11,
                0,
                Math.PI * 2,
              );
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(0,0,0,0.2)"
            offsetY={-2}
          />
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(
                centerX,
                centerY - size / 2 + size * 0.05,
                10,
                0,
                Math.PI * 2,
              );
              ctx.fillStrokeShape(shape);
            }}
            fill="#c0c0c0"
            stroke="#909090"
            strokeWidth={1}
          />
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(
                centerX,
                centerY - size / 2 + size * 0.05,
                6,
                0,
                Math.PI * 2,
              );
              ctx.fillStrokeShape(shape);
            }}
            fill="#505050"
            stroke="#707070"
            strokeWidth={0.5}
          />
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(
                centerX - 2,
                centerY - size / 2 + size * 0.05 - 2,
                3,
                0,
                Math.PI * 2,
              );
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(255, 255, 255, 0.6)"
          />
        </Group>
      );
    }

    // Square/Rounded Square keychains
    const isRounded = shapeId === "rounded-square";
    const cornerRadius = isRounded ? 15 : 5;
    const width = keychainSize * 0.9;
    const height = keychainSize * 0.9;
    const x = centerX - width / 2;
    const y = centerY - height / 2;
    const topHoleY = y + 20;

    const scale = Math.max(width / photoImg.width, height / photoImg.height);
    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const photoX = centerX - displayWidth / 2;
    const photoY = centerY - displayHeight / 2;

    return (
      <Group>
        {/* Metal chain */}
        {renderMetalChain(topHoleY)}

        {/* Shadow */}
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(0,0,0,0.15)"
          cornerRadius={cornerRadius}
          offsetX={-3}
          offsetY={-6}
        />

        {/* Base */}
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#ffffff"
          stroke="#d0d0d0"
          strokeWidth={2}
          cornerRadius={cornerRadius}
        />

        {/* Photo */}
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, cornerRadius);
            ctx.closePath();
          }}
        >
          <KonvaImage
            image={photoImg}
            x={photoX}
            y={photoY}
            width={displayWidth}
            height={displayHeight}
          />
        </Group>

        {/* Glossy overlay */}
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          fillLinearlinearStartPoint={{ x: 0, y: 0 }} //moon c= change
          fillLinearlinearEndPoint={{ x: width, y: height }}
          fillLinearlinearColorStops={[
            0,
            "rgba(255, 255, 255, 0.4)",
            0.5,
            "rgba(255, 255, 255, 0.1)",
            1,
            "rgba(255, 255, 255, 0.05)",
          ]}
          cornerRadius={cornerRadius}
          listening={false}
        />

        {/* Shine */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.ellipse(
              x + width * 0.25,
              y + height * 0.25,
              width * 0.25,
              height * 0.4,
              -0.3,
              0,
              Math.PI * 2,
            );
            const linear = ctx.createRadiallinear(
              x + width * 0.25,
              y + height * 0.25,
              0,
              x + width * 0.25,
              y + height * 0.25,
              width * 0.25,
            );
            linear.addColorStop(0, "rgba(255, 255, 255, 0.5)");
            linear.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
            linear.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = linear;
            ctx.fill();
          }}
          listening={false}
        />

        {/* Metal ring */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, y + 20, 11, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(0,0,0,0.2)"
          offsetY={-2}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, y + 20, 10, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#c0c0c0"
          stroke="#909090"
          strokeWidth={1}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, y + 20, 6, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="#505050"
          stroke="#707070"
          strokeWidth={0.5}
        />
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX - 2, y + 18, 3, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill="rgba(255, 255, 255, 0.6)"
        />
      </Group>
    );
  };

  // Render clock overlay (numbers and hands) - Using colors from designData
  const renderClockOverlay = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius(PREVIEW_WIDTH, PREVIEW_HEIGHT);

    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const fontSize = radius * 0.18;

    // Use colors from designData if available
    const numberColor = designData?.clockNumberColor || "#2c3e50";
    const handColor = designData?.clockHandColor || "#2c3e50";
    const secondHandColor = designData?.clockSecondHandColor || "#e74c3c";

    return (
      <Group>
        {/* Clock numbers */}
        {numbers.map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const numberRadius = radius * 0.75;
          const x = centerX + numberRadius * Math.cos(angle);
          const y = centerY + numberRadius * Math.sin(angle);

          return (
            <Text
              key={num}
              x={x}
              y={y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily="Arial, sans-serif"
              fontStyle="bold"
              fill={numberColor}
              align="center"
              verticalAlign="middle"
              offsetX={fontSize / 2}
              offsetY={fontSize / 2}
            />
          );
        })}

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const markerRadius = radius * 0.9;
          const x = centerX + markerRadius * Math.cos(angle);
          const y = centerY + markerRadius * Math.sin(angle);

          return (
            <Shape
              key={`marker-${index}`}
              sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.arc(x, y, radius * 0.025, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              fill={numberColor}
              opacity={0.5}
            />
          );
        })}

        {/* Hour hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.45 * Math.cos(((-90 + 60) * Math.PI) / 180),
            centerY + radius * 0.45 * Math.sin(((-90 + 60) * Math.PI) / 180),
          ]}
          stroke={handColor}
          strokeWidth={radius * 0.045}
          lineCap="round"
        />

        {/* Minute hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.65 * Math.cos(((-90 + 180) * Math.PI) / 180),
            centerY + radius * 0.65 * Math.sin(((-90 + 180) * Math.PI) / 180),
          ]}
          stroke={handColor}
          strokeWidth={radius * 0.03}
          lineCap="round"
        />

        {/* Second hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.7 * Math.cos(((-90 + 270) * Math.PI) / 180),
            centerY + radius * 0.7 * Math.sin(((-90 + 270) * Math.PI) / 180),
          ]}
          stroke={secondHandColor}
          strokeWidth={radius * 0.018}
          lineCap="round"
        />

        {/* Center dot */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.06, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={handColor}
        />
      </Group>
    );
  };

  // Add this helper function near the top of your component (after state declarations)
  const isClockImage = (img) => {
    // Check if the image dimensions or data suggests it's already a clock design
    // You can identify this by checking if it came from the clock editor
    return designData?.hasClockOverlay === true;
  };

  // Then modify the renderClockFrame function:
  const renderClockFrame = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    if (!photoImg) return null;

    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const shapeConfig =
      FRAME_SHAPES[designData?.frameShapeId] || FRAME_SHAPES["circle-clock"];

    // Circle Clock
    if (shapeConfig.isCircle) {
      const radius = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) / 2;
      const photoRadius = radius * 0.95;

      const diameter = photoRadius * 2;
      const scale = Math.max(
        diameter / photoImg.width,
        diameter / photoImg.height,
      );

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {/* Removed overlay - clock numbers are already in the image */}
        </Group>
      );
    }
    // Square Clock (add cornerRadius check)
    if (shapeConfig.cornerRadius !== undefined && !shapeConfig.isCircle) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.95;
      const scale = Math.max(size / photoImg.width, size / photoImg.height);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              const x = centerX - size / 2;
              const y = centerY - size / 2;
              const r = shapeConfig.cornerRadius || 0;

              ctx.beginPath();
              ctx.moveTo(x + r, y);
              ctx.lineTo(x + size - r, y);
              ctx.quadraticCurveTo(x + size, y, x + size, y + r);
              ctx.lineTo(x + size, y + size - r);
              ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
              ctx.lineTo(x + r, y + size);
              ctx.quadraticCurveTo(x, y + size, x, y + size - r);
              ctx.lineTo(x, y + r);
              ctx.quadraticCurveTo(x, y, x + r, y);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
        </Group>
      );
    }
    // Octagon Clock
    if (shapeConfig.isOctagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
      const radius = size / 2;
      const scale = Math.max(size / photoImg.width, size / photoImg.height);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
        </Group>
      );
    }

    // Diamond Clock
    if (shapeConfig.isDiamond) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.8;
      const scale = Math.max(size / photoImg.width, size / photoImg.height);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size / 2);
              ctx.lineTo(centerX + size / 2, centerY);
              ctx.lineTo(centerX, centerY + size / 2);
              ctx.lineTo(centerX - size / 2, centerY);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
        </Group>
      );
    }

    // Leaf Clock
    if (shapeConfig.isLeaf) {
      // Use square dimensions to maintain proper leaf shape
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.85;
      const leafWidth = size;
      const leafHeight = size;
      const startX = centerX - leafWidth / 2;
      const startY = centerY - leafHeight / 2;

      // Scale image to fit within the leaf shape
      const scale = Math.max(
        leafWidth / photoImg.width,
        leafHeight / photoImg.height,
      );
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(startX + leafWidth / 2, startY);
              ctx.quadraticCurveTo(
                startX + leafWidth,
                startY + leafHeight / 3,
                startX + leafWidth,
                startY + leafHeight / 2,
              );
              ctx.quadraticCurveTo(
                startX + leafWidth,
                startY + leafHeight * 0.7,
                startX + leafWidth / 2,
                startY + leafHeight,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + leafHeight * 0.7,
                startX,
                startY + leafHeight / 2,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + leafHeight / 3,
                startX + leafWidth / 2,
                startY,
              );
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
        </Group>
      );
    }

    // Hexagon Clock
    if (shapeConfig.isHexagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.95;
      const scale = Math.max(size / photoImg.width, size / photoImg.height);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          <Group
            clipFunc={(ctx) => {
              const hexRadius = size / 2;
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = centerX + hexRadius * Math.cos(angle);
                const y = centerY + hexRadius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={displayWidth}
              height={displayHeight}
            />
          </Group>
          {/* ✅ Only render clock overlay if image doesn't already have it */}
          {/* {!isClockImage(photoImg) && renderClockOverlay(PREVIEW_WIDTH, PREVIEW_HEIGHT)} */}
        </Group>
      );
    }

    // Default fallback (shouldn't reach here)
    return null;
  };

  const renderCutoutFrame = (PREVIEW_WIDTH, PREVIEW_HEIGHT) => {
    if (!designData || !photoImg) return null;

    // const frameThickness = 4 + (selectedThickness - 3) * 1.5;
    const frameThickness = 4; // Fixed visual thickness - actual thickness is in Z-axis
    const frameColor = designData.frameColor || "#000000";
    const shapeId = designData.frameShapeId || "rounded-rect";
    const shapeConfig = FRAME_SHAPES[shapeId] || FRAME_SHAPES["rounded-rect"];

    const scale =
      Math.min(
        PREVIEW_WIDTH / photoImg.width,
        PREVIEW_HEIGHT / photoImg.height,
      ) * 0.7;

    const scaledWidth = photoImg.width * scale;
    const scaledHeight = photoImg.height * scale;
    const offsetX = (PREVIEW_WIDTH - scaledWidth) / 2;
    const offsetY = (PREVIEW_HEIGHT - scaledHeight) / 2;

    const frameW = scaledWidth + frameThickness * 2;
    const frameH = scaledHeight + frameThickness * 2;
    const frameX = offsetX - frameThickness;
    const frameY = offsetY - frameThickness;
    const centerX = frameX + frameW / 2;
    const centerY = frameY + frameH / 2;

    const renderFrameShape = () => {
      if (shapeConfig.isCircle) {
        const radius = Math.max(frameW, frameH) / 2 - frameThickness / 2;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
          // shadowColor="rgba(0,0,0,0.3)"
          // shadowBlur={20}
          // shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isDiamond) {
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(centerX, frameY + frameThickness / 2);
              ctx.lineTo(frameX + frameW - frameThickness / 2, centerY);
              ctx.lineTo(centerX, frameY + frameH - frameThickness / 2);
              ctx.lineTo(frameX + frameThickness / 2, centerY);
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
          // shadowColor="rgba(0,0,0,0.3)"
          // shadowBlur={20}
          // shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isStar) {
        const outerRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        const innerRadius = outerRadius * 0.5;
        const points = 5;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
          // shadowColor="rgba(0,0,0,0.3)"
          // shadowBlur={20}
          // shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isPolygon) {
        const sides = shapeConfig.sides;
        const polyRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < sides; i++) {
                const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
                const x = centerX + Math.cos(angle) * polyRadius;
                const y = centerY + Math.sin(angle) * polyRadius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
          // shadowColor="rgba(0,0,0,0.3)"
          // shadowBlur={20}
          // shadowOffsetY={8}
          />
        );
      }

      if (shapeConfig.isHeart) {
        return (
          <Shape
            sceneFunc={(ctx, shape) => {
              const topCurveHeight = frameH * 0.3;
              const inset = frameThickness / 2;
              const hX = frameX + inset;
              const hY = frameY + inset;
              const hW = frameW - frameThickness;
              const hH = frameH - frameThickness;
              const hCenterX = hX + hW / 2;

              ctx.beginPath();
              ctx.moveTo(hCenterX, hY + hH * 0.3);

              ctx.bezierCurveTo(hCenterX, hY, hX, hY, hX, hY + topCurveHeight);
              ctx.bezierCurveTo(
                hX,
                hY + (hH + topCurveHeight) / 2,
                hCenterX,
                hY + (hH + topCurveHeight) / 1.5,
                hCenterX,
                hY + hH,
              );

              ctx.bezierCurveTo(
                hCenterX,
                hY + (hH + topCurveHeight) / 1.5,
                hX + hW,
                hY + (hH + topCurveHeight) / 2,
                hX + hW,
                hY + topCurveHeight,
              );
              ctx.bezierCurveTo(
                hX + hW,
                hY,
                hCenterX,
                hY,
                hCenterX,
                hY + hH * 0.3,
              );

              ctx.closePath();
              ctx.strokeShape(shape);
            }}
            stroke={frameColor}
            strokeWidth={frameThickness}
          // shadowColor="rgba(0,0,0,0.3)"
          // shadowBlur={20}
          // shadowOffsetY={8}
          />
        );
      }

      return (
        <Rect
          x={frameX + frameThickness / 2}
          y={frameY + frameThickness / 2}
          width={frameW - frameThickness}
          height={frameH - frameThickness}
          stroke={frameColor}
          strokeWidth={frameThickness}
          cornerRadius={shapeConfig.cornerRadius}
        // shadowColor="rgba(0,0,0,0.3)"
        // shadowBlur={20}
        // shadowOffsetY={8}
        />
      );
    };

    const getClipFunc = () => {
      if (shapeConfig.isCircle) {
        const radius = Math.max(frameW, frameH) / 2 - frameThickness / 2;
        return (ctx) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
        };
      }

      if (shapeConfig.isDiamond) {
        return (ctx) => {
          ctx.beginPath();
          ctx.moveTo(centerX, frameY + frameThickness / 2);
          ctx.lineTo(frameX + frameW - frameThickness / 2, centerY);
          ctx.lineTo(centerX, frameY + frameH - frameThickness / 2);
          ctx.lineTo(frameX + frameThickness / 2, centerY);
          ctx.closePath();
        };
      }

      if (shapeConfig.isStar) {
        const outerRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        const innerRadius = outerRadius * 0.5;
        const points = 5;
        return (ctx) => {
          ctx.beginPath();
          for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        };
      }

      if (shapeConfig.isPolygon) {
        const sides = shapeConfig.sides;
        const polyRadius = Math.min(frameW, frameH) / 2 - frameThickness / 2;
        return (ctx) => {
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            const x = centerX + Math.cos(angle) * polyRadius;
            const y = centerY + Math.sin(angle) * polyRadius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        };
      }

      if (shapeConfig.isHeart) {
        const heartWidth = frameW - frameThickness;
        const heartHeight = frameH - frameThickness;
        const hX = frameX + frameThickness / 2;
        const hY = frameY + frameThickness / 2;
        const hCenterX = hX + heartWidth / 2;
        return (ctx) => {
          const topCurveHeight = heartHeight * 0.3;
          ctx.beginPath();
          ctx.moveTo(hCenterX, hY + heartHeight * 0.3);

          ctx.bezierCurveTo(hCenterX, hY, hX, hY, hX, hY + topCurveHeight);
          ctx.bezierCurveTo(
            hX,
            hY + (heartHeight + topCurveHeight) / 2,
            hCenterX,
            hY + (heartHeight + topCurveHeight) / 1.5,
            hCenterX,
            hY + heartHeight,
          );

          ctx.bezierCurveTo(
            hCenterX,
            hY + (heartHeight + topCurveHeight) / 1.5,
            hX + heartWidth,
            hY + (heartHeight + topCurveHeight) / 2,
            hX + heartWidth,
            hY + topCurveHeight,
          );
          ctx.bezierCurveTo(
            hX + heartWidth,
            hY,
            hCenterX,
            hY,
            hCenterX,
            hY + heartHeight * 0.3,
          );

          ctx.closePath();
        };
      }

      const cornerRadius = shapeConfig.cornerRadius;
      return (ctx) => {
        const x = frameX + frameThickness / 2;
        const y = frameY + frameThickness / 2;
        const w = frameW - frameThickness;
        const h = frameH - frameThickness;
        const r = Math.min(cornerRadius, w / 2, h / 2);

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };
    };

    return (
      <Group>
        {renderFrameShape()}
        <Group clipFunc={getClipFunc()}>
          <KonvaImage
            image={photoImg}
            x={offsetX}
            y={offsetY}
            width={scaledWidth}
            height={scaledHeight}
          />
        </Group>
      </Group>
    );
  };

  // At the beginning of your renderFrame function
  // const renderFrame = () => {
  //   if (!designData) {
  //     console.error("No design data available");
  //     return null;
  //   }

  //   if (!photoImg) {
  //     console.error("No photo image available");
  //     // Render a placeholder
  //     return (
  //       <Group>
  //         <Rect
  //           width={PREVIEW_WIDTH}
  //           height={PREVIEW_HEIGHT}
  //           fill="#f0f0f0"
  //         />
  //         <Text
  //           x={PREVIEW_WIDTH / 2}
  //           y={PREVIEW_HEIGHT / 2}
  //           text="Loading image..."
  //           fontSize={20}
  //           fill="#666"
  //           align="center"
  //           offsetX={60}
  //         />
  //       </Group>
  //     );
  //   }
  // }
  const renderFrame = () => {
    if (!designData) {
      console.error("No design data available");
      return null;
    }

    if (!photoImg) {
      console.error("No photo image available");
      return (
        <Group>
          <Rect width={PREVIEW_WIDTH} height={PREVIEW_HEIGHT} fill="#f0f0f0" />
          <Text
            x={PREVIEW_WIDTH / 2}
            y={PREVIEW_HEIGHT / 2}
            text="Loading image..."
            fontSize={20}
            fill="#666"
            align="center"
            offsetX={60}
          />
        </Group>
      );
    }

    const PREVIEW_WIDTH = cmToPx(currentDimensions.widthCm);
    const PREVIEW_HEIGHT = cmToPx(currentDimensions.heightCm);

    // CLOCK RENDERING
    if (isAcrylicClock) {
      return renderClockFrame(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    }

    if (isAcrylicCutout) {
      return renderCutoutFrame(PREVIEW_WIDTH, PREVIEW_HEIGHT);
    }

    if (isGallery) {
      const padding = 0.8;
      const containerSize = Math.min(
        PREVIEW_WIDTH * padding,
        PREVIEW_HEIGHT * padding,
      );
      const scale = Math.min(
        containerSize / photoImg.width,
        containerSize / photoImg.height,
      );
      const scaledWidth = photoImg.width * scale;
      const scaledHeight = photoImg.height * scale;
      const offsetX = (PREVIEW_WIDTH - scaledWidth) / 2;
      const offsetY = (PREVIEW_HEIGHT - scaledHeight) / 2;

      return (
        <Group>
          <Rect
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            fill="#f8fafc"
            cornerRadius={12}
          // shadowColor="rgba(0,0,0,0.1)"
          // shadowBlur={8}
          // shadowOffsetY={2}
          />
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.roundRect(offsetX, offsetY, scaledWidth, scaledHeight, 8);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={offsetX}
              y={offsetY}
              width={scaledWidth}
              height={scaledHeight}
            // shadowColor="rgba(0,0,0,0.15)"
            // shadowBlur={12}
            // shadowOffsetY={4}
            />
          </Group>
        </Group>
      );
    }

    // REGULAR FRAME RENDERING (from your original code)
    const shapeConfig =
      FRAME_SHAPES[designData.frameShapeId] || FRAME_SHAPES["rounded-rect"];
    const framePx = 8 + (selectedThickness - 3) * 2;

    if (shapeConfig.isCircle) {
      const circleSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      const offsetXCircle = (PREVIEW_WIDTH - circleSize) / 2;
      const offsetYCircle = (PREVIEW_HEIGHT - circleSize) / 2;
      const centerX = circleSize / 2;
      const centerY = circleSize / 2;

      const outerRadius = circleSize / 2;
      const matRadius = outerRadius - framePx;
      const dualBorderGap = shapeConfig.hasDualBorder
        ? shapeConfig.innerBorderGap
        : 0;
      const photoRadius = matRadius - dualBorderGap;

      const photoDiameter = photoRadius * 2;
      const scaleX = photoDiameter / photoImg.width;
      const scaleY = photoDiameter / photoImg.height;
      const imageScale = Math.min(scaleX, scaleY);

      const scaledWidth = photoImg.width * imageScale;
      const scaledHeight = photoImg.height * imageScale;
      const photoX = centerX - scaledWidth / 2;
      const photoY = centerY - scaledHeight / 2;

      return (
        <Group x={offsetXCircle} y={offsetYCircle}>
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="transparent"
          // shadowColor="rgba(0,0,0,0.35)"
          // shadowBlur={24}
          // shadowOffsetY={10}
          />
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, matRadius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={designData.matColor}
          />
          {shapeConfig.hasDualBorder && (
            <Shape
              sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
                ctx.strokeShape(shape);
              }}
              stroke={designData.frameColor}
              strokeWidth={2}
            />
          )}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoX}
              y={photoY}
              width={scaledWidth}
              height={scaledHeight}
            />
          </Group>
        </Group>
      );
    }

    // RECTANGULAR FRAMES
    // RECTANGULAR FRAMES - Replace the entire section starting from "// RECTANGULAR FRAMES"
    const innerWidth = PREVIEW_WIDTH - framePx * 2;
    const innerHeight = PREVIEW_HEIGHT - framePx * 2;
    const dualBorderGap = shapeConfig.hasDualBorder
      ? shapeConfig.innerBorderGap
      : 0;
    const matInnerWidth = innerWidth - dualBorderGap * 2;
    const matInnerHeight = innerHeight - dualBorderGap * 2;

    const photoAreaWidth = shapeConfig.hasDualBorder
      ? matInnerWidth
      : innerWidth;
    const photoAreaHeight = shapeConfig.hasDualBorder
      ? matInnerHeight
      : innerHeight;

    const scaleX = photoAreaWidth / photoImg.width;
    const scaleY = photoAreaHeight / photoImg.height;
    const imageScale = Math.max(scaleX, scaleY) * 1.07;

    const displayWidth = photoImg.width * imageScale;
    const displayHeight = photoImg.height * imageScale;
    const offsetX = (photoAreaWidth - displayWidth) / 2;
    const offsetY = (photoAreaHeight - displayHeight) / 2;

    // ✅ CHECK: Is this a regular acrylic frame (not dual-border, not special shape)?
    const isRegularAcrylicFrame =
      !shapeConfig.hasDualBorder &&
      !shapeConfig.isDiamond &&
      !shapeConfig.isStar &&
      !shapeConfig.isHeart &&
      !shapeConfig.isPolygon &&
      !shapeConfig.isCircle;

    // ✅ FRAMELESS RENDERING FOR REGULAR ACRYLIC WALL PHOTOS
    if (isRegularAcrylicFrame) {
      const framelessWidth = PREVIEW_WIDTH;
      const framelessHeight = PREVIEW_HEIGHT;
      const framelessScale = Math.max(
        framelessWidth / photoImg.width,
        framelessHeight / photoImg.height,
      );
      const framelessDisplayWidth = photoImg.width * framelessScale;
      const framelessDisplayHeight = photoImg.height * framelessScale;
      const framelessOffsetX = (framelessWidth - framelessDisplayWidth) / 2;
      const framelessOffsetY = (framelessHeight - framelessDisplayHeight) / 2;

      return (
        <Group>
          {/* Just the photo with rounded corners - no frame */}
          <Group
            clipFunc={(ctx) => {
              const w = framelessWidth;
              const h = framelessHeight;
              const r = shapeConfig.cornerRadius || 8;

              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={framelessOffsetX}
              y={framelessOffsetY}
              width={framelessDisplayWidth}
              height={framelessDisplayHeight}
            />
          </Group>
        </Group>
      );
    }

    return (
      <Group>
        {/* Mat background - acts as outer frame */}
        <Rect
          x={0}
          y={0}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          fill={designData.frameColor}
          cornerRadius={shapeConfig.cornerRadius}
        // shadowColor="rgba(0,0,0,0.35)"
        // shadowBlur={24}
        // shadowOffsetY={10}
        />
        <Rect
          x={framePx}
          y={framePx}
          width={innerWidth}
          height={innerHeight}
          fill={designData.matColor}
          cornerRadius={Math.max(0, shapeConfig.cornerRadius - framePx / 2)}
        />

        {/* Inner border frame (only if dual border) */}
        {shapeConfig.hasDualBorder && (
          <Rect
            x={framePx + dualBorderGap}
            y={framePx + dualBorderGap}
            width={matInnerWidth}
            height={matInnerHeight}
            stroke={designData.frameColor}
            strokeWidth={2}
            cornerRadius={Math.max(
              0,
              shapeConfig.cornerRadius - framePx / 2 - dualBorderGap,
            )}
          />
        )}
        {/* Photo with clipping */}
        <Group
          x={framePx + (shapeConfig.hasDualBorder ? dualBorderGap : 0)}
          y={framePx + (shapeConfig.hasDualBorder ? dualBorderGap : 0)}
          clipFunc={(ctx) => {
            const w = photoAreaWidth;
            const h = photoAreaHeight;
            const r = Math.max(
              0,
              shapeConfig.cornerRadius -
                framePx / 2 -
                (shapeConfig.hasDualBorder ? dualBorderGap : 0),
            );
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(w - r, 0);
            ctx.quadraticCurveTo(w, 0, w, r);
            ctx.lineTo(w, h - r);
            ctx.quadraticCurveTo(w, h, w - r, h);
            ctx.lineTo(r, h);
            ctx.quadraticCurveTo(0, h, 0, h - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
          }}
        >
          <KonvaImage
            image={photoImg}
            x={offsetX}
            y={offsetY}
            width={displayWidth}
            height={displayHeight}
          />
        </Group>
      </Group>
    );
  };

  useEffect(() => {
    console.log("🔍 Current state:", {
      loading,
      hasPhotoImg: !!photoImg,
      photoImgDimensions: photoImg
        ? `${photoImg.width}x${photoImg.height}`
        : "null",
      hasDesignData: !!designData,
      designDataKeys: designData ? Object.keys(designData) : [],
      imageSource: designData?.previewImage
        ? "previewImage"
        : designData?.imageUri
          ? "imageUri"
          : "none",
      previewSize: `${PREVIEW_WIDTH}x${PREVIEW_HEIGHT}`,
      productTypes: {
        isGallery,
        isAcrylicClock,
        isAcrylicCutout,
        isAcrylicKeychain,
      },
    });
  }, [loading, photoImg, designData]);
  // Rest of your renderFrame code...

  //  const getProductType = () => {
  //   if (isAcrylicKeychain) return "acrylic-keychain";
  //   if (isAcrylicClock) return "acrylic-clock";
  //   if (isGallery) return "mini-gallery";
  //   if (isAcrylicCutout) return "acrylic-cutout";
  //   return "frame";
  // };

  const productType = getProductType(
    isAcrylicKeychain,
    isAcrylicClock,
    isGallery,
    isAcrylicCutout,
  );
  const currentPrice =
    PRICES[productType]?.[selectedSize.label]?.[selectedThickness] || 699;
  const originalPrice = Math.round(currentPrice * 1.8);
  const PREVIEW_WIDTH = cmToPx(currentDimensions.widthCm);
  const PREVIEW_HEIGHT = cmToPx(currentDimensions.heightCm);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your design...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Sidebar />
      <nav style={{ fontFamily: "'DM Sans', sans-serif", width: "100%", padding: "28px 32px 0" }} aria-label="Breadcrumb">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <ol style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "15px", fontWeight: 500, color: "#7a8499", textDecoration: "none", padding: "6px 12px", borderRadius: "10px", border: "1px solid transparent" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
                Home
              </a>
            </li>
            <li><span style={{ color: "#aab4c8", fontSize: "20px", padding: "0 2px", userSelect: "none", fontWeight: 300 }} aria-hidden="true">›</span></li>
            <li>
              <a href="/editor" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "15px", fontWeight: 500, color: "#7a8499", textDecoration: "none", padding: "6px 12px", borderRadius: "10px", border: "1px solid transparent" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /></svg>
                Customise
              </a>
            </li>
            <li><span style={{ color: "#aab4c8", fontSize: "20px", padding: "0 2px", userSelect: "none", fontWeight: 300 }} aria-hidden="true">›</span></li>
            <li>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 700, color: "#0f172a", padding: "7px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 2px 8px rgba(99,102,241,0.08)" }} aria-current="page">
                Acrylic Wall Photo
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block", boxShadow: "0 0 0 3px rgba(99,102,241,0.25)" }} aria-hidden="true" />
              </span>
            </li>
          </ol>
        </div>
      </nav>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-2xl  ml-6 font-semibold text-gray-900">
            {isAcrylicKeychain
              ? "Acrylic Keychain"
              : isAcrylicClock
                ? "Acrylic Wall Clock"
                : isGallery
                  ? "Mini Photo Gallery"
                  : isAcrylicCutout
                    ? "Acrylic Cutout Editor"
                    : "Frame Editor"}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 ">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="flex items-center justify-center min-h-full">
              <div className="relative w-full max-w-[800px]">
                {isGallery ? (
                  // GALLERY LAYOUT
                  <div className="w-full">
                    <div className="text-center mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        📸 {designData?.photoCount || "Multi"} Photo Gallery
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Layout: {designData?.layoutName || "Custom Layout"}
                      </p>
                    </div>
                    <div className="relative w-full px-4 sm:px-0">
                      <div
                        className="relative mx-auto"
                        style={{
                          paddingTop: "30px",
                          paddingLeft: "50px",
                          paddingBottom: "15px",
                          maxWidth: "100%",
                        }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                          {currentDimensions.widthInch}" (
                          {currentDimensions.widthCm.toFixed(2)} cm)
                        </div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                          {currentDimensions.heightInch}" (
                          {currentDimensions.heightCm.toFixed(2)} cm)
                        </div>
                        <div
                          className="w-full overflow-hidden"
                          style={{
                            aspectRatio: `${PREVIEW_WIDTH}/${PREVIEW_HEIGHT}`,
                            maxWidth: "100%",
                          }}
                        >
                          <Stage
                            width={PREVIEW_WIDTH}
                            height={PREVIEW_HEIGHT}
                            className="w-full h-full"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                          ></Stage>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium text-gray-600">
                        Thickness: {selectedThickness}mm | LANDSCAPE
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4 px-4">
                        ✨ Your photos will be printed on acrylic in the
                        selected layout
                      </p>
                    </div>
                  </div>
                ) : isAcrylicKeychain && mockupImg ? (
                  // KEYCHAIN WITH WOODEN BACKGROUND
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "4/3", maxHeight: "80vh" }}
                  >
                    <img
                      src={mockupImg.src}
                      alt="Keychain mockup"
                      className="w-full h-full object-contain rounded-lg"
                      style={{ filter: "brightness(0.95)" }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "min(60%, 400px)",
                      }}
                    >
                      <div className="absolute -top-8 sm:-top-16 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs font-medium text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
                        Keychain Size: {currentDimensions.widthInch}" (
                        {currentDimensions.widthCm.toFixed(2)} cm)
                      </div>
                      <div
                        className="w-full"
                        style={{
                          aspectRatio: `${PREVIEW_WIDTH}/${PREVIEW_HEIGHT}`,
                          maxHeight: "55vh",
                        }}
                      >
                        <Stage
                          width={PREVIEW_WIDTH}
                          height={PREVIEW_HEIGHT}
                          className="w-full h-full"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Layer>{renderKeychainFrame()}</Layer>
                        </Stage>
                      </div>
                      <div className="mt-2 sm:mt-3 text-center">
                        <span className="text-[10px] sm:text-xs font-medium text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 rounded inline-block">
                          Acrylic Keychain | Shape:{" "}
                          {designData?.keychainShape?.toUpperCase() || "CIRCLE"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-[10px] sm:text-xs text-gray-700 bg-white bg-opacity-90 px-2 sm:px-3 py-1 rounded shadow">
                      🔑 Lightweight & Durable | Metal Keyring Included
                    </div>
                  </div>
                ) : mockupImg ? (
                  // WALL MOCKUP (Regular frames, clocks)
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "4/3", maxHeight: "70vh" }}
                  >
                    <img
                      src={mockupImg.src}
                      alt="Room mockup"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div
                      className="absolute"
                      style={{
                        top: "18%",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        width: "min(50%, 350px)",
                        // backgroundColor: "rgba(255, 0, 0, 0.1)",
                      }}
                    >
                      <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs font-medium text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
                        {currentDimensions.widthInch}" (
                        {currentDimensions.widthCm.toFixed(2)} cm)
                      </div>
                      <div className="absolute -left-12 sm:-left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-medium text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 rounded whitespace-nowrap">
                        {currentDimensions.heightInch}" (
                        {currentDimensions.heightCm.toFixed(2)} cm)
                      </div>
                      <div
                        className="w-full"
                        style={{
                          aspectRatio: `${PREVIEW_WIDTH}/${PREVIEW_HEIGHT}`,
                          maxHeight: "40vh",
                          overflow: "hidden",
                        }}
                      >
                        <Stage
                          width={PREVIEW_WIDTH}
                          height={PREVIEW_HEIGHT}
                          className="w-full h-full"
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                          }}
                        >
                          <Layer>{renderFrame()}</Layer>
                        </Stage>
                      </div>
                      <div className="mt-2 sm:mt-3 text-center">
                        <span className="text-[10px] sm:text-xs font-medium text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 rounded inline-block">
                          {isAcrylicClock
                            ? `Clock Size: ${currentDimensions.widthInch}" | Wall Mount`
                            : `Thickness: ${selectedThickness}mm | ${orientation.toUpperCase()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // FALLBACK - No mockup available
                  <div className="relative w-full px-4 sm:px-0">
                    <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                      {currentDimensions.widthInch}" (
                      {currentDimensions.widthCm.toFixed(2)} cm)
                    </div>
                    <div className="absolute -left-12 sm:-left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                      {currentDimensions.heightInch}" (
                      {currentDimensions.heightCm.toFixed(2)} cm)
                    </div>
                    <div
                      className="w-full max-w-[600px] mx-auto"
                      style={{
                        aspectRatio: `${PREVIEW_WIDTH}/${PREVIEW_HEIGHT}`,
                      }}
                    >
                      <Stage
                        width={PREVIEW_WIDTH}
                        height={PREVIEW_HEIGHT}
                        className="w-full h-full"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Layer>
                          <Rect
                            x={0}
                            y={0}
                            width={PREVIEW_WIDTH}
                            height={PREVIEW_HEIGHT}
                            fill="transparent"
                          />
                          {isAcrylicKeychain
                            ? renderKeychainFrame()
                            : renderFrame()}
                        </Layer>
                      </Stage>
                    </div>
                    <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium text-gray-600 px-4">
                      {isAcrylicKeychain ? (
                        <span className="bg-orange-100 text-orange-800 px-3 sm:px-5 py-2 rounded-full inline-block">
                          🔑 Acrylic Keychain | Shape:{" "}
                          {designData?.keychainShape?.toUpperCase() || "CIRCLE"}
                        </span>
                      ) : isAcrylicClock ? (
                        <span className="bg-blue-100 text-blue-800 px-3 sm:px-5 py-2 rounded-full inline-block">
                          🕐 Wall Clock with Your Photo | Shape:{" "}
                          {designData?.frameShapeId
                            ?.replace("-clock", "")
                            .replace("-", " ")
                            .toUpperCase() || "CIRCLE"}
                        </span>
                      ) : isAcrylicCutout ? (
                        <span className="bg-green-100 text-green-800 px-3 sm:px-5 py-2 rounded-full inline-block">
                          ✓ Background Removed | Frame:{" "}
                          {designData?.frameShapeId?.toUpperCase() || "CUSTOM"}
                        </span>
                      ) : (
                        <>
                          Thickness: {selectedThickness}mm |{" "}
                          {orientation.toUpperCase()}
                        </>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 px-4">
                      <p>
                        Quick mount:{" "}
                        {isAcrylicKeychain
                          ? "Metal keyring included"
                          : isAcrylicClock
                            ? "Wall hook included"
                            : "OMGS Adhesive hooks (Included)"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-96 space-y-3">
  <div className="bg-white rounded-lg shadow-sm p-3">
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-900">₹{currentPrice}</span>
      <span className="text-base text-gray-400 line-through">₹{originalPrice}</span>
    </div>
    {selectedSize.label === "12x9" && selectedThickness === 3 && (
      <p className="text-xs text-red-600 font-medium mt-1">Only 6 Acrylic's left!</p>
    )}
  </div>

  {!isAcrylicCutout && !isGallery && !isAcrylicClock && (
    <div className="bg-white rounded-lg shadow-sm px-3 py-2 flex items-center gap-2">
      <h3 className="text-sm font-semibold text-gray-900">Orientation:</h3>
      <p className="text-sm text-gray-700">{orientation === "portrait" ? "Vertical" : "Landscape"}</p>
    </div>
  )}

  <div className="bg-white rounded-lg shadow-sm p-3">
    <h3 className="text-sm font-semibold text-gray-900 mb-1 cursor-pointer">
      {isAcrylicClock ? "Clock Size (Inch):" : isGallery ? "Gallery Size (Inch):" : isAcrylicCutout ? "Cutout Size (Inch):" : "Acrylic Size (Inch):"}
    </h3>
    <select
      value={selectedSize.label}
      onChange={(e) => {
        const next = SIZE_OPTIONS.find((s) => s.label === e.target.value) || SIZE_OPTIONS[0];
        setSelectedSize(next);
      }}
      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
    >
      {SIZE_OPTIONS.map((size) => (
        <option key={size.label} value={size.label}>{size.label}</option>
      ))}
    </select>
  </div>

  <div className="bg-white rounded-lg shadow-sm p-3">
    <h3 className="text-sm font-semibold text-gray-900 mb-1">Acrylic Thickness:</h3>
    <select
      value={selectedThickness}
      onChange={(e) => setSelectedThickness(Number(e.target.value))}
      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
    >
      {THICKNESS_OPTIONS.map((thickness) => (
        <option key={thickness.value} value={thickness.value}>{thickness.label}</option>
      ))}
    </select>
  </div>

  <DeliveryEstimator />

  <button
    onClick={saveToCart}
    disabled={!photoImg}
    className={`w-full font-semibold cursor-pointer py-3 rounded-lg text-base transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 ${
      photoImg ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    ➕ Add to Cart & View Cart
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
