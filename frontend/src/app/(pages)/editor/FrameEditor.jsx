"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Shape,
  Group,
  Line,
  Text,
} from "react-konva";
import { useRouter, useSearchParams } from "next/navigation";
import { domToPng } from "modern-screenshot";
import Sidebar from "@/components/section/Sidebar";

// Silence TensorFlow.js and ONNX Runtime warnings

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = args[0]?.toString() || "";
    if (
      message.includes("onnxruntime") ||
      message.includes("VerifyEachNodeIsAssignedToAnEp") ||
      message.includes("execution providers") ||
      message.includes("session_state") ||
      message.includes("preferred execution providers") ||
      message.includes("Some nodes were not assigned") ||
      message.includes("Rerunning with verbose")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args[0]?.toString() || "";
    if (
      message.includes("onnxruntime") ||
      message.includes("VerifyEachNodeIsAssignedToAnEp") ||
      message.includes("execution providers") ||
      message.includes("session_state") ||
      message.includes("preferred execution providers")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

const MIN_CM = 5;
const MAX_CM = 100;
const MIN_PX = 250;
const MAX_PX = 650;

const FRAME_SHAPES = {
  SQUARE: {
    id: "square",
    name: "Square",
    cornerRadius: 0,
    hasDualBorder: false,
  },
  ROUNDED_RECT: {
    id: "rounded-rect",
    name: "Rounded Rectangle",
    cornerRadius: 20,
    hasDualBorder: false,
  },
  EXTRA_ROUNDED: {
    id: "extra-rounded",
    name: "Extra Rounded",
    cornerRadius: 50,
    hasDualBorder: false,
  },
  CIRCLE: {
    id: "circle",
    name: "Circle",
    isCircle: true,
    hasDualBorder: false,
  },
  DUAL_BORDER_SQUARE: {
    id: "dual-square",
    name: "Dual Border Square",
    cornerRadius: 0,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
  DUAL_BORDER_ROUNDED: {
    id: "dual-rounded",
    name: "Dual Border Rounded",
    cornerRadius: 20,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
  DUAL_BORDER_CIRCLE: {
    id: "dual-circle",
    name: "Dual Border Circle",
    isCircle: true,
    hasDualBorder: true,
    innerBorderGap: 12,
  },
};

// Clock-specific shapes
const CLOCK_SHAPES = {
  SQUARE_CLOCK: {
    id: "square-clock",
    name: "Square Clock",
    cornerRadius: 8,
  },
  ROUNDED_SQUARE_CLOCK: {
    id: "rounded-square-clock",
    name: "Rounded Square",
    cornerRadius: 30,
  },
  CIRCLE_CLOCK: {
    id: "circle-clock",
    name: "Circle Clock",
    isCircle: true,
  },
  LEAF_CLOCK: {
    id: "leaf-clock",
    name: "Leaf Shape",
    isLeaf: true,
  },
  HEXAGON_CLOCK: {
    id: "hexagon-clock",
    name: "Hexagon Clock",
    isHexagon: true,
  },
  OCTAGON_CLOCK: {
    id: "octagon-clock",
    name: "Octagon Clock",
    isOctagon: true,
  },
  DIAMOND_CLOCK: {
    id: "diamond-clock",
    name: "Diamond Clock",
    isDiamond: true,
  },
};

const cmToPx = (cm) => {
  const t = (cm - MIN_CM) / (MAX_CM - MIN_CM);
  return MIN_PX + t * (MAX_PX - MIN_PX);
};

export default function FrameEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productType = searchParams.get("type");
  const isAcrylicCutout = productType === "acrylic-cutout";
  const isAcrylicClock = productType === "acrylic-clock";

  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [bgRemovedImg, setBgRemovedImg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const initialShape = isAcrylicClock
    ? CLOCK_SHAPES.CIRCLE_CLOCK
    : FRAME_SHAPES.SQUARE;
  const [selectedShape, setSelectedShape] = useState(initialShape);

  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(30);
  const [thicknessMm, setThicknessMm] = useState(20);

  const [photoScale, setPhotoScale] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });

  const [frameColor, setFrameColor] = useState("#ffffff");
  const [matColor, setMatColor] = useState("#ffffff");

  // NEW: Clock customization colors
  const [clockNumberColor, setClockNumberColor] = useState("#2c3e50");
  const [clockHandColor, setClockHandColor] = useState("#2c3e50");
  const [clockSecondHandColor, setClockSecondHandColor] = useState("#e74c3c");
  const [clockNumberFont, setClockNumberFont] = useState(
    "Arial Black, sans-serif",
  );

  // Custom text layers (works for all types: default, clocks, cutouts)
  const [textLayers, setTextLayers] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  const PREVIEW_WIDTH = cmToPx(widthCm);
  const PREVIEW_HEIGHT = cmToPx(heightCm);

  const framePx = 8 + (thicknessMm - 10) * (20 / 40);

  const innerWidth = PREVIEW_WIDTH - framePx * 2;
  const innerHeight = PREVIEW_HEIGHT - framePx * 2;

  const dualBorderGap = selectedShape.hasDualBorder
    ? selectedShape.innerBorderGap
    : 0;
  const matInnerWidth = innerWidth - dualBorderGap * 2;
  const matInnerHeight = innerHeight - dualBorderGap * 2;

  const [stageScale, setStageScale] = useState(1);
  const [orientation, setOrientation] = useState("landscape");

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        // mobile only (below md breakpoint)
        const scale = Math.min(1, (screenWidth - 48) / PREVIEW_WIDTH);
        setStageScale(scale);
      } else {
        setStageScale(1); // full size for md and above
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [PREVIEW_WIDTH]);

  // Apply non-square sizes based on orientation for regular frames
  useEffect(() => {
    if (isAcrylicClock || isAcrylicCutout) return;
    if (orientation === "landscape") {
      setWidthCm(40);
      setHeightCm(30);
    } else {
      setWidthCm(30);
      setHeightCm(40);
    }
  }, [orientation, isAcrylicClock, isAcrylicCutout]);

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "landscape" ? "portrait" : "landscape"));
  };

  // Effect for regular photo loading
  useEffect(() => {
    if (!photoSrc || isAcrylicCutout) return;

    const img = new window.Image();
    img.src = photoSrc;
    img.onload = () => {
      setPhotoImg(img);

      const targetWidth = isAcrylicClock
        ? PREVIEW_WIDTH * 1
        : selectedShape.hasDualBorder
          ? matInnerWidth
          : innerWidth;
      const targetHeight = isAcrylicClock
        ? PREVIEW_HEIGHT * 1
        : selectedShape.hasDualBorder
          ? matInnerHeight
          : innerHeight;

      const imgAspect = img.width / img.height;
      const frameAspect = targetWidth / targetHeight;

      // CHANGED: Use Math.max instead of checking aspect ratio to FILL the frame
      let scale = Math.max(targetWidth / img.width, targetHeight / img.height);

      setPhotoScale(scale);

      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const offsetX = (targetWidth - displayWidth) / 2;
      const offsetY = (targetHeight - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    };
  }, [
    photoSrc,
    isAcrylicCutout,
    isAcrylicClock,
    selectedShape.id,
    selectedShape.hasDualBorder,
    PREVIEW_WIDTH,
    PREVIEW_HEIGHT,
    framePx,
    matInnerWidth,
    matInnerHeight,
  ]);

  // Effect for background removal
  useEffect(() => {
    if (!photoSrc || !isAcrylicCutout) return;

    let isMounted = true;

    async function removeBg() {
      if (!isMounted) return;

      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        const { removeBackground } = await import("rembg-webgpu");

        if (!isMounted) return;

        console.log("Starting background removal...");

        const result = await removeBackground(photoSrc, {
          model: "u2net",
          device: "auto",
          progress: (stage, current, total) => {
            const percent = Math.round((current / total) * 100);
            setProcessingProgress(percent);
            console.log(`${stage}: ${percent}%`);
          },
        });

        if (!isMounted) return;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = result.blobUrl;

        img.onload = () => {
          if (!isMounted) return;

          setBgRemovedImg(img);
          setPhotoImg(img);

          const scale = Math.min(
            (PREVIEW_WIDTH * 0.8) / img.width,
            (PREVIEW_HEIGHT * 0.8) / img.height,
          );
          setPhotoScale(scale);

          const displayWidth = img.width * scale;
          const displayHeight = img.height * scale;
          const offsetX = (PREVIEW_WIDTH - displayWidth) / 2;
          const offsetY = (PREVIEW_HEIGHT - displayHeight) / 2;
          setPhotoPos({ x: offsetX, y: offsetY });

          setIsProcessing(false);
          setProcessingProgress(100);
          console.log("Background removal complete!");
        };

        img.onerror = () => {
          if (!isMounted) return;
          console.error("Failed to load processed image");
          setIsProcessing(false);
          alert("Failed to process the image. Please try again.");
        };
      } catch (error) {
        if (!isMounted) return;

        console.error("Background removal failed:", error);
        setIsProcessing(false);

        if (error.message?.includes("WebGPU")) {
          alert(
            "Your browser does not support WebGPU. Please use Chrome 113+, Edge 113+, or Safari 18+",
          );
        } else {
          alert(
            "Failed to remove background. Please try a different image or ensure you have a modern browser.",
          );
        }
      }
    }

    removeBg();

    return () => {
      isMounted = false;
    };
  }, [photoSrc, isAcrylicCutout, PREVIEW_WIDTH, PREVIEW_HEIGHT]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!stageRef.current || !photoImg) return;

    const uri = stageRef.current.toDataURL({
      pixelRatio: 3,
      mimeType: "image/png",
    });

    const link = document.createElement("a");
    link.download = `${isAcrylicClock ? "acrylic-clock" : isAcrylicCutout ? "acrylic-cutout" : "framed-photo"}-${widthCm}x${heightCm}cm.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndNext = async () => {
    if (!stageRef.current || !photoImg) return;

    try {
      // Use modern-screenshot instead of toDataURL
      const stageElement = stageRef.current.container();
      const uri = await domToPng(stageElement, {
        quality: 1,
        scale: 3, // Same as pixelRatio: 3
        backgroundColor: "#ffffff",
      });

      const designData = {
        imageUri: isAcrylicCutout && bgRemovedImg ? bgRemovedImg.src : photoSrc,
        previewImage: uri,
        frameShape: selectedShape.name,
        frameShapeId: selectedShape.id,
        frameColor: frameColor,
        matColor: matColor,
        widthCm: widthCm,
        heightCm: heightCm,
        thicknessMm: thicknessMm,
        photoScale: photoScale,
        photoPos: photoPos,
        clockNumberColor: clockNumberColor,
        clockHandColor: clockHandColor,
        clockNumberFont: clockNumberFont,
        clockSecondHandColor: clockSecondHandColor,
        orientation,
        textLayers,
        productType: isAcrylicClock
          ? "acrylic-clock"
          : isAcrylicCutout
            ? "acrylic-cutout"
            : "frame",
        timestamp: new Date().toISOString(),
      };

      window.frameDesignData = designData;

      console.log("Design saved:", designData);

      router.push("/p");
    } catch (error) {
      console.error("Error capturing design:", error);
      alert("Failed to save design. Please try again.");
    }
  };

  const resetPhotoFit = () => {
    if (!photoImg) return;
    if (isAcrylicCutout) {
      const scale = Math.min(
        (PREVIEW_WIDTH * 0.8) / photoImg.width,
        (PREVIEW_HEIGHT * 0.8) / photoImg.height,
      );
      setPhotoScale(scale);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const offsetX = (PREVIEW_WIDTH - displayWidth) / 2;
      const offsetY = (PREVIEW_HEIGHT - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    } else {
      const targetWidth = isAcrylicClock
        ? PREVIEW_WIDTH * 0.9
        : selectedShape.hasDualBorder
          ? matInnerWidth
          : innerWidth;
      const targetHeight = isAcrylicClock
        ? PREVIEW_HEIGHT * 0.9
        : selectedShape.hasDualBorder
          ? matInnerHeight
          : innerHeight;

      // CHANGED: Use Math.max to FILL the frame (not Math.min which fits)
      const scale = Math.max(
        targetWidth / photoImg.width,
        targetHeight / photoImg.height,
      );

      setPhotoScale(scale);

      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;

      // Center the image within the frame
      const offsetX = (targetWidth - displayWidth) / 2;
      const offsetY = (targetHeight - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    }
  };

  const circleClipFunc = (ctx, width, height) => {
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
  };

  // Get proper radius for different shapes
  const getShapeRadius = () => {
    const baseSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);

    if (selectedShape.isHexagon || selectedShape.isOctagon) {
      return baseSize * 0.35;
    } else if (selectedShape.isDiamond) {
      return baseSize * 0.3;
    } else if (selectedShape.isLeaf) {
      return baseSize * 0.32;
    }
    return baseSize * 0.38;
  };

  // 1. CIRCLE CLOCK NUMBERS
  const renderCircleClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius();
    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const fontSize = radius * 0.18;

    // ADJUST THIS: Distance of numbers from center (0.75 = 75% of radius)
    const numberRadius = radius * 1;

    // Get current time
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is at 12 o'clock, clockwise)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    return (
      <Group>
        {/* Clock Numbers - properly centered */}
        {numbers.map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180); // 30 degrees per number
          const x = centerX + numberRadius * Math.cos(angle);
          const y = centerY + numberRadius * Math.sin(angle);

          return (
            <Text
              key={num}
              x={x}
              y={y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily={clockNumberFont}
              fontWeight={700}
              fill={clockNumberColor}
              align="center"
              verticalAlign="middle"
              // ADJUST THESE: Fine-tune number positioning
              offsetX={fontSize * 0.5} // Horizontal centering (0.5 = 50% of font size)
              offsetY={fontSize * 0.5} // Vertical centering (0.5 = 50% of font size)
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={4}
            />
          );
        })}

        {/* Hour hand - Shortest and thickest */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.50 = 50% of radius (increase/decrease for longer/shorter)
            centerX + radius * 0.5 * Math.cos(hourAngle),
            centerY + radius * 0.5 * Math.sin(hourAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.045} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Minute hand - Medium length and thickness */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.65 = 65% of radius (increase/decrease for longer/shorter)
            centerX + radius * 1 * Math.cos(minuteAngle),
            centerY + radius * 0.65 * Math.sin(minuteAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.03} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Second hand - Longest and thinnest */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.70 = 70% of radius (increase/decrease for longer/shorter)
            centerX + radius * 0.9 * Math.cos(secondAngle),
            centerY + radius * 0.7 * Math.sin(secondAngle),
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={radius * 0.018} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
        />

        {/* Center dot - covers where all hands meet */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            // ADJUST THIS: 0.04 = 4% of radius for center dot size
            ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />
      </Group>
    );
  };

  // 2. SQUARE CLOCK NUMBERS
  // 2. SQUARE CLOCK NUMBERS
  const renderSquareClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const clockSize = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.85;

    // Padding from border
    const padding = clockSize * 0.02;

    const innerSize = clockSize - padding * 2;

    // Font size
    const fontSize = innerSize * 0.15;

    return (
      <Group>
        {/* ========== TOP ROW: 11, 12, 1 ========== */}

        {/* Number 11 - TOP LEFT */}
        <Text
          x={centerX - innerSize / 2.8}
          y={centerY - innerSize / 2 + padding}
          text="11"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.5}
          offsetY={fontSize * 0.5}
        />

        {/* Number 12 - TOP CENTER */}
        <Text
          x={centerX}
          y={centerY - innerSize / 2 + padding}
          text="12"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.6}
          offsetY={fontSize * 0.5}
        />

        {/* Number 1 - TOP RIGHT */}
        <Text
          x={centerX + innerSize / 2.8}
          y={centerY - innerSize / 2 + padding}
          text="1"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* ========== RIGHT COLUMN: 2, 3, 4 ========== */}

        {/* Number 2 - RIGHT TOP */}
        <Text
          x={centerX + innerSize / 2 - padding}
          y={centerY - innerSize / 3.6}
          text="2"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 3 - RIGHT CENTER */}
        <Text
          x={centerX + innerSize / 2 - padding}
          y={centerY}
          text="3"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 4 - RIGHT BOTTOM */}
        <Text
          x={centerX + innerSize / 2 - padding}
          y={centerY + innerSize / 3.5}
          text="4"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* ========== BOTTOM ROW: 5, 6, 7 ========== */}

        {/* Number 5 - BOTTOM RIGHT */}
        <Text
          x={centerX + innerSize / 2.8}
          y={centerY + innerSize / 2 - padding}
          text="5"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 6 - BOTTOM CENTER */}
        <Text
          x={centerX}
          y={centerY + innerSize / 2 - padding}
          text="6"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 7 - BOTTOM LEFT */}
        <Text
          x={centerX - innerSize / 2.8}
          y={centerY + innerSize / 2 - padding}
          text="7"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* ========== LEFT COLUMN: 8, 9, 10 ========== */}

        {/* Number 8 - LEFT BOTTOM */}
        <Text
          x={centerX - innerSize / 2 + padding}
          y={centerY + innerSize / 3.5}
          text="8"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 9 - LEFT CENTER */}
        <Text
          x={centerX - innerSize / 2 + padding}
          y={centerY}
          text="9"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.25}
          offsetY={fontSize * 0.5}
        />

        {/* Number 10 - LEFT TOP */}
        <Text
          x={centerX - innerSize / 2 + padding}
          y={centerY - innerSize / 3.6}
          text="10"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={4}
          offsetX={fontSize * 0.5}
          offsetY={fontSize * 0.5}
        />
      </Group>
    );
  };

  // 3. HEXAGON CLOCK NUMBERS
  const renderHexagonClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
    const radius = size / 2;
    const fontSize = radius * 0.16; // ADJUST THIS: number size

    // Get current time for clock hands
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is at 12 o'clock, clockwise)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    // Hexagon has 6 vertices at 60-degree intervals
    // Position numbers to follow hexagon edges
    const getHexagonPosition = (num) => {
      let angle, distanceMultiplier;

      // Numbers at vertices (on the points)
      if (num === 12) {
        angle = -90; // Top
        distanceMultiplier = 0.75;
      } else if (num === 2) {
        angle = -30; // Top-right vertex
        distanceMultiplier = 0.75;
      } else if (num === 4) {
        angle = 30; // Bottom-right vertex
        distanceMultiplier = 0.75;
      } else if (num === 6) {
        angle = 90; // Bottom
        distanceMultiplier = 0.75;
      } else if (num === 8) {
        angle = 150; // Bottom-left vertex
        distanceMultiplier = 0.75;
      } else if (num === 10) {
        angle = -150; // Top-left vertex
        distanceMultiplier = 0.75;
      }
      // Numbers on edges (between vertices)
      else if (num === 1) {
        angle = -60; // Between 12 and 2
        distanceMultiplier = 0.7;
      } else if (num === 3) {
        angle = 0; // Between 2 and 4
        distanceMultiplier = 0.7;
      } else if (num === 5) {
        angle = 60; // Between 4 and 6
        distanceMultiplier = 0.7;
      } else if (num === 7) {
        angle = 120; // Between 6 and 8
        distanceMultiplier = 0.7;
      } else if (num === 9) {
        angle = 180; // Between 8 and 10
        distanceMultiplier = 0.7;
      } else if (num === 11) {
        angle = -120; // Between 10 and 12
        distanceMultiplier = 0.7;
      }

      const angleRad = angle * (Math.PI / 180);
      const numberRadius = radius * distanceMultiplier;

      return {
        x: centerX + numberRadius * Math.cos(angleRad),
        y: centerY + numberRadius * Math.sin(angleRad),
      };
    };

    return (
      <Group>
        {/* All 12 clock numbers positioned for hexagon shape */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
          const pos = getHexagonPosition(num);

          return (
            <Text
              key={num}
              x={pos.x}
              y={pos.y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily={clockNumberFont}
              fontWeight={700}
              fill={clockNumberColor}
              align="center"
              verticalAlign="middle"
              offsetX={fontSize * 0.5} // ADJUST THIS: horizontal centering
              offsetY={fontSize * 0.5} // ADJUST THIS: vertical centering
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={5}
            />
          );
        })}

        {/* Hour hand - Shortest and thickest */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.45 = 45% of radius (increase/decrease for longer/shorter)
            centerX + radius * 0.45 * Math.cos(hourAngle),
            centerY + radius * 0.45 * Math.sin(hourAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.045} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Minute hand - Medium length and thickness */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.60 = 60% of radius (increase/decrease for longer/shorter)
            centerX + radius * 0.6 * Math.cos(minuteAngle),
            centerY + radius * 0.6 * Math.sin(minuteAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.03} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Second hand - Longest and thinnest */}
        <Line
          points={[
            centerX,
            centerY,
            // ADJUST THIS: 0.65 = 65% of radius (increase/decrease for longer/shorter)
            centerX + radius * 0.65 * Math.cos(secondAngle),
            centerY + radius * 0.65 * Math.sin(secondAngle),
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={radius * 0.018} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
        />

        {/* Center dot - covers where all hands meet */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            // ADJUST THIS: 0.04 = 4% of radius for center dot size
            ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />
      </Group>
    );
  };

  // 4. OCTAGON CLOCK NUMBERS
  const renderOctagonClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius();
    const fontSize = radius * 0.2;

    // Get current time
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is at 12 o'clock, clockwise)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    // Helper to place numbers exactly on an Octagon path
    const getOctagonPosition = (index) => {
      // 1. Calculate the angle of the number (0 = 3 o'clock in Math, -90 = 12 o'clock)
      // index * 30 gives degrees from 12 o'clock. Subtract 90 to align with Math unit circle.
      const angleInRadians = (index * 30 - 90) * (Math.PI / 180);

      // 2. Determine the "Sector" of the octagon (each sector is 45 degrees or PI/4)
      // We round to the nearest sector center to find which "face" of the octagon we are on.
      const sectorSize = Math.PI / 4;
      const nearestSectorAngle =
        Math.round(angleInRadians / sectorSize) * sectorSize;

      // 3. Calculate how far this number's angle deviates from the center of its face
      const deviation = angleInRadians - nearestSectorAngle;

      // 4. Calculate Radius
      // We define a base "Apothem" (distance from center to the flat edge of the octagon)
      // We set this to ~75% of the full container radius so numbers fit inside.
      const baseApothem = radius * 1.05 * Math.cos(Math.PI / 8); // Apothem of octagon

      // Use trigonometry (secant) to push numbers out to the flat edge line
      // r = apothem / cos(theta)
      const numberRadius = baseApothem / Math.cos(deviation);

      return {
        x: centerX + numberRadius * Math.cos(angleInRadians),
        y: centerY + numberRadius * Math.sin(angleInRadians),
      };
    };

    return (
      <Group>
        {/* All 12 clock numbers positioned for octagon shape */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
          const pos = getOctagonPosition(num);

          return (
            <Text
              key={num}
              x={pos.x}
              y={pos.y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily={clockNumberFont}
              fontWeight={700}
              fill={clockNumberColor}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={4}
              offsetX={fontSize * 0.5}
              offsetY={fontSize * 0.5}
              align="center"
              verticalAlign="middle"
            />
          );
        })}

        {/* Hour hand - Shortest and thickest */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.7 * Math.cos(hourAngle), // ADJUST THIS: 0.50 = 50% of radius (was 0.40)
            centerY + radius * 0.5 * Math.sin(hourAngle), // ADJUST THIS: match the value above
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.045} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Minute hand - Medium length and thickness */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.75 * Math.cos(minuteAngle), // ADJUST THIS: 0.65 = 65% of radius (was 0.55)
            centerY + radius * 0.65 * Math.sin(minuteAngle), // ADJUST THIS: match the value above
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.03} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Second hand - Longest and thinnest */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.9 * Math.cos(secondAngle), // ADJUST THIS: 0.70 = 70% of radius (was 0.60)
            centerY + radius * 0.7 * Math.sin(secondAngle), // ADJUST THIS: match the value above
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={radius * 0.018} // ADJUST THIS: hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
        />

        {/* Center dot */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />
      </Group>
    );
  };

  // 5. Diamond CloCk Numbers
  const renderDiamondClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.85;
    const fontSize = size * 0.08; // ADJUST THIS: number size (reduced from 0.09)

    // Get current time
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is at 12 o'clock, clockwise)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    // Diamond shape positioning - ADJUST THESE to fit all numbers inside
    const vertexDistance = size * 0.32; // ADJUST THIS: Distance to corner vertices (12, 3, 6, 9) - reduced from 0.40
    const edgeDistance = size * 0.28; // ADJUST THIS: Distance to edge numbers (closer to center) - reduced from 0.35
    const diagonalOffset = size * 0.22; // ADJUST THIS: How far along the diagonal edges - reduced from 0.28

    return (
      <Group>
        {/* TOP VERTEX: 12 */}
        <Text
          x={centerX}
          y={centerY - vertexDistance}
          text="12"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.65} // ADJUST THIS: horizontal centering for "12"
          offsetY={fontSize * 0.5} // ADJUST THIS: vertical centering
        />

        {/* TOP-RIGHT EDGE: 11, 1 */}
        <Text
          x={centerX - diagonalOffset * 0.5}
          y={centerY - edgeDistance}
          text="11"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.55} // ADJUST THIS: horizontal centering for "11"
          offsetY={fontSize * 0.5}
        />

        <Text
          x={centerX + diagonalOffset * 0.5}
          y={centerY - edgeDistance}
          text="1"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35} // ADJUST THIS: horizontal centering for single digits
          offsetY={fontSize * 0.5}
        />

        {/* RIGHT SIDE: 10, 2 */}
        <Text
          x={centerX - edgeDistance}
          y={centerY - diagonalOffset * 0.5}
          text="10"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.55} // ADJUST THIS: horizontal centering for "10"
          offsetY={fontSize * 0.5}
        />

        <Text
          x={centerX + edgeDistance}
          y={centerY - diagonalOffset * 0.5}
          text="2"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* RIGHT VERTEX: 3 */}
        <Text
          x={centerX + vertexDistance}
          y={centerY}
          text="3"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* LEFT VERTEX: 9 */}
        <Text
          x={centerX - vertexDistance}
          y={centerY}
          text="9"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* BOTTOM SIDE: 8, 4 */}
        <Text
          x={centerX - edgeDistance}
          y={centerY + diagonalOffset * 0.5}
          text="8"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        <Text
          x={centerX + edgeDistance}
          y={centerY + diagonalOffset * 0.5}
          text="4"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* BOTTOM EDGE: 7, 5 */}
        <Text
          x={centerX - diagonalOffset * 0.5}
          y={centerY + edgeDistance}
          text="7"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        <Text
          x={centerX + diagonalOffset * 0.5}
          y={centerY + edgeDistance}
          text="5"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* BOTTOM VERTEX: 6 */}
        <Text
          x={centerX}
          y={centerY + vertexDistance}
          text="6"
          fontSize={fontSize}
          fontFamily={clockNumberFont}
          fontWeight={700}
          fill={clockNumberColor}
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={4}
          offsetX={fontSize * 0.35}
          offsetY={fontSize * 0.5}
        />

        {/* Hour hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + size * 0.18 * Math.cos(hourAngle), // ADJUST THIS: hour hand length (reduced from 0.20)
            centerY + size * 0.18 * Math.sin(hourAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={size * 0.025} // ADJUST THIS: hour hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Minute hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + size * 0.24 * Math.cos(minuteAngle), // ADJUST THIS: minute hand length (reduced from 0.28)
            centerY + size * 0.24 * Math.sin(minuteAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={size * 0.018} // ADJUST THIS: minute hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Second hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + size * 0.28 * Math.cos(secondAngle), // ADJUST THIS: second hand length (reduced from 0.32)
            centerY + size * 0.28 * Math.sin(secondAngle),
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={size * 0.012} // ADJUST THIS: second hand thickness
          lineCap="round"
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
        />

        {/* Center dot */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, size * 0.025, 0, Math.PI * 2); // ADJUST THIS: center dot size
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />
      </Group>
    );
  };

  // 6. LEAF SHAPE - Simplified (4 corner numbers)
  const renderLeafClockNumbers = () => {
    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;
    const radius = getShapeRadius();
    const fontSize = radius * 0.18;

    // Get current time
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate angles (0 degrees is at 12 o'clock, clockwise)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    // Define custom positions for leaf shape (adjust radius based on angle)
    const getLeafRadius = (angleIndex) => {
      // Leaf shape has more width at top and tapers at bottom
      const angle = angleIndex * 0; // 0, 30, 60, etc.                                      /////initial 30

      if (angle >= 0 && angle <= 90) {
        // Top right quadrant - wider
        return radius * 1;
      } else if (angle > 90 && angle <= 180) {
        // Bottom right - tapers
        return radius * 0.65;
      } else if (angle > 180 && angle <= 270) {
        // Bottom left - tapers
        return radius * 0.65;
      } else {
        // Top left quadrant - wider
        return radius * 0.75;
      }
    };

    return (
      <Group>
        {/* All 12 clock numbers following leaf contour */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const leafRadius = getLeafRadius(index * 30);
          const x = centerX + leafRadius * Math.cos(angle);
          const y = centerY + leafRadius * Math.sin(angle);

          return (
            <Text
              key={num}
              x={x}
              y={y}
              text={num.toString()}
              fontSize={fontSize}
              fontFamily={clockNumberFont}
              fontWeight={700}
              fill={clockNumberColor}
              shadowColor="rgba(0,0,0,0.3)"
              shadowBlur={4}
              offsetX={fontSize * 0.5}
              offsetY={fontSize * 0.5}
            />
          );
        })}

        {/* Hour hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.4 * Math.cos(hourAngle),
            centerY + radius * 0.4 * Math.sin(hourAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.045}
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Minute hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.55 * Math.cos(minuteAngle),
            centerY + radius * 0.55 * Math.sin(minuteAngle),
          ]}
          stroke={clockHandColor}
          strokeWidth={radius * 0.03}
          lineCap="round"
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />

        {/* Second hand */}
        <Line
          points={[
            centerX,
            centerY,
            centerX + radius * 0.6 * Math.cos(secondAngle),
            centerY + radius * 0.6 * Math.sin(secondAngle),
          ]}
          stroke={clockSecondHandColor}
          strokeWidth={radius * 0.018}
          lineCap="round"
          shadowColor="rgba(0,0,0,0.2)"
          shadowBlur={2}
        />

        {/* Center dot */}
        <Shape
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
            ctx.fillStrokeShape(shape);
          }}
          fill={clockHandColor}
          shadowColor="rgba(0,0,0,0.3)"
          shadowBlur={3}
        />
      </Group>
    );
  };

  // Render clock frame with proper image fitting
  // Render clock frame with proper image fitting
  const renderClockFrame = () => {
    if (!photoImg) return null;

    const centerX = PREVIEW_WIDTH / 2;
    const centerY = PREVIEW_HEIGHT / 2;

    // Circle Clock
    if (selectedShape.isCircle) {
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
          {/* ADD GRAY BACKGROUND CIRCLE */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill="#e5e7eb"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={10}
            shadowOffsetY={5}
          />

          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, photoRadius, 0, Math.PI * 2);
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
          {renderCircleClockNumbers()}
        </Group>
      );
    }

    // Hexagon Clock
    if (selectedShape.isHexagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
      const radius = size / 2;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          {/* ADD GRAY BACKGROUND HEXAGON */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="#e5e7eb"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={10}
            shadowOffsetY={5}
          />

          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
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
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
          {renderHexagonClockNumbers()}
        </Group>
      );
    }

    // Octagon Clock
    if (selectedShape.isOctagon) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.9;
      const radius = size / 2;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          {/* ADD GRAY BACKGROUND OCTAGON */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="#e5e7eb"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={10}
            shadowOffsetY={5}
          />

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
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
          {renderOctagonClockNumbers()}
        </Group>
      );
    }

    // Diamond Clock
    if (selectedShape.isDiamond) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT) * 0.8;

      const scale = Math.max(size / photoImg.width, size / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          {/* ADD GRAY BACKGROUND DIAMOND */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(centerX, centerY - size / 2);
              ctx.lineTo(centerX + size / 2, centerY);
              ctx.lineTo(centerX, centerY + size / 2);
              ctx.lineTo(centerX - size / 2, centerY);
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="#e5e7eb"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={10}
            shadowOffsetY={5}
          />

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
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
          {renderDiamondClockNumbers()}
        </Group>
      );
    }

    // Leaf shape
    if (selectedShape.isLeaf) {
      const width = PREVIEW_WIDTH * 0.85;
      const height = PREVIEW_HEIGHT * 0.85;
      const startX = (PREVIEW_WIDTH - width) / 2;
      const startY = (PREVIEW_HEIGHT - height) / 2;

      const scale = Math.max(width / photoImg.width, height / photoImg.height);
      const displayWidth = photoImg.width * scale;
      const displayHeight = photoImg.height * scale;
      const photoX = centerX - displayWidth / 2;
      const photoY = centerY - displayHeight / 2;

      return (
        <Group>
          {/* ADD GRAY BACKGROUND LEAF */}
          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(startX + width / 2, startY);
              ctx.quadraticCurveTo(
                startX + width,
                startY + height / 3,
                startX + width,
                startY + height / 2,
              );
              ctx.quadraticCurveTo(
                startX + width,
                startY + height * 0.7,
                startX + width / 2,
                startY + height,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height * 0.7,
                startX,
                startY + height / 2,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height / 3,
                startX + width / 2,
                startY,
              );
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="#e5e7eb"
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={10}
            shadowOffsetY={5}
          />

          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.moveTo(startX + width / 2, startY);
              ctx.quadraticCurveTo(
                startX + width,
                startY + height / 3,
                startX + width,
                startY + height / 2,
              );
              ctx.quadraticCurveTo(
                startX + width,
                startY + height * 0.7,
                startX + width / 2,
                startY + height,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height * 0.7,
                startX,
                startY + height / 2,
              );
              ctx.quadraticCurveTo(
                startX,
                startY + height / 3,
                startX + width / 2,
                startY,
              );
              ctx.closePath();
            }}
          >
            <KonvaImage
              image={photoImg}
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
          {renderLeafClockNumbers()}
        </Group>
      );
    }

    // Square and Rounded Square
    const width = PREVIEW_WIDTH * 0.9;
    const height = PREVIEW_HEIGHT * 0.9;
    const offsetX = (PREVIEW_WIDTH - width) / 2;
    const offsetY = (PREVIEW_HEIGHT - height) / 2;

    const scale = Math.max(width / photoImg.width, height / photoImg.height);
    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const photoX = centerX - displayWidth / 2;
    const photoY = centerY - displayHeight / 2;

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);

    const radius = Math.min(width, height) / 2;

    return (
      <Group>
        {/* ADD GRAY BACKGROUND RECTANGLE */}
        <Rect
          x={offsetX}
          y={offsetY}
          width={width}
          height={height}
          fill="#e5e7eb"
          cornerRadius={selectedShape.cornerRadius}
          shadowColor="rgba(0,0,0,0.15)"
          shadowBlur={10}
          shadowOffsetY={5}
        />

        {/* Photo with clipping */}
        <Group
          clipFunc={(ctx) => {
            const r = selectedShape.cornerRadius;

            ctx.beginPath();
            ctx.moveTo(offsetX + r, offsetY);
            ctx.lineTo(offsetX + width - r, offsetY);
            ctx.quadraticCurveTo(
              offsetX + width,
              offsetY,
              offsetX + width,
              offsetY + r,
            );
            ctx.lineTo(offsetX + width, offsetY + height - r);
            ctx.quadraticCurveTo(
              offsetX + width,
              offsetY + height,
              offsetX + width - r,
              offsetY + height,
            );
            ctx.lineTo(offsetX + r, offsetY + height);
            ctx.quadraticCurveTo(
              offsetX,
              offsetY + height,
              offsetX,
              offsetY + height - r,
            );
            ctx.lineTo(offsetX, offsetY + r);
            ctx.quadraticCurveTo(offsetX, offsetY, offsetX + r, offsetY);
            ctx.closePath();
          }}
        >
          <KonvaImage
            image={photoImg}
            x={photoPos.x}
            y={photoPos.y}
            width={photoImg.width * photoScale}
            height={photoImg.height * photoScale}
            draggable
            onDragMove={(e) => {
              const node = e.target;
              setPhotoPos({ x: node.x(), y: node.y() });
            }}
          />
        </Group>

        {/* Clock numbers and hands */}
        <Group>
          {renderSquareClockNumbers()}

          <Line
            points={[
              centerX,
              centerY,
              centerX + radius * 0.5 * Math.cos(hourAngle),
              centerY + radius * 0.5 * Math.sin(hourAngle),
            ]}
            stroke={clockHandColor}
            strokeWidth={radius * 0.045}
            lineCap="round"
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={3}
          />

          <Line
            points={[
              centerX,
              centerY,
              centerX + radius * 0.65 * Math.cos(minuteAngle),
              centerY + radius * 0.65 * Math.sin(minuteAngle),
            ]}
            stroke={clockHandColor}
            strokeWidth={radius * 0.03}
            lineCap="round"
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={3}
          />

          <Line
            points={[
              centerX,
              centerY,
              centerX + radius * 0.7 * Math.cos(secondAngle),
              centerY + radius * 0.7 * Math.sin(secondAngle),
            ]}
            stroke={clockSecondHandColor}
            strokeWidth={radius * 0.018}
            lineCap="round"
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={2}
          />

          <Shape
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={clockHandColor}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={3}
          />
        </Group>
      </Group>
    );
  };

  const renderFrame = () => {
    if (selectedShape.isCircle) {
      const size = Math.min(PREVIEW_WIDTH, PREVIEW_HEIGHT);
      const offsetX = (PREVIEW_WIDTH - size) / 2;
      const offsetY = (PREVIEW_HEIGHT - size) / 2;

      return (
        <Group>
          <Shape
            x={offsetX}
            y={offsetY}
            sceneFunc={(ctx, shape) => {
              const radius = size / 2;
              ctx.beginPath();
              ctx.arc(radius, radius, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={frameColor}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={24}
            shadowOffsetY={10}
          />

          <Shape
            x={offsetX + framePx}
            y={offsetY + framePx}
            sceneFunc={(ctx, shape) => {
              const radius = (size - framePx * 2) / 2;
              ctx.beginPath();
              ctx.arc(radius, radius, radius, 0, Math.PI * 2);
              ctx.fillStrokeShape(shape);
            }}
            fill={matColor}
          />

          {selectedShape.hasDualBorder && (
            <Shape
              x={offsetX + framePx + dualBorderGap}
              y={offsetY + framePx + dualBorderGap}
              sceneFunc={(ctx, shape) => {
                const radius = (size - framePx * 2 - dualBorderGap * 2) / 2;
                ctx.beginPath();
                ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              stroke={frameColor}
              strokeWidth={2}
            />
          )}

          {photoImg ? (
            <Group
              x={
                offsetX +
                framePx +
                (selectedShape.hasDualBorder ? dualBorderGap : 0)
              }
              y={
                offsetY +
                framePx +
                (selectedShape.hasDualBorder ? dualBorderGap : 0)
              }
              clipFunc={(ctx) => {
                const targetSize = selectedShape.hasDualBorder
                  ? size - framePx * 2 - dualBorderGap * 2
                  : size - framePx * 2;
                circleClipFunc(ctx, targetSize, targetSize);
              }}
            >
              <KonvaImage
                image={photoImg}
                x={photoPos.x}
                y={photoPos.y}
                width={photoImg.width * photoScale}
                height={photoImg.height * photoScale}
                draggable
                onDragMove={(e) => {
                  const node = e.target;
                  setPhotoPos({ x: node.x(), y: node.y() });
                }}
              />
            </Group>
          ) : (
            <Shape
              x={
                offsetX +
                framePx +
                (selectedShape.hasDualBorder ? dualBorderGap : 0)
              }
              y={
                offsetY +
                framePx +
                (selectedShape.hasDualBorder ? dualBorderGap : 0)
              }
              sceneFunc={(ctx, shape) => {
                const targetSize = selectedShape.hasDualBorder
                  ? size - framePx * 2 - dualBorderGap * 2
                  : size - framePx * 2;
                const radius = targetSize / 2;
                ctx.beginPath();
                ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                ctx.fillStrokeShape(shape);
              }}
              fill="#e5e7eb"
            />
          )}
        </Group>
      );
    }

    return (
      <Group>
        <Rect
          x={0}
          y={0}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          fill={frameColor}
          cornerRadius={selectedShape.cornerRadius}
          shadowColor="rgba(0,0,0,0.35)"
          shadowBlur={24}
          shadowOffsetY={10}
        />

        <Rect
          x={framePx}
          y={framePx}
          width={innerWidth}
          height={innerHeight}
          fill={matColor}
          cornerRadius={Math.max(0, selectedShape.cornerRadius - framePx / 2)}
        />

        {selectedShape.hasDualBorder && (
          <Rect
            x={framePx + dualBorderGap}
            y={framePx + dualBorderGap}
            width={matInnerWidth}
            height={matInnerHeight}
            stroke={frameColor}
            strokeWidth={2}
            cornerRadius={Math.max(
              0,
              selectedShape.cornerRadius - framePx / 2 - dualBorderGap,
            )}
          />
        )}

        {photoImg ? (
          <Group
            x={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            y={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            clipFunc={(ctx) => {
              const w = selectedShape.hasDualBorder
                ? matInnerWidth
                : innerWidth;
              const h = selectedShape.hasDualBorder
                ? matInnerHeight
                : innerHeight;
              const r = Math.max(
                0,
                selectedShape.cornerRadius -
                  framePx / 2 -
                  (selectedShape.hasDualBorder ? dualBorderGap : 0),
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
              x={photoPos.x}
              y={photoPos.y}
              width={photoImg.width * photoScale}
              height={photoImg.height * photoScale}
              draggable
              onDragMove={(e) => {
                const node = e.target;
                setPhotoPos({ x: node.x(), y: node.y() });
              }}
            />
          </Group>
        ) : (
          <Rect
            x={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            y={framePx + (selectedShape.hasDualBorder ? dualBorderGap : 0)}
            width={selectedShape.hasDualBorder ? matInnerWidth : innerWidth}
            height={selectedShape.hasDualBorder ? matInnerHeight : innerHeight}
            fill="#e5e7eb"
            cornerRadius={Math.max(
              0,
              selectedShape.cornerRadius -
                framePx / 2 -
                (selectedShape.hasDualBorder ? dualBorderGap : 0),
            )}
          />
        )}
      </Group>
    );
  };

  const getEditorTitle = () => {
    if (isAcrylicClock) return "Acrylic Wall Clock Editor";
    if (isAcrylicCutout) return "Acrylic Cutout Editor";
    return `Acrylic Wall Photo Editor (${widthCm}×${heightCm}cm)`;
  };

  const availableShapes = isAcrylicClock ? CLOCK_SHAPES : FRAME_SHAPES;

  return (
    <div className=" bg-gray-100 p-4 ">
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-center mb-5 tracking-tight 
text-3xl sm:text-4xl md:text-5xl lg:text-5xl 
font-['Great_Vibes'] italic"
        >
          <span
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 
  bg-clip-text text-transparent"
          >
            {getEditorTitle()}
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white mb-18 rounded-none shadow-none border border-gray-200 sm:p-6 relative w-full max-w-full">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-50 rounded-none">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-900 font-semibold text-lg mb-2">
                      Removing Background...
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-red-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {processingProgress}% complete
                    </p>
                  </div>
                </div>
              )}

              <div className="w-full flex items-center justify-center">
                <div
                  style={{
                    transform: `scale(${stageScale})`,
                    transformOrigin: "top center",
                    width: PREVIEW_WIDTH,
                    height: PREVIEW_HEIGHT,
                  }}
                >
                  <Stage
                    ref={stageRef}
                    width={PREVIEW_WIDTH}
                    height={PREVIEW_HEIGHT}
                  >
                    <Layer>
                      {!photoImg && (
                        <Rect
                          x={0}
                          y={0}
                          width={PREVIEW_WIDTH}
                          height={PREVIEW_HEIGHT}
                          fill={isAcrylicClock ? "#e5e7eb" : "#ffffff"} // Gray for clock, white for frame
                        />
                      )}

                      {isAcrylicClock ? (
                        renderClockFrame()
                      ) : isAcrylicCutout ? (
                        bgRemovedImg ? (
                          <KonvaImage
                            image={bgRemovedImg}
                            x={photoPos.x}
                            y={photoPos.y}
                            width={bgRemovedImg.width * photoScale}
                            height={bgRemovedImg.height * photoScale}
                            draggable
                            onDragMove={(e) => {
                              const node = e.target;
                              setPhotoPos({ x: node.x(), y: node.y() });
                            }}
                          />
                        ) : null
                      ) : (
                        renderFrame()
                      )}

                      {/* Custom text layers overlay */}
                      {textLayers.map((layer) => (
                        <Text
                          key={layer.id}
                          x={layer.x}
                          y={layer.y}
                          text={layer.text}
                          fontSize={layer.fontSize}
                          fontFamily={layer.fontFamily}
                          fill={layer.fill}
                          draggable
                          onDragEnd={(e) => {
                            const node = e.target;
                            setTextLayers((prev) =>
                              prev.map((t) =>
                                t.id === layer.id
                                  ? { ...t, x: node.x(), y: node.y() }
                                  : t,
                              ),
                            );
                          }}
                          onClick={() => setSelectedTextId(layer.id)}
                          onTap={() => setSelectedTextId(layer.id)}
                          shadowColor={
                            selectedTextId === layer.id
                              ? "rgba(0,0,0,0.35)"
                              : "transparent"
                          }
                          shadowBlur={selectedTextId === layer.id ? 6 : 0}
                        />
                      ))}

                      {!photoImg && !isProcessing && (
                        <>
                          <Rect
                            x={PREVIEW_WIDTH / 2 - 110}
                            y={PREVIEW_HEIGHT / 2 - 35}
                            width={220}
                            height={70}
                            fill="#ffffff"
                            stroke="#000000"
                            strokeWidth={2}
                            cornerRadius={0}
                          />
                          <Shape
                            sceneFunc={(ctx, shape) => {
                              ctx.font = "bold 12px sans-serif";
                              ctx.fillStyle = "#000000";
                              ctx.textAlign = "center";
                              ctx.textBaseline = "middle";

                              const centerX = PREVIEW_WIDTH / 2;
                              const centerY = PREVIEW_HEIGHT / 2;
                              const lineGap = 12;

                              ctx.fillText(
                                "YOUR IMAGE WILL BE",
                                centerX,
                                centerY - lineGap / 2,
                              );

                              ctx.fillText(
                                "PLACED HERE",
                                centerX,
                                centerY + lineGap / 2,
                              );
                            }}
                          />
                        </>
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-72 bg-white rounded-md shadow-md p-4 space-y-4">
            {!isAcrylicCutout && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  {isAcrylicClock ? "Clock Shape" : "Frame Shape"}
                </label>
                <select
                  value={selectedShape.id}
                  onChange={(e) => {
                    const shape = Object.values(availableShapes).find(
                      (s) => s.id === e.target.value,
                    );
                    setSelectedShape(shape);
                  }}
                  className="w-full border border-gray-300 text-black rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors cursor-pointer"
                >
                  {Object.values(availableShapes).map((shape) => (
                    <option key={shape.id} value={shape.id}>
                      {shape.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isAcrylicCutout && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Orientation
                </label>
                <button
                  type="button"
                  onClick={toggleOrientation}
                  className="w-full cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 text-black font-medium py-2 px-3 rounded-md text-sm transition-colors"
                >
                  Switch to{" "}
                  {orientation === "landscape" ? "Vertical" : "Horizontal"}
                </button>
              </div>
            )}

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors text-sm"
                disabled={isProcessing}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {photoSrc ? "Change Photo" : "Select Photo"}
              </button>
            </div>

            {/* CLOCK COLOR CUSTOMIZATION */}
            {isAcrylicClock && (
              <div className="space-y-3 pt-3 border-t">
                {[
                  {
                    label: "Numbers Color",
                    value: clockNumberColor,
                    setter: setClockNumberColor,
                    colors: [
                      "#2c3e50",
                      "#ffffff",
                      "#000000",
                      "#e74c3c",
                      "#f39c12",
                    ],
                  },
                  {
                    label: "Hands Color",
                    value: clockHandColor,
                    setter: setClockHandColor,
                    colors: [
                      "#2c3e50",
                      "#ffffff",
                      "#000000",
                      "#34495e",
                      "#95a5a6",
                    ],
                  },
                  {
                    label: "Second Hand",
                    value: clockSecondHandColor,
                    setter: setClockSecondHandColor,
                    colors: [
                      "#e74c3c",
                      "#e67e22",
                      "#f39c12",
                      "#ffffff",
                      "#000000",
                    ],
                  },
                ].map(({ label, value, setter, colors }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      {label}
                    </label>
                    <div className="flex gap-1.5 flex-wrap items-center">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setter(c)}
                          className={
                            "w-7 h-7 rounded border-2 transition-all cursor-pointer " +
                            (value === c
                              ? "border-blue-500 scale-110 ring-2 ring-blue-300"
                              : "border-gray-300")
                          }
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                        title="Custom color"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Numbers Font
                  </label>
                  <select
                    value={clockNumberFont}
                    onChange={(e) => setClockNumberFont(e.target.value)}
                    className="w-full border border-gray-300 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Arial Black, sans-serif">Arial Black</option>
                    <option value="'Times New Roman', serif">
                      Times New Roman
                    </option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Courier New', monospace">Courier</option>
                    <option value="Impact, sans-serif">Impact</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                  </select>
                </div>
              </div>
            )}
            {!isAcrylicCutout && !isAcrylicClock && (
              <div className="pt-3 border-t">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Outer Frame Color
                </label>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {["#ffffff", "#000000", "#8B4513", "#C0C0C0", "#FFD700"].map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() => setFrameColor(c)}
                        className={
                          "w-7 h-7 rounded border-2 transition-all cursor-pointer " +
                          (frameColor === c
                            ? "border-blue-500 scale-110"
                            : "border-gray-300")
                        }
                        style={{ backgroundColor: c }}
                      />
                    ),
                  )}
                  <input
                    type="color"
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {!isAcrylicCutout && !isAcrylicClock && (
              <div className="pt-3 border-t">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Inner Frame Color
                </label>
                <div className="flex gap-1.5 flex-wrap items-center">
                  {["#ffffff", "#f5f5dc", "#000000"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setMatColor(c)}
                      className={
                        "w-7 h-7 rounded border-2 transition-all cursor-pointer " +
                        (matColor === c
                          ? "border-blue-500 scale-110"
                          : "border-gray-300")
                      }
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={matColor}
                    onChange={(e) => setMatColor(e.target.value)}
                    className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {photoImg && !isProcessing && (
              <div className="space-y-2 pt-3 border-t">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Photo Zoom: {photoScale.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.01"
                    value={photoScale}
                    onChange={(e) => {
                      const newScale = Number(e.target.value);
                      const oldScale = photoScale;
                      if (!photoImg) return;
                      let frameInnerWidth,
                        frameInnerHeight,
                        frameOffsetX,
                        frameOffsetY;
                      if (isAcrylicCutout) {
                        frameInnerWidth = PREVIEW_WIDTH;
                        frameInnerHeight = PREVIEW_HEIGHT;
                        frameOffsetX = 0;
                        frameOffsetY = 0;
                      } else if (isAcrylicClock) {
                        frameInnerWidth = PREVIEW_WIDTH;
                        frameInnerHeight = PREVIEW_HEIGHT;
                        frameOffsetX = 0;
                        frameOffsetY = 0;
                      } else {
                        frameInnerWidth = selectedShape.hasDualBorder
                          ? matInnerWidth
                          : innerWidth;
                        frameInnerHeight = selectedShape.hasDualBorder
                          ? matInnerHeight
                          : innerHeight;
                        frameOffsetX =
                          framePx +
                          (selectedShape.hasDualBorder ? dualBorderGap : 0);
                        frameOffsetY =
                          framePx +
                          (selectedShape.hasDualBorder ? dualBorderGap : 0);
                      }
                      const frameCenterX = frameInnerWidth / 2;
                      const frameCenterY = frameInnerHeight / 2;
                      const imageCenterX =
                        (frameCenterX - photoPos.x) / oldScale;
                      const imageCenterY =
                        (frameCenterY - photoPos.y) / oldScale;
                      setPhotoScale(newScale);
                      setPhotoPos({
                        x: frameCenterX - imageCenterX * newScale,
                        y: frameCenterY - imageCenterY * newScale,
                      });
                    }}
                    className="w-full accent-red-600 h-1.5 cursor-pointer"
                  />
                </div>

                <button
                  onClick={resetPhotoFit}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 text-xs font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Reset Position & Fit
                </button>
              </div>
            )}

            {/* Custom Text Controls */}
            <div className="space-y-2 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Custom Text
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const id = Date.now();
                    setTextLayers((prev) => [
                      ...prev,
                      {
                        id,
                        text: "Your text here",
                        x: PREVIEW_WIDTH / 2 - 60,
                        y: PREVIEW_HEIGHT / 2,
                        fontSize: 24,
                        fill: "#000000",
                        fontFamily: "Poppins, sans-serif",
                      },
                    ]);
                    setSelectedTextId(id);
                  }}
                  className="px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-semibold hover:bg-black cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {textLayers.length > 0 && (
                <div className="space-y-2">
                  <select
                    value={selectedTextId ?? ""}
                    onChange={(e) =>
                      setSelectedTextId(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="w-full border border-gray-300 text-black rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select text layer</option>
                    {textLayers.map((t, idx) => (
                      <option key={t.id} value={t.id}>
                        Text {idx + 1}: {t.text.slice(0, 20) || "(empty)"}
                      </option>
                    ))}
                  </select>

                  {selectedTextId &&
                    (() => {
                      const layer =
                        textLayers.find((t) => t.id === selectedTextId) ||
                        textLayers[0];
                      if (!layer) return null;
                      return (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">
                              Text
                            </label>
                            <input
                              type="text"
                              value={layer.text}
                              placeholder="Enter custom text"
                              onChange={(e) => {
                                const v = e.target.value;
                                setTextLayers((p) =>
                                  p.map((t) =>
                                    t.id === layer.id ? { ...t, text: v } : t,
                                  ),
                                );
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-0.5">
                                Font Size
                              </label>
                              <input
                                type="number"
                                min={10}
                                max={120}
                                value={layer.fontSize}
                                onChange={(e) => {
                                  const v = Number(e.target.value) || 10;
                                  setTextLayers((p) =>
                                    p.map((t) =>
                                      t.id === layer.id
                                        ? { ...t, fontSize: v }
                                        : t,
                                    ),
                                  );
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-0.5">
                                Color
                              </label>
                              <input
                                type="color"
                                value={layer.fill}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setTextLayers((p) =>
                                    p.map((t) =>
                                      t.id === layer.id ? { ...t, fill: v } : t,
                                    ),
                                  );
                                }}
                                className="w-9 h-9 border border-gray-300 rounded-md cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">
                              Font Family
                            </label>
                            <select
                              value={layer.fontFamily}
                              onChange={(e) => {
                                const v = e.target.value;
                                setTextLayers((p) =>
                                  p.map((t) =>
                                    t.id === layer.id
                                      ? { ...t, fontFamily: v }
                                      : t,
                                  ),
                                );
                              }}
                              className="w-full border border-gray-300 text-black rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Poppins, sans-serif">
                                Poppins
                              </option>
                              <option value="Arial, sans-serif">Arial</option>
                              <option value="'Times New Roman', serif">
                                Times New Roman
                              </option>
                              <option value="'Courier New', monospace">
                                Courier
                              </option>
                              <option value="'Pacifico', cursive">
                                Script
                              </option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setTextLayers((p) =>
                                p.filter((t) => t.id !== layer.id),
                              );
                              setSelectedTextId((pid) =>
                                pid === layer.id ? null : pid,
                              );
                            }}
                            className="w-full text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 font-medium cursor-pointer transition-colors"
                          >
                            Delete This Text
                          </button>
                        </div>
                      );
                    })()}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t">
              <button
                onClick={handleDownload}
                disabled={!photoImg || isProcessing}
                className={
                  "w-full font-semibold py-2.5 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2 " +
                  (photoImg && !isProcessing
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download to Device
              </button>
              <button
                onClick={handleSaveAndNext}
                disabled={!photoImg || isProcessing}
                className={
                  "w-full font-semibold py-2.5 px-4 rounded-md text-base transition-colors " +
                  (photoImg && !isProcessing
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
              >
                Save & Select Size →
              </button>
            </div>

            {photoImg && !isProcessing && (
              <p className="text-xs text-gray-400 text-center">
                💡{" "}
                {isAcrylicClock
                  ? "Customize your clock colors above!"
                  : isAcrylicCutout
                    ? "Background removed! Drag to reposition"
                    : "Download saves to your device"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
