"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Group, Circle, Shape } from "react-konva";
import { useRouter } from "next/navigation";

const KEYCHAIN_SHAPES = [
  { id: 'circle', name: 'Circle', isCircle: true },
  { id: 'square', name: 'Square', radius: 5 },
  { id: 'rounded-square', name: 'Rounded Square', radius: 15 },
  { id: 'heart', name: 'Heart', isHeart: true },
  { id: 'rectangle', name: 'Rectangle', radius: 8, isRectangle: true },
];

export default function KeychainEditor() {
  const router = useRouter();
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [mockupImg, setMockupImg] = useState(null);
  const [selectedShape, setSelectedShape] = useState(KEYCHAIN_SHAPES[0]);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);

  // const CANVAS_WIDTH = 600;
  // const CANVAS_HEIGHT = 600;
  // const KEYCHAIN_SIZE = 400;

  // Load mockup background image
  useEffect(() => {
    const mockup = new window.Image();
    mockup.crossOrigin = 'anonymous';
    mockup.src = '/keychain-mockup.jpg';
    mockup.onload = () => setMockupImg(mockup);
    mockup.onerror = () => console.log('Mockup image not found');
  }, []);

  // Load and fit photo
  useEffect(() => {
    if (!photoSrc) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = photoSrc;
    img.onload = () => {
      setPhotoImg(img);

      let targetWidth, targetHeight;

      if (selectedShape.isRectangle) {
        targetWidth = KEYCHAIN_SIZE * 0.8;
        targetHeight = KEYCHAIN_SIZE * 0.6;
      } else {
        targetWidth = targetHeight = KEYCHAIN_SIZE * 0.9;
      }

      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );

      setPhotoScale(scale);

      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const offsetX = (targetWidth - displayWidth) / 2;
      const offsetY = (targetHeight - displayHeight) / 2;
      setPhotoPos({ x: offsetX, y: offsetY });
    };
  }, [photoSrc, selectedShape]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setPhotoSrc(event.target.result);
    reader.readAsDataURL(file);
  };

  const resetPhotoFit = () => {
    if (!photoImg) return;

    let targetWidth, targetHeight;
    if (selectedShape.isRectangle) {
      targetWidth = KEYCHAIN_SIZE * 0.8;
      targetHeight = KEYCHAIN_SIZE * 0.6;
    } else {
      targetWidth = targetHeight = KEYCHAIN_SIZE * 0.9;
    }

    const scale = Math.max(targetWidth / photoImg.width, targetHeight / photoImg.height);
    setPhotoScale(scale);

    const displayWidth = photoImg.width * scale;
    const displayHeight = photoImg.height * scale;
    const offsetX = (targetWidth - displayWidth) / 2;
    const offsetY = (targetHeight - displayHeight) / 2;
    setPhotoPos({ x: offsetX, y: offsetY });
  };

  const renderKeychain = () => {
    if (!photoImg) return null;

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Render metal chain above keychain
    const renderMetalChain = (topY) => {
      const chainLinks = 4;
      const linkHeight = 18;
      const linkWidth = 12;
      const startY = topY - (chainLinks * linkHeight) - 30;

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
            const linkY = startY + 20 + (i * linkHeight);
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

    // Heart shape
    if (selectedShape.isHeart) {
      const size = KEYCHAIN_SIZE * 0.9;
      const heartX = centerX - size / 2;
      const heartY = centerY - size / 2;
      const topHoleY = heartY + size * 0.05;

      return (
        <Group x={heartX} y={heartY}>
          {/* Metal chain */}
          {renderMetalChain(topHoleY)}

          {/* Bottom shadow for depth */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;

              ctx.beginPath();
              ctx.moveTo(width / 2, height);
              ctx.bezierCurveTo(width / 2, height - height / 4, 0, height * 0.75, 0, topCurveHeight);
              ctx.bezierCurveTo(0, 0, width / 4, 0, width / 2, topCurveHeight);
              ctx.bezierCurveTo(width * 0.75, 0, width, 0, width, topCurveHeight);
              ctx.bezierCurveTo(width, height * 0.75, width / 2, height - height / 4, width / 2, height);
              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            fill="rgba(0,0,0,0.15)"
            offsetX={-3}
            offsetY={-6}
          />

          {/* Main keychain base */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;

              ctx.beginPath();
              ctx.moveTo(width / 2, height);
              ctx.bezierCurveTo(width / 2, height - height / 4, 0, height * 0.75, 0, topCurveHeight);
              ctx.bezierCurveTo(0, 0, width / 4, 0, width / 2, topCurveHeight);
              ctx.bezierCurveTo(width * 0.75, 0, width, 0, width, topCurveHeight);
              ctx.bezierCurveTo(width, height * 0.75, width / 2, height - height / 4, width / 2, height);
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

              ctx.beginPath();
              ctx.moveTo(width / 2, height);
              ctx.bezierCurveTo(width / 2, height - height / 4, 0, height * 0.75, 0, topCurveHeight);
              ctx.bezierCurveTo(0, 0, width / 4, 0, width / 2, topCurveHeight);
              ctx.bezierCurveTo(width * 0.75, 0, width, 0, width, topCurveHeight);
              ctx.bezierCurveTo(width, height * 0.75, width / 2, height - height / 4, width / 2, height);
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

          {/* Glossy acrylic overlay effect */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size;
              const height = size;
              const topCurveHeight = height * 0.3;

              ctx.beginPath();
              ctx.moveTo(width / 2, height);
              ctx.bezierCurveTo(width / 2, height - height / 4, 0, height * 0.75, 0, topCurveHeight);
              ctx.bezierCurveTo(0, 0, width / 4, 0, width / 2, topCurveHeight);
              ctx.bezierCurveTo(width * 0.75, 0, width, 0, width, topCurveHeight);
              ctx.bezierCurveTo(width, height * 0.75, width / 2, height - height / 4, width / 2, height);
              ctx.closePath();

              const linear = ctx.createLinearlinear(0, 0, width, height);
              linear.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
              linear.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
              linear.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Highlight shine */}
          <Shape
            sceneFunc={(ctx, shape) => {
              const width = size * 0.3;
              const height = size * 0.6;

              ctx.beginPath();
              ctx.ellipse(size * 0.25, size * 0.25, width, height, -0.3, 0, Math.PI * 2);
              ctx.closePath();

              const linear = ctx.createRadiallinear(size * 0.25, size * 0.25, 0, size * 0.25, size * 0.25, width);
              linear.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
              linear.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
              linear.addColorStop(1, 'rgba(255, 255, 255, 0)');
              ctx.fillStyle = linear;
              ctx.fill();
            }}
            listening={false}
          />

          {/* Metal ring hole shadow */}
          <Circle
            x={size / 2}
            y={size * 0.05}
            radius={11}
            fill="rgba(0,0,0,0.2)"
            offsetY={-2}
          />

          {/* Metal ring hole base */}
          <Circle
            x={size / 2}
            y={size * 0.05}
            radius={10}
            fill="#c0c0c0"
            stroke="#909090"
            strokeWidth={1}
          />

          {/* Metal ring inner hole */}
          <Circle
            x={size / 2}
            y={size * 0.05}
            radius={6}
            fill="#505050"
            stroke="#707070"
            strokeWidth={0.5}
          />

          {/* Metal ring highlight */}
          <Circle
            x={size / 2 - 2}
            y={size * 0.05 - 2}
            radius={3}
            fill="rgba(255, 255, 255, 0.6)"
          />
        </Group>
      );
    }

    // Circle shape
    if (selectedShape.isCircle) {
      const size = KEYCHAIN_SIZE * 0.9;
      const x = centerX - size / 2;
      const y = centerY - size / 2;

      return (
        <Group x={x} y={y}>
          {/* Shadow */}
          <Circle
            x={size / 2}
            y={size / 2}
            radius={size / 2}
            fill="rgba(0,0,0,0.15)"
            offsetX={-3}
            offsetY={-6}
          />

          {/* Base */}
          <Circle
            x={size / 2}
            y={size / 2}
            radius={size / 2}
            fill="#ffffff"
            stroke="#d0d0d0"
            strokeWidth={2}
          />

          {/* Photo with circular clipping */}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
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

          {/* Glossy overlay */}
          <Circle
            x={size / 2}
            y={size / 2}
            radius={size / 2}
            fillLinearlinearStartPoint={{ x: 0, y: 0 }}
            fillLinearlinearEndPoint={{ x: size, y: size }}
            fillLinearlinearColorStops={[
              0, 'rgba(255, 255, 255, 0.4)',
              0.5, 'rgba(255, 255, 255, 0.1)',
              1, 'rgba(255, 255, 255, 0.05)'
            ]}
            listening={false}
          />

          {/* Metal ring */}
          <Circle x={size / 2} y={size * 0.08} radius={11} fill="rgba(0,0,0,0.2)" offsetY={-2} />
          <Circle x={size / 2} y={size * 0.08} radius={10} fill="#c0c0c0" stroke="#909090" strokeWidth={1} />
          <Circle x={size / 2} y={size * 0.08} radius={6} fill="#505050" stroke="#707070" strokeWidth={0.5} />
          <Circle x={size / 2 - 2} y={size * 0.08 - 2} radius={3} fill="rgba(255, 255, 255, 0.6)" />
        </Group>
      );
    }

    // Rectangle shape
    if (selectedShape.isRectangle) {
      const width = KEYCHAIN_SIZE * 0.8;
      const height = KEYCHAIN_SIZE * 0.6;
      const x = centerX - width / 2;
      const y = centerY - height / 2;

      return (
        <Group x={x} y={y}>
          {/* Shadow */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            cornerRadius={selectedShape.radius}
            fill="rgba(0,0,0,0.15)"
            offsetX={-3}
            offsetY={-6}
          />

          {/* Base */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            cornerRadius={selectedShape.radius}
            fill="#ffffff"
            stroke="#d0d0d0"
            strokeWidth={2}
          />

          {/* Photo */}
          <Group
            clipFunc={(ctx) => {
              ctx.beginPath();
              ctx.roundRect(0, 0, width, height, selectedShape.radius);
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

          {/* Glossy overlay */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            cornerRadius={selectedShape.radius}
            fillLinearlinearStartPoint={{ x: 0, y: 0 }}
            fillLinearlinearEndPoint={{ x: width, y: height }}
            fillLinearlinearColorStops={[
              0, 'rgba(255, 255, 255, 0.4)',
              0.5, 'rgba(255, 255, 255, 0.1)',
              1, 'rgba(255, 255, 255, 0.05)'
            ]}
            listening={false}
          />

          {/* Metal ring */}
          <Circle x={width / 2} y={height * 0.08} radius={11} fill="rgba(0,0,0,0.2)" offsetY={-2} />
          <Circle x={width / 2} y={height * 0.08} radius={10} fill="#c0c0c0" stroke="#909090" strokeWidth={1} />
          <Circle x={width / 2} y={height * 0.08} radius={6} fill="#505050" stroke="#707070" strokeWidth={0.5} />
          <Circle x={width / 2 - 2} y={height * 0.08 - 2} radius={3} fill="rgba(255, 255, 255, 0.6)" />
        </Group>
      );
    }

    // Square and Rounded Square shapes (default)
    const size = KEYCHAIN_SIZE * 0.9;
    const x = centerX - size / 2;
    const y = centerY - size / 2;

    return (
      <Group x={x} y={y}>
        {/* Shadow */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          cornerRadius={selectedShape.radius}
          fill="rgba(0,0,0,0.15)"
          offsetX={-3}
          offsetY={-6}
        />

        {/* Base */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          cornerRadius={selectedShape.radius}
          fill="#ffffff"
          stroke="#d0d0d0"
          strokeWidth={2}
        />

        {/* Photo */}
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, selectedShape.radius);
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

        {/* Glossy overlay */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          cornerRadius={selectedShape.radius}
          fillLinearlinearStartPoint={{ x: 0, y: 0 }}
          fillLinearlinearEndPoint={{ x: size, y: size }}
          fillLinearlinearColorStops={[
            0, 'rgba(255, 255, 255, 0.4)',
            0.5, 'rgba(255, 255, 255, 0.1)',
            1, 'rgba(255, 255, 255, 0.05)'
          ]}
          listening={false}
        />

        {/* Metal ring */}
        <Circle x={size / 2} y={size * 0.08} radius={11} fill="rgba(0,0,0,0.2)" offsetY={-2} />
        <Circle x={size / 2} y={size * 0.08} radius={10} fill="#c0c0c0" stroke="#909090" strokeWidth={1} />
        <Circle x={size / 2} y={size * 0.08} radius={6} fill="#505050" stroke="#707070" strokeWidth={0.5} />
        <Circle x={size / 2 - 2} y={size * 0.08 - 2} radius={3} fill="rgba(255, 255, 255, 0.6)" />
      </Group>
    );
  };


  const handleSaveAndNext = () => {
    if (!photoImg) return;

    const designData = {
      imageUri: photoSrc,
      keychainShape: selectedShape.id,
      photoScale: photoScale,
      photoPos: photoPos,
      productType: 'acrylic-keychain',
      timestamp: new Date().toISOString()
    };

    window.frameDesignData = designData;
    localStorage.setItem('frameDesignData', JSON.stringify(designData));
    router.push('/p');
  };

  const handleDownload = () => {
    if (!stageRef.current || !photoImg) return;

    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = `acrylic-keychain-${selectedShape.id}.png`;
    link.href = uri;
    link.click();
  };


  const getCanvasConfig = () => {
    if (typeof window === "undefined") {
      // SSR fallback
      return { width: 600, height: 600, keychain: 400 };
    }

    const w = window.innerWidth;

    // breakpoints example: <640 = mobile, <1024 = tablet, else desktop
    if (w < 640) {
      return { width: 260, height: 260, keychain: 180 };
    } else if (w < 1024) {
      return { width: 400, height: 400, keychain: 280 };
    } else {
      return { width: 600, height: 600, keychain: 400 };
    }
  };

  const [canvasConfig, setCanvasConfig] = useState(getCanvasConfig);

  useEffect(() => {
    const handleResize = () => {
      setCanvasConfig(getCanvasConfig());
    };

    handleResize(); // mount par bhi run kare
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CANVAS_WIDTH = canvasConfig.width;
  const CANVAS_HEIGHT = canvasConfig.height;
  const KEYCHAIN_SIZE = canvasConfig.keychain;

  return (
    <div className="min-h-screen bg-gray-100 p-6 py-30">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-medium text-center text-gray-900 mb-6 lg:mb-12">
          Acrylic Keychain Editor
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Preview */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white rounded-md shadow-md p-6 relative">
              {mockupImg ? (
                <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
                  <img
                    src={mockupImg.src}
                    alt="Keychain mockup"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                    style={{ filter: 'brightness(0.95)' }}
                  />
                  <div className="absolute inset-0">
                    <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                      <Layer>
                        {renderKeychain()}
                      </Layer>
                    </Stage>
                  </div>
                </div>
              ) : (
                <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                  <Layer>
                    <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#f3f4f6" />
                    {renderKeychain()}

                    {!photoImg && (
                      <>
                        <Rect
                          x={CANVAS_WIDTH / 2 - 110}
                          y={CANVAS_HEIGHT / 2 - 35}
                          width={220}
                          height={70}
                          fill="#dc2626"
                          cornerRadius={12}
                        />
                      </>
                    )}
                  </Layer>
                </Stage>
              )}
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="lg:w-80 bg-white rounded-md shadow-md p-6 space-y-6">
            <div>
              <label className="block text-md font-medium text-black mb-2">Keychain Shape</label>
              <select
                value={selectedShape.id}
                onChange={(e) => {
                  const shape = KEYCHAIN_SHAPES.find(s => s.id === e.target.value);
                  setSelectedShape(shape);
                }}
                className="w-full border-2 border-gray-300 text-black rounded-lg px-4 py-2.5 text-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-400 transition-colors"
              >
                {KEYCHAIN_SHAPES.map((shape) => (
                  <option key={shape.id} value={shape.id}>
                    {shape.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {photoSrc ? "Change Photo" : "Select Photo"}
              </button>
            </div>

            {/* {photoImg && (
              <div className="space-y-3 pt-3 border-t">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Photo Zoom: {photoScale.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={photoScale}
                    onChange={(e) => setPhotoScale(Number(e.target.value))}
                    className="w-full accent-red-600 h-2"
                  />
                </div>

                <button
                  onClick={resetPhotoFit}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reset Position & Fit
                </button>
              </div>
            )} */}

            <div className="space-y-3 pt-3 border-t">
              <button
                onClick={handleDownload}
                disabled={!photoImg}
                className={`w-full font-semibold py-3 px-4 rounded-md text-base transition-colors flex items-center justify-center gap-2 ${photoImg ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download to Device
              </button>

              <button
                onClick={handleSaveAndNext}
                disabled={!photoImg}
                className={`w-full font-semibold py-3 px-4 rounded-md text-lg transition-colors ${photoImg ? "bg-red-600 hover:bg-red-700 text-white shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Save & Select Size →
              </button>
            </div>

            {photoImg && (
              <p className="text-xs text-gray-500 text-center pt-2">
                💡 Drag the photo to reposition within the keychain
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}