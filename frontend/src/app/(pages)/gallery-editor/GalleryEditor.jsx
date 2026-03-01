// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Stage, Layer, Image as KonvaImage, Rect, Group, Text } from "react-konva";
// import { domToPng } from 'modern-screenshot';
// import { useRouter } from 'next/navigation';
// import Sidebar from '@/components/section/Sidebar';

// // Gallery layout configurations with NO GAPS and NO BORDER RADIUS
// const GALLERY_LAYOUTS = {
//   LAYOUT_2_HORIZONTAL: {
//     id: 'layout-2-h',
//     name: '2 Photos - Horizontal',
//     count: 2,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 2, h: height },
//       { x: width / 2, y: 0, w: width / 2, h: height },
//     ]
//   },
//   LAYOUT_2_VERTICAL: {
//     id: 'layout-2-v',
//     name: '2 Photos - Vertical',
//     count: 2,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width, h: height / 2 },
//       { x: 0, y: height / 2, w: width, h: height / 2 },
//     ]
//   },
//   LAYOUT_3_HORIZONTAL: {
//     id: 'layout-3-h',
//     name: '3 Photos - Horizontal',
//     count: 3,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 3, h: height },
//       { x: width / 3, y: 0, w: width / 3, h: height },
//       { x: (width / 3) * 2, y: 0, w: width / 3, h: height },
//     ]
//   },
//   LAYOUT_3_VERTICAL: {
//     id: 'layout-3-v',
//     name: '3 Photos - Vertical',
//     count: 3,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width, h: height / 3 },
//       { x: 0, y: height / 3, w: width, h: height / 3 },
//       { x: 0, y: (height / 3) * 2, w: width, h: height / 3 },
//     ]
//   },
//   LAYOUT_4_GRID: {
//     id: 'layout-4-grid',
//     name: '4 Photos - Grid',
//     count: 4,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 2, h: height / 2 },
//       { x: width / 2, y: 0, w: width / 2, h: height / 2 },
//       { x: 0, y: height / 2, w: width / 2, h: height / 2 },
//       { x: width / 2, y: height / 2, w: width / 2, h: height / 2 },
//     ]
//   },
//   LAYOUT_4_HORIZONTAL: {
//     id: 'layout-4-h',
//     name: '4 Photos - Horizontal',
//     count: 4,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 4, h: height },
//       { x: width / 4, y: 0, w: width / 4, h: height },
//       { x: (width / 4) * 2, y: 0, w: width / 4, h: height },
//       { x: (width / 4) * 3, y: 0, w: width / 4, h: height },
//     ]
//   },
//   LAYOUT_4_VERTICAL: {
//     id: 'layout-4-v',
//     name: '4 Photos - Vertical',
//     count: 4,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width, h: height / 4 },
//       { x: 0, y: height / 4, w: width, h: height / 4 },
//       { x: 0, y: (height / 4) * 2, w: width, h: height / 4 },
//       { x: 0, y: (height / 4) * 3, w: width, h: height / 4 },
//     ]
//   },
//   LAYOUT_6_GRID: {
//     id: 'layout-6-grid',
//     name: '6 Photos - Grid (2x3)',
//     count: 6,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 2, h: height / 3 },
//       { x: width / 2, y: 0, w: width / 2, h: height / 3 },
//       { x: 0, y: height / 3, w: width / 2, h: height / 3 },
//       { x: width / 2, y: height / 3, w: width / 2, h: height / 3 },
//       { x: 0, y: (height / 3) * 2, w: width / 2, h: height / 3 },
//       { x: width / 2, y: (height / 3) * 2, w: width / 2, h: height / 3 },
//     ]
//   },
//   LAYOUT_6_HORIZONTAL: {
//     id: 'layout-6-h',
//     name: '6 Photos - Horizontal',
//     count: 6,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 6, h: height },
//       { x: width / 6, y: 0, w: width / 6, h: height },
//       { x: (width / 6) * 2, y: 0, w: width / 6, h: height },
//       { x: (width / 6) * 3, y: 0, w: width / 6, h: height },
//       { x: (width / 6) * 4, y: 0, w: width / 6, h: height },
//       { x: (width / 6) * 5, y: 0, w: width / 6, h: height },
//     ]
//   },
//   LAYOUT_9_GRID: {
//     id: 'layout-9-grid',
//     name: '9 Photos - Grid (3x3)',
//     count: 9,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 3, h: height / 3 },
//       { x: width / 3, y: 0, w: width / 3, h: height / 3 },
//       { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
//       { x: 0, y: height / 3, w: width / 3, h: height / 3 },
//       { x: width / 3, y: height / 3, w: width / 3, h: height / 3 },
//       { x: (width / 3) * 2, y: height / 3, w: width / 3, h: height / 3 },
//       { x: 0, y: (height / 3) * 2, w: width / 3, h: height / 3 },
//       { x: width / 3, y: (height / 3) * 2, w: width / 3, h: height / 3 },
//       { x: (width / 3) * 2, y: (height / 3) * 2, w: width / 3, h: height / 3 },
//     ]
//   },
//   LAYOUT_12_GRID: {
//     id: 'layout-12-grid',
//     name: '12 Photos - Grid (3x4)',
//     count: 12,
//     positions: (width, height) => [
//       { x: 0, y: 0, w: width / 3, h: height / 4 },
//       { x: width / 3, y: 0, w: width / 3, h: height / 4 },
//       { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 4 },
//       { x: 0, y: height / 4, w: width / 3, h: height / 4 },
//       { x: width / 3, y: height / 4, w: width / 3, h: height / 4 },
//       { x: (width / 3) * 2, y: height / 4, w: width / 3, h: height / 4 },
//       { x: 0, y: (height / 4) * 2, w: width / 3, h: height / 4 },
//       { x: width / 3, y: (height / 4) * 2, w: width / 3, h: height / 4 },
//       { x: (width / 3) * 2, y: (height / 4) * 2, w: width / 3, h: height / 4 },
//       { x: 0, y: (height / 4) * 3, w: width / 3, h: height / 4 },
//       { x: width / 3, y: (height / 4) * 3, w: width / 3, h: height / 4 },
//       { x: (width / 3) * 2, y: (height / 4) * 3, w: width / 3, h: height / 4 },
//     ]
//   },
  

// LAYOUT_5_LEFT_EMPHASIS: {
//   id: 'layout-5-left',
//   name: '5 Photos - Left Emphasis',
//   count: 5,
//   positions: (width, height) => [
//     { x: 0, y: 0, w: width / 2, h: height },
//     { x: width / 2, y: 0, w: width / 4, h: height / 2 },
//     { x: (width / 4) * 3, y: 0, w: width / 4, h: height / 2 },
//     { x: width / 2, y: height / 2, w: width / 4, h: height / 2 },
//     { x: (width / 4) * 3, y: height / 2, w: width / 4, h: height / 2 },
//   ]
// },

// LAYOUT_6_CENTER_EMPHASIS: {
//   id: 'layout-6-center',
//   name: '6 Photos - Center Emphasis',
//   count: 6,
//   positions: (width, height) => [
//     { x: 0, y: 0, w: width / 3, h: height / 3 },
//     { x: width / 3, y: 0, w: width / 3, h: height / 3 },
//     { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
//     { x: 0, y: height / 3, w: width / 3, h: (height / 3) * 2 },
//     { x: width / 3, y: height / 3, w: width / 3, h: (height / 3) * 2 },
//     { x: (width / 3) * 2, y: height / 3, w: width / 3, h: (height / 3) * 2 },
//   ]
// },

// LAYOUT_7_CENTER_LARGE: {
//   id: 'layout-7-center-large',
//   name: '7 Photos - Center Large',
//   count: 7,
//   positions: (width, height) => [
//     { x: 0, y: 0, w: width / 3, h: height / 3 },
//     { x: width / 3, y: 0, w: width / 3, h: height / 3 },
//     { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
//     { x: 0, y: height / 3, w: width / 3, h: height / 3 },
//     { x: width / 3, y: height / 3, w: width / 3, h: height / 3 },
//     { x: (width / 3) * 2, y: height / 3, w: width / 3, h: height / 3 },
//     { x: 0, y: (height / 3) * 2, w: width, h: height / 3 },
//   ]
// },

// LAYOUT_4_FILMSTRIP: {
//   id: 'layout-4-filmstrip',
//   name: 'Top Image- Emphasis',
//   count: 4,
//   positions: (width, height) => [
//     { x: 0, y: 0, w: width, h: height * 0.6 },
//     { x: 0, y: height * 0.6, w: width / 3, h: height * 0.4 },
//     { x: width / 3, y: height * 0.6, w: width / 3, h: height * 0.4 },
//     { x: (width / 3) * 2, y: height * 0.6, w: width / 3, h: height * 0.4 },
//   ]
// },

// LAYOUT_3_COLORFUL: {
//   id: 'layout-3-colorful',
//   name: '3 Photos - Polaroid Style',
//   count: 3,
//   positions: (width, height) => [
//     { x: width * 0.05, y: height * 0.05, w: width * 0.4, h: height * 0.4 },
//     { x: width * 0.3, y: height * 0.25, w: width * 0.4, h: height * 0.5 },
//     { x: width * 0.55, y: height * 0.1, w: width * 0.4, h: height * 0.4 },
//   ]
// },
// };

// // Simple rectangle clip (no rounded corners)
// const drawShapeClip = (ctx, pos) => {
//   const { x, y, w, h } = pos;
//   ctx.beginPath();
//   ctx.rect(x, y, w, h);
//   ctx.closePath();
// };

// export default function GalleryEditor() {
//   const router = useRouter();

//   const [imagePositions, setImagePositions] = useState([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null);

//   const [selectedLayout, setSelectedLayout] = useState(GALLERY_LAYOUTS.LAYOUT_4_GRID);
//   const [photos, setPhotos] = useState([]);
//   const [loadedImages, setLoadedImages] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const fileInputRef = useRef(null);
//   const stageRef = useRef(null);

//   // Custom text layers for mini photo gallery
//   const [textLayers, setTextLayers] = useState([]);
//   const [selectedTextId, setSelectedTextId] = useState(null);


//   // Replace the current drag handlers with these:

//   const handleImageDragStart = (index) => {
//     setSelectedImageIndex(index);
//   };

//   const handleImageDragMove = (e, index) => {
//     if (selectedImageIndex !== index) return;

//     const stage = e.target.getStage();
//     const pointerPos = stage.getPointerPosition();
//     const positions = selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT);
//     const pos = positions[index];

//     // Calculate the new offset based on pointer position relative to frame center
//     const frameCenterX = pos.x + pos.w / 2;
//     const frameCenterY = pos.y + pos.h / 2;

//     const newOffsetX = pointerPos.x - frameCenterX;
//     const newOffsetY = pointerPos.y - frameCenterY;

//     setImagePositions((prev) => {
//       const updated = [...prev];
//       updated[index] = { offsetX: newOffsetX, offsetY: newOffsetY };
//       return updated;
//     });
//   };

//   const handleImageDragEnd = () => {
//     setSelectedImageIndex(null);
//   };








//   const getCanvasConfig = () => {
//     if (typeof window === "undefined") {
//       return { width: 600, height: 600 };
//     }

//     const w = window.innerWidth;

//     if (w < 640) {
//       return { width: 280, height: 280 };
//     } else if (w < 1024) {
//       return { width: 400, height: 400 };
//     } else {
//       return { width: 500, height: 500 };
//     }
//   };

//   const [canvasConfig, setCanvasConfig] = useState(getCanvasConfig);
//   const [orientation, setOrientation] = useState("landscape");

//   useEffect(() => {
//     const handleResize = () => {
//       setCanvasConfig(getCanvasConfig());
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const baseCanvasSize = canvasConfig.width; // width and height are equal
//   const CANVAS_WIDTH =
//     orientation === "landscape" ? baseCanvasSize : Math.round(baseCanvasSize * 0.75);
//   const CANVAS_HEIGHT =
//     orientation === "landscape" ? Math.round(baseCanvasSize * 0.75) : baseCanvasSize;

//   const toggleOrientation = () => {
//     setOrientation((prev) => (prev === "landscape" ? "portrait" : "landscape"));
//   };

//   useEffect(() => {
//     if (photos.length === 0) {
//       setLoadedImages([]);
//       return;
//     }

//     const loadImages = async () => {
//       const promises = photos.map((photoSrc) => {
//         return new Promise((resolve) => {
//           const img = new window.Image();
//           img.crossOrigin = "anonymous";
//           img.src = photoSrc;
//           img.onload = () => resolve(img);
//           img.onerror = () => resolve(null);
//         });
//       });

//       const images = await Promise.all(promises);
//       setLoadedImages(images.filter(img => img !== null));
//     };

//     loadImages();
//   }, [photos]);

//   const renderGallery = () => {
//     if (loadedImages.length === 0) return null;

//     const positions = selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT);

//     return positions.map((pos, index) => {
//       const img = loadedImages[index];
//       if (!img) {
//         return (
//           <Group key={index}>
//             <Rect
//               x={pos.x}
//               y={pos.y}
//               width={pos.w}
//               height={pos.h}
//               fill="#f3f4f6"
//               stroke="#d1d5db"
//               strokeWidth={1}
//             />
//             <Text
//               x={pos.x}
//               y={pos.y + pos.h / 2 - 10}
//               width={pos.w}
//               text={`Photo ${index + 1}`}
//               fontSize={12}
//               fill="#9ca3af"
//               align="center"
//             />
//           </Group>
//         );
//       }

//       const imgAspect = img.width / img.height;
//       const frameAspect = pos.w / pos.h;

//       let scale;
//       if (imgAspect > frameAspect) {
//         scale = pos.h / img.height;
//       } else {
//         scale = pos.w / img.width;
//       }

//       const displayWidth = img.width * scale;
//       const displayHeight = img.height * scale;

//       // Get current position offset
//       const currentOffset = imagePositions[index] || { offsetX: 0, offsetY: 0 };

//       const offsetX = pos.x + (pos.w - displayWidth) / 2 + currentOffset.offsetX;
//       const offsetY = pos.y + (pos.h - displayHeight) / 2 + currentOffset.offsetY;

//       return (
//         <Group key={index}>
//           {/* Clipping frame */}
//           <Group clipFunc={(ctx) => drawShapeClip(ctx, pos)}>
//             {/* Draggable Image - FIXED for smooth dragging */}
//             <KonvaImage
//               image={img}
//               x={offsetX}
//               y={offsetY}
//               width={displayWidth}
//               height={displayHeight}
//               draggable={false}
//               onMouseDown={() => handleImageDragStart(index)}
//               onMouseMove={(e) => {
//                 if (selectedImageIndex === index) {
//                   handleImageDragMove(e, index);
//                 }
//               }}
//               onMouseUp={handleImageDragEnd}
//               onMouseLeave={handleImageDragEnd}
//               onTouchStart={() => handleImageDragStart(index)}
//               onTouchMove={(e) => {
//                 if (selectedImageIndex === index) {
//                   handleImageDragMove(e, index);
//                 }
//               }}
//               onTouchEnd={handleImageDragEnd}
//               shadowColor={selectedImageIndex === index ? "rgba(59, 130, 246, 0.5)" : "transparent"}
//               shadowBlur={selectedImageIndex === index ? 10 : 0}
//               shadowOpacity={selectedImageIndex === index ? 0.8 : 0}
//               opacity={selectedImageIndex === index ? 0.8 : 1}
//               listening={true}
//             />
//           </Group>

//           {/* Frame border indicator */}
//           <Rect
//             x={pos.x}
//             y={pos.y}
//             width={pos.w}
//             height={pos.h}
//             stroke={selectedImageIndex === index ? "#3b82f6" : "transparent"}
//             strokeWidth={2}
//             listening={false}
//           />
//         </Group>
//       );
//     });
//   };

//   const handleFileChange = (e) => {
//     const files = e.target.files;

//     if (!files || files.length === 0) {
//       return;
//     }

//     const filesArray = Array.from(files);
//     const maxPhotos = selectedLayout.count;

//     if (filesArray.length > maxPhotos) {
//       alert(`This layout supports only ${maxPhotos} photos. First ${maxPhotos} photos will be used.`);
//     }

//     const filesToProcess = filesArray.slice(0, maxPhotos);

//     const processFiles = async () => {
//       const results = [];

//       for (const file of filesToProcess) {
//         try {
//           const result = await new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve(e.target.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(file);
//           });
//           results.push(result);
//         } catch (error) {
//           console.error('Error reading file:', error);
//         }
//       }

//       setPhotos(results);
//     };

//     processFiles();
//   };

//   const handleLayoutChange = (layout) => {
//     setSelectedLayout(layout);
//     if (photos.length > layout.count) {
//       setPhotos(photos.slice(0, layout.count));
//     }
//   };


//   const handleDownload = () => {
//     if (!stageRef.current || loadedImages.length === 0) {
//       alert('Please upload photos first!');
//       return;
//     }

//     setIsProcessing(true);

//     stageRef.current.toDataURL({
//       pixelRatio: 3,
//       mimeType: 'image/png'
//     }).then((uri) => {
//       const link = document.createElement("a");
//       link.download = `mini-gallery-${selectedLayout.name.toLowerCase().replace(/\s/g, '-')}.png`;
//       link.href = uri;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       setIsProcessing(false);
//     }).catch((error) => {
//       console.error('Download failed:', error);
//       alert('Download failed. Please try again.');
//       setIsProcessing(false);
//     });
//   };

//   // NEW: Save to Cart functionality with modern-screenshot
//   const handleSaveAndNext = async () => {
//     if (!stageRef.current || loadedImages.length === 0) {
//       alert('Please upload all required photos first!');
//       return;
//     }

//     if (loadedImages.length < selectedLayout.count) {
//       alert(`This layout requires ${selectedLayout.count} photos. You have only ${loadedImages.length}.`);
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Use modern-screenshot to capture the canvas with high quality
//       const stageElement = stageRef.current.container();
//       const previewImage = await domToPng(stageElement, {
//         quality: 1,
//         scale: 3, // High quality 3x resolution
//         backgroundColor: '#ffffff',
//         captureCanvas: false // Use DOM screenshot for better quality
//       });

//       // Create comprehensive design data for cart
//       const designData = {
//         productType: 'mini-photo-gallery',
//         imageUris: photos, // Original uploaded photos array
//         previewImage: previewImage, // High-quality gallery screenshot
//         layoutName: selectedLayout.name,
//         layoutId: selectedLayout.id,
//         layoutPositions: selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT),
//         photoCount: selectedLayout.count,
//         canvasDimensions: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
//         orientation,
//         textLayers,
//         timestamp: new Date().toISOString(),
//         isGallery: true
//       };

//       // Save to global window object for cart access
//       window.frameDesignData = designData;

//       console.log('✅ Gallery Design saved to cart:', designData);

//       // Navigate to size selection page
//       router.push('/p');

//     } catch (error) {
//       console.error('❌ Error capturing gallery design:', error);
//       alert('Failed to save gallery design. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleButtonClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//       fileInputRef.current.click();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-10">
//       <Sidebar />
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-8 pt-10">
//       <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-2 text-center 
// font-['Great_Vibes'] italic">

//   <span className="text-black">
//     Mini Photo
//   </span>{" "}
  
//   <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 
//   bg-clip-text text-transparent">
//     Gallery Editor
//   </span>

// </h1>
//           <p className="text-sm text-gray-600">Create stunning photo collages with tight, seamless layouts</p>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

//           {/* LEFT SIDE: Preview Section */}
//           <div className="w-full lg:w-1/2">
//             <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
//               <div className="mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                   Live Preview 
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-1">Your gallery will appear here</p>
              
//               </div>

//               <div className="flex justify-center">
//                 <div className="inline-block bg-gray-100 p-2 rounded-lg">
//                   <Stage
//                     ref={stageRef}
//                     width={CANVAS_WIDTH}
//                     height={CANVAS_HEIGHT}
//                     style={{
//                       boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                       borderRadius: '4px'
//                     }}
//                   >
//                     <Layer>
//                       <Rect
//                         x={0}
//                         y={0}
//                         width={CANVAS_WIDTH}
//                         height={CANVAS_HEIGHT}
//                         fill="#ffffff"
//                       />

//                       {renderGallery()}

//                       {/* Custom text layers overlay */}
//                       {textLayers.map((layer) => (
//                         <Text
//                           key={layer.id}
//                           x={layer.x}
//                           y={layer.y}
//                           text={layer.text}
//                           fontSize={layer.fontSize}
//                           fontFamily={layer.fontFamily}
//                           fill={layer.fill}
//                           draggable
//                           onDragEnd={(e) => {
//                             const node = e.target;
//                             setTextLayers((prev) =>
//                               prev.map((t) =>
//                                 t.id === layer.id
//                                   ? { ...t, x: node.x(), y: node.y() }
//                                   : t
//                               )
//                             );
//                           }}
//                           onClick={() => setSelectedTextId(layer.id)}
//                           onTap={() => setSelectedTextId(layer.id)}
//                           shadowColor={
//                             selectedTextId === layer.id
//                               ? "rgba(0,0,0,0.35)"
//                               : "transparent"
//                           }
//                           shadowBlur={selectedTextId === layer.id ? 6 : 0}
//                         />
//                       ))}

//                       {loadedImages.length === 0 && (
//                         <>
//                           <Rect
//                             x={CANVAS_WIDTH / 2 - 100}
//                             y={CANVAS_HEIGHT / 2 - 40}
//                             width={200}
//                             height={80}
//                             fill="#dc2626"
//                           />
//                           <Text
//                             x={CANVAS_WIDTH / 2 - 100}
//                             y={CANVAS_HEIGHT / 2 - 15}
//                             width={200}
//                             text={`UPLOAD ${selectedLayout.count} PHOTOS`}
//                             fontSize={16}
//                             fontStyle="bold"
//                             fill="#ffffff"
//                             align="center"
//                           />
//                           <Text
//                             x={CANVAS_WIDTH / 2 - 100}
//                             y={CANVAS_HEIGHT / 2 + 10}
//                             width={200}
//                             text="Select layout & upload →"
//                             fontSize={11}
//                             fill="#ffffff"
//                             align="center"
//                           />
//                         </>
//                       )}
//                     </Layer>
//                   </Stage>
//                 </div>
//               </div>
//                 <p className="text-xslg:text-sm text-gray-500 mt-1 text-center">Drag To adjust images</p>
//             </div>
//           </div>

//           {/* RIGHT SIDE: Controls Section */}
//           <div className="w-full lg:w-1/2">
//             <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-5 border border-gray-200">

//               <div className="mb-2">
//                 <label className="block text-sm font-semibold text-gray-900 mb-1">
//                   Orientation
//                 </label>
//                 <button
//                   type="button"
//                   onClick={toggleOrientation}
//                   className="w-full cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-3 rounded-lg text-sm transition-colors"
//                 >
//                   Switch to {CANVAS_WIDTH >= CANVAS_HEIGHT ? "Vertical" : "Horizontal"}
//                 </button>
//               </div>

//               {/* Layout Selection */}
//               <div>
//                 <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
//                   </svg>
//                   Select Layout
//                 </label>
//                 <select
//                   value={selectedLayout.id}
//                   onChange={(e) => {
//                     const layout = Object.values(GALLERY_LAYOUTS).find(l => l.id === e.target.value);
//                     handleLayoutChange(layout);
//                   }}
//                   className="w-full border-2 border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm hover:border-purple-300 transition-colors"
//                 >
//                   {Object.values(GALLERY_LAYOUTS).map((layout) => (
//                     <option key={layout.id} value={layout.id}>
//                       {layout.name}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
//                   <p className="text-sm text-purple-800">
//                     📌 This layout needs <strong className="font-bold">{selectedLayout.count} photos</strong>
//                   </p>
//                 </div>
//               </div>

//               {/* Photo Upload */}
//               <div>
//                 <label className="block text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Upload Photos
//                 </label>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   className="hidden"
//                   key={selectedLayout.id}
//                 />

//                 <button
//                   onClick={handleButtonClick}
//                   className="w-full bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
//                   disabled={isProcessing}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   {photos.length > 0 ? `Change Photos (${photos.length}/${selectedLayout.count})` : `Select ${selectedLayout.count} Photos`}
//                 </button>

//                 {/* Instructions */}
//                 <div className="mt-4 p-4 bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
//                   <p className="text-sm text-blue-900 font-semibold mb-2 flex items-center gap-2">
//                     <span>💡</span>
//                     How to select multiple photos:
//                   </p>
//                   <ul className="text-sm text-blue-800 space-y-1.5 list-none">
//                     <li className="flex items-start gap-2">
//                       <span className="text-blue-500">•</span>
//                       <span>Hold <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">Ctrl</kbd> (Windows) or <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">Cmd</kbd> (Mac)</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-blue-500">•</span>
//                       <span>Click {selectedLayout.count} photos one by one</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-blue-500">•</span>
//                       <span>Or use <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono">Shift</kbd> to select a range</span>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Status */}
//                 <div className="mt-4 space-y-2">
//                   {photos.length > 0 ? (
//                     <div className="text-sm text-green-700 font-medium text-center p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
//                       ✓ {photos.length} of {selectedLayout.count} photo(s) selected
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-600 text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       📸 Click button above to select {selectedLayout.count} photos
//                     </div>
//                   )}

//                   {photos.length > 0 && photos.length < selectedLayout.count && (
//                     <div className="text-sm text-orange-700 text-center p-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
//                       ⚠️ Need {selectedLayout.count - photos.length} more photo(s)
//                     </div>
//                   )}
//                 </div>

//                 {/* Thumbnails */}
//                 {photos.length > 0 && (
//                   <div className="mt-4 grid grid-cols-4 gap-2">
//                     {photos.map((photo, index) => (
//                       <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-400 shadow-md">
//                         <img
//                           src={photo}
//                           alt={`Photo ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute top-1 left-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
//                           {index + 1}
//                         </div>
//                       </div>
//                     ))}
//                     {Array.from({ length: selectedLayout.count - photos.length }).map((_, index) => (
//                       <div key={`empty-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
//                         <span className="text-gray-400 text-2xl">+</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Custom Text Controls */}
//               <div className="pt-4 border-t border-gray-200 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-base font-semibold text-gray-900">
//                     Custom Text on Gallery
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const id = Date.now();
//                       const next = {
//                         id,
//                         text: "Your text here",
//                         x: CANVAS_WIDTH / 2 - 60,
//                         y: CANVAS_HEIGHT / 2,
//                         fontSize: 22,
//                         fill: "#111827",
//                         fontFamily: "Poppins, sans-serif",
//                       };
//                       setTextLayers((prev) => [...prev, next]);
//                       setSelectedTextId(id);
//                     }}
//                     className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-black cursor-pointer"
//                   >
//                     + Add Text
//                   </button>
//                 </div>

//                 {textLayers.length > 0 && (
//                   <div className="space-y-2">
//                     <select
//                       value={selectedTextId ?? ""}
//                       onChange={(e) =>
//                         setSelectedTextId(
//                           e.target.value ? Number(e.target.value) : null
//                         )
//                       }
//                       className="w-full border-2 border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     >
//                       <option value="">Select text layer</option>
//                       {textLayers.map((t, idx) => (
//                         <option key={t.id} value={t.id}>
//                           Text {idx + 1}: {t.text.slice(0, 20) || "(empty)"}
//                         </option>
//                       ))}
//                     </select>

//                     {selectedTextId && (() => {
//                       const layer =
//                         textLayers.find((t) => t.id === selectedTextId) ||
//                         textLayers[0];
//                       if (!layer) return null;
//                       return (
//                         <div className="space-y-2">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-900 mb-1">
//                               Text
//                             </label>
//                             <input
//                               type="text"
//                               value={layer.text}
//                               onChange={(e) => {
//                                 const value = e.target.value;
//                                 setTextLayers((prev) =>
//                                   prev.map((t) =>
//                                     t.id === layer.id
//                                       ? { ...t, text: value }
//                                       : t
//                                   )
//                                 );
//                               }}
//                               className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                               placeholder="Enter custom text"
//                             />
//                           </div>

//                           <div className="flex gap-3">
//                             <div className="flex-1">
//                               <label className="block text-xs font-medium text-gray-900 mb-1">
//                                 Font Size
//                               </label>
//                               <input
//                                 type="number"
//                                 min={10}
//                                 max={120}
//                                 value={layer.fontSize}
//                                 onChange={(e) => {
//                                   const value = Number(e.target.value) || 10;
//                                   setTextLayers((prev) =>
//                                     prev.map((t) =>
//                                       t.id === layer.id
//                                         ? { ...t, fontSize: value }
//                                         : t
//                                     )
//                                   );
//                                 }}
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-900 mb-1">
//                                 Color
//                               </label>
//                               <input
//                                 type="color"
//                                 value={layer.fill}
//                                 onChange={(e) => {
//                                   const value = e.target.value;
//                                   setTextLayers((prev) =>
//                                     prev.map((t) =>
//                                       t.id === layer.id
//                                         ? { ...t, fill: value }
//                                         : t
//                                     )
//                                   );
//                                 }}
//                                 className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
//                               />
//                             </div>
//                           </div>

//                           <div>
//                             <label className="block text-xs font-medium text-gray-900 mb-1">
//                               Font Family
//                             </label>
//                             <select
//                               value={layer.fontFamily}
//                               onChange={(e) => {
//                                 const value = e.target.value;
//                                 setTextLayers((prev) =>
//                                   prev.map((t) =>
//                                     t.id === layer.id
//                                       ? { ...t, fontFamily: value }
//                                       : t
//                                   )
//                                 );
//                               }}
//                               className="w-full border border-gray-300 text-gray-900 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
//                             >
//                               <option value="Poppins, sans-serif">Poppins</option>
//                               <option value="Arial, sans-serif">Arial</option>
//                               <option value="'Times New Roman', serif">
//                                 Times New Roman
//                               </option>
//                               <option value="'Courier New', monospace">
//                                 Courier
//                               </option>
//                               <option value="'Pacifico', cursive">Script</option>
//                             </select>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => {
//                               setTextLayers((prev) =>
//                                 prev.filter((t) => t.id !== layer.id)
//                               );
//                               setSelectedTextId((prevId) =>
//                                 prevId === layer.id ? null : prevId
//                               );
//                             }}
//                             className="w-full mt-1 text-xs text-red-600 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 font-medium cursor-pointer"
//                           >
//                             Delete This Text
//                           </button>
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons - NEW SECTION WITH SAVE & SELECT SIZE */}
//               <div className="pt-4 border-t border-gray-200 space-y-3">
//                 {/* Download Button */}
//                 <button
//                   onClick={handleDownload}
//                   disabled={loadedImages.length === 0 || isProcessing}
//                   className={
//                     "w-full font-semibold py-3 px-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 " +
//                     (loadedImages.length > 0 && !isProcessing
//                       ? "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed")
//                   }
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Preparing...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                       </svg>
//                       Download to Device
//                     </>
//                   )}
//                 </button>

//                 {/* Save & Select Size Button */}
//                 <button
//                   onClick={handleSaveAndNext}
//                   disabled={loadedImages.length === 0 || loadedImages.length < selectedLayout.count || isProcessing}
//                   className={
//                     "w-full font-bold py-4 px-4 rounded-xl text-lg transition-all duration-300 transform " +
//                     (loadedImages.length > 0 && loadedImages.length === selectedLayout.count && !isProcessing
//                       ? "bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
//                       : "bg-gray-200 text-gray-400 cursor-not-allowed")
//                   }
//                 >
//                   {isProcessing ? (
//                     <>
//                       <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Saving to Cart...
//                     </>
//                   ) : loadedImages.length === 0 ? (
//                     "Upload Photos First"
//                   ) : loadedImages.length < selectedLayout.count ? (
//                     `Need ${selectedLayout.count - loadedImages.length} More Photo(s)`
//                   ) : (
//                     "Save & Select Size →"
//                   )}
//                 </button>

//                 {loadedImages.length > 0 && loadedImages.length === selectedLayout.count && !isProcessing && (
//                   <p className="text-xs text-green-600 text-center font-medium">
//                     ✓ Gallery ready! Click to add to cart & select size
//                   </p>
//                 )}
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Group, Text } from "react-konva";
import { domToPng } from 'modern-screenshot';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/section/Sidebar';

const GALLERY_LAYOUTS = {
  LAYOUT_2_HORIZONTAL: {
    id: 'layout-2-h', name: '2 Photos - Horizontal', count: 2,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 2, h: height },
      { x: width / 2, y: 0, w: width / 2, h: height },
    ]
  },
  LAYOUT_2_VERTICAL: {
    id: 'layout-2-v', name: '2 Photos - Vertical', count: 2,
    positions: (width, height) => [
      { x: 0, y: 0, w: width, h: height / 2 },
      { x: 0, y: height / 2, w: width, h: height / 2 },
    ]
  },
  LAYOUT_3_HORIZONTAL: {
    id: 'layout-3-h', name: '3 Photos - Horizontal', count: 3,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 3, h: height },
      { x: width / 3, y: 0, w: width / 3, h: height },
      { x: (width / 3) * 2, y: 0, w: width / 3, h: height },
    ]
  },
  LAYOUT_3_VERTICAL: {
    id: 'layout-3-v', name: '3 Photos - Vertical', count: 3,
    positions: (width, height) => [
      { x: 0, y: 0, w: width, h: height / 3 },
      { x: 0, y: height / 3, w: width, h: height / 3 },
      { x: 0, y: (height / 3) * 2, w: width, h: height / 3 },
    ]
  },
  LAYOUT_4_GRID: {
    id: 'layout-4-grid', name: '4 Photos - Grid', count: 4,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 2, h: height / 2 },
      { x: width / 2, y: 0, w: width / 2, h: height / 2 },
      { x: 0, y: height / 2, w: width / 2, h: height / 2 },
      { x: width / 2, y: height / 2, w: width / 2, h: height / 2 },
    ]
  },
  LAYOUT_4_HORIZONTAL: {
    id: 'layout-4-h', name: '4 Photos - Horizontal', count: 4,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 4, h: height },
      { x: width / 4, y: 0, w: width / 4, h: height },
      { x: (width / 4) * 2, y: 0, w: width / 4, h: height },
      { x: (width / 4) * 3, y: 0, w: width / 4, h: height },
    ]
  },
  LAYOUT_4_VERTICAL: {
    id: 'layout-4-v', name: '4 Photos - Vertical', count: 4,
    positions: (width, height) => [
      { x: 0, y: 0, w: width, h: height / 4 },
      { x: 0, y: height / 4, w: width, h: height / 4 },
      { x: 0, y: (height / 4) * 2, w: width, h: height / 4 },
      { x: 0, y: (height / 4) * 3, w: width, h: height / 4 },
    ]
  },
  LAYOUT_6_GRID: {
    id: 'layout-6-grid', name: '6 Photos - Grid (2x3)', count: 6,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 2, h: height / 3 },
      { x: width / 2, y: 0, w: width / 2, h: height / 3 },
      { x: 0, y: height / 3, w: width / 2, h: height / 3 },
      { x: width / 2, y: height / 3, w: width / 2, h: height / 3 },
      { x: 0, y: (height / 3) * 2, w: width / 2, h: height / 3 },
      { x: width / 2, y: (height / 3) * 2, w: width / 2, h: height / 3 },
    ]
  },
  LAYOUT_6_HORIZONTAL: {
    id: 'layout-6-h', name: '6 Photos - Horizontal', count: 6,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 6, h: height },
      { x: width / 6, y: 0, w: width / 6, h: height },
      { x: (width / 6) * 2, y: 0, w: width / 6, h: height },
      { x: (width / 6) * 3, y: 0, w: width / 6, h: height },
      { x: (width / 6) * 4, y: 0, w: width / 6, h: height },
      { x: (width / 6) * 5, y: 0, w: width / 6, h: height },
    ]
  },
  LAYOUT_9_GRID: {
    id: 'layout-9-grid', name: '9 Photos - Grid (3x3)', count: 9,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 3, h: height / 3 },
      { x: width / 3, y: 0, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
      { x: 0, y: height / 3, w: width / 3, h: height / 3 },
      { x: width / 3, y: height / 3, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: height / 3, w: width / 3, h: height / 3 },
      { x: 0, y: (height / 3) * 2, w: width / 3, h: height / 3 },
      { x: width / 3, y: (height / 3) * 2, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: (height / 3) * 2, w: width / 3, h: height / 3 },
    ]
  },
  LAYOUT_12_GRID: {
    id: 'layout-12-grid', name: '12 Photos - Grid (3x4)', count: 12,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 3, h: height / 4 },
      { x: width / 3, y: 0, w: width / 3, h: height / 4 },
      { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 4 },
      { x: 0, y: height / 4, w: width / 3, h: height / 4 },
      { x: width / 3, y: height / 4, w: width / 3, h: height / 4 },
      { x: (width / 3) * 2, y: height / 4, w: width / 3, h: height / 4 },
      { x: 0, y: (height / 4) * 2, w: width / 3, h: height / 4 },
      { x: width / 3, y: (height / 4) * 2, w: width / 3, h: height / 4 },
      { x: (width / 3) * 2, y: (height / 4) * 2, w: width / 3, h: height / 4 },
      { x: 0, y: (height / 4) * 3, w: width / 3, h: height / 4 },
      { x: width / 3, y: (height / 4) * 3, w: width / 3, h: height / 4 },
      { x: (width / 3) * 2, y: (height / 4) * 3, w: width / 3, h: height / 4 },
    ]
  },
  LAYOUT_5_LEFT_EMPHASIS: {
    id: 'layout-5-left', name: '5 Photos - Left Emphasis', count: 5,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 2, h: height },
      { x: width / 2, y: 0, w: width / 4, h: height / 2 },
      { x: (width / 4) * 3, y: 0, w: width / 4, h: height / 2 },
      { x: width / 2, y: height / 2, w: width / 4, h: height / 2 },
      { x: (width / 4) * 3, y: height / 2, w: width / 4, h: height / 2 },
    ]
  },
  LAYOUT_6_CENTER_EMPHASIS: {
    id: 'layout-6-center', name: '6 Photos - Center Emphasis', count: 6,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 3, h: height / 3 },
      { x: width / 3, y: 0, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
      { x: 0, y: height / 3, w: width / 3, h: (height / 3) * 2 },
      { x: width / 3, y: height / 3, w: width / 3, h: (height / 3) * 2 },
      { x: (width / 3) * 2, y: height / 3, w: width / 3, h: (height / 3) * 2 },
    ]
  },
  LAYOUT_7_CENTER_LARGE: {
    id: 'layout-7-center-large', name: '7 Photos - Center Large', count: 7,
    positions: (width, height) => [
      { x: 0, y: 0, w: width / 3, h: height / 3 },
      { x: width / 3, y: 0, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3 },
      { x: 0, y: height / 3, w: width / 3, h: height / 3 },
      { x: width / 3, y: height / 3, w: width / 3, h: height / 3 },
      { x: (width / 3) * 2, y: height / 3, w: width / 3, h: height / 3 },
      { x: 0, y: (height / 3) * 2, w: width, h: height / 3 },
    ]
  },
  LAYOUT_4_FILMSTRIP: {
    id: 'layout-4-filmstrip', name: 'Top Image - Emphasis', count: 4,
    positions: (width, height) => [
      { x: 0, y: 0, w: width, h: height * 0.6 },
      { x: 0, y: height * 0.6, w: width / 3, h: height * 0.4 },
      { x: width / 3, y: height * 0.6, w: width / 3, h: height * 0.4 },
      { x: (width / 3) * 2, y: height * 0.6, w: width / 3, h: height * 0.4 },
    ]
  },
  LAYOUT_3_COLORFUL: {
    id: 'layout-3-colorful', name: '3 Photos - Polaroid Style', count: 3,
    positions: (width, height) => [
      { x: width * 0.05, y: height * 0.05, w: width * 0.4, h: height * 0.4 },
      { x: width * 0.3, y: height * 0.25, w: width * 0.4, h: height * 0.5 },
      { x: width * 0.55, y: height * 0.1, w: width * 0.4, h: height * 0.4 },
    ]
  },
};

const drawShapeClip = (ctx, pos) => {
  const { x, y, w, h } = pos;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
};

export default function GalleryEditor() {
  const router = useRouter();
  const [imagePositions, setImagePositions] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(GALLERY_LAYOUTS.LAYOUT_4_GRID);
  const [photos, setPhotos] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const [textLayers, setTextLayers] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  const handleImageDragStart = (index) => setSelectedImageIndex(index);

  const handleImageDragMove = (e, index) => {
    if (selectedImageIndex !== index) return;
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const positions = selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT);
    const pos = positions[index];
    const frameCenterX = pos.x + pos.w / 2;
    const frameCenterY = pos.y + pos.h / 2;
    setImagePositions((prev) => {
      const updated = [...prev];
      updated[index] = { offsetX: pointerPos.x - frameCenterX, offsetY: pointerPos.y - frameCenterY };
      return updated;
    });
  };

  const handleImageDragEnd = () => setSelectedImageIndex(null);

  const getCanvasConfig = () => {
    if (typeof window === "undefined") return { width: 600, height: 600 };
    const w = window.innerWidth;
    if (w < 640) return { width: 280, height: 280 };
    else if (w < 1024) return { width: 400, height: 400 };
    else return { width: 500, height: 500 };
  };

  const [canvasConfig, setCanvasConfig] = useState(getCanvasConfig);
  const [orientation, setOrientation] = useState("landscape");

  useEffect(() => {
    const handleResize = () => setCanvasConfig(getCanvasConfig());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseCanvasSize = canvasConfig.width;
  const CANVAS_WIDTH = orientation === "landscape" ? baseCanvasSize : Math.round(baseCanvasSize * 0.75);
  const CANVAS_HEIGHT = orientation === "landscape" ? Math.round(baseCanvasSize * 0.75) : baseCanvasSize;

  const toggleOrientation = () => setOrientation((prev) => (prev === "landscape" ? "portrait" : "landscape"));

  useEffect(() => {
    if (photos.length === 0) { setLoadedImages([]); return; }
    const loadImages = async () => {
      const promises = photos.map((photoSrc) => new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = photoSrc;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      }));
      const images = await Promise.all(promises);
      setLoadedImages(images.filter(img => img !== null));
    };
    loadImages();
  }, [photos]);

  const renderGallery = () => {
    if (loadedImages.length === 0) return null;
    const positions = selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT);
    return positions.map((pos, index) => {
      const img = loadedImages[index];
      if (!img) {
        return (
          <Group key={index}>
            <Rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill="#f3f4f6" stroke="#d1d5db" strokeWidth={1} />
            <Text x={pos.x} y={pos.y + pos.h / 2 - 10} width={pos.w} text={`Photo ${index + 1}`} fontSize={12} fill="#9ca3af" align="center" />
          </Group>
        );
      }
      const imgAspect = img.width / img.height;
      const frameAspect = pos.w / pos.h;
      const scale = imgAspect > frameAspect ? pos.h / img.height : pos.w / img.width;
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      const currentOffset = imagePositions[index] || { offsetX: 0, offsetY: 0 };
      const offsetX = pos.x + (pos.w - displayWidth) / 2 + currentOffset.offsetX;
      const offsetY = pos.y + (pos.h - displayHeight) / 2 + currentOffset.offsetY;
      return (
        <Group key={index}>
          <Group clipFunc={(ctx) => drawShapeClip(ctx, pos)}>
            <KonvaImage
              image={img} x={offsetX} y={offsetY} width={displayWidth} height={displayHeight}
              draggable={false}
              onMouseDown={() => handleImageDragStart(index)}
              onMouseMove={(e) => { if (selectedImageIndex === index) handleImageDragMove(e, index); }}
              onMouseUp={handleImageDragEnd} onMouseLeave={handleImageDragEnd}
              onTouchStart={() => handleImageDragStart(index)}
              onTouchMove={(e) => { if (selectedImageIndex === index) handleImageDragMove(e, index); }}
              onTouchEnd={handleImageDragEnd}
              shadowColor={selectedImageIndex === index ? "rgba(59, 130, 246, 0.5)" : "transparent"}
              shadowBlur={selectedImageIndex === index ? 10 : 0}
              shadowOpacity={selectedImageIndex === index ? 0.8 : 0}
              opacity={selectedImageIndex === index ? 0.8 : 1}
              listening={true}
            />
          </Group>
          <Rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} stroke={selectedImageIndex === index ? "#3b82f6" : "transparent"} strokeWidth={2} listening={false} />
        </Group>
      );
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    const maxPhotos = selectedLayout.count;
    if (filesArray.length > maxPhotos) alert(`This layout supports only ${maxPhotos} photos. First ${maxPhotos} photos will be used.`);
    const filesToProcess = filesArray.slice(0, maxPhotos);
    const processFiles = async () => {
      const results = [];
      for (const file of filesToProcess) {
        try {
          const result = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          results.push(result);
        } catch (error) { console.error('Error reading file:', error); }
      }
      setPhotos(results);
    };
    processFiles();
  };

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    if (photos.length > layout.count) setPhotos(photos.slice(0, layout.count));
  };

  const handleDownload = () => {
    if (!stageRef.current || loadedImages.length === 0) { alert('Please upload photos first!'); return; }
    setIsProcessing(true);
    stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/png' }).then((uri) => {
      const link = document.createElement("a");
      link.download = `mini-gallery-${selectedLayout.name.toLowerCase().replace(/\s/g, '-')}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsProcessing(false);
    }).catch((error) => { console.error('Download failed:', error); alert('Download failed. Please try again.'); setIsProcessing(false); });
  };

  const handleSaveAndNext = async () => {
    if (!stageRef.current || loadedImages.length === 0) { alert('Please upload all required photos first!'); return; }
    if (loadedImages.length < selectedLayout.count) { alert(`This layout requires ${selectedLayout.count} photos. You have only ${loadedImages.length}.`); return; }
    setIsProcessing(true);
    try {
      const stageElement = stageRef.current.container();
      const previewImage = await domToPng(stageElement, { quality: 1, scale: 3, backgroundColor: '#ffffff', captureCanvas: false });
      const designData = {
        productType: 'mini-photo-gallery', imageUris: photos, previewImage,
        layoutName: selectedLayout.name, layoutId: selectedLayout.id,
        layoutPositions: selectedLayout.positions(CANVAS_WIDTH, CANVAS_HEIGHT),
        photoCount: selectedLayout.count, canvasDimensions: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
        orientation, textLayers, timestamp: new Date().toISOString(), isGallery: true
      };
      window.frameDesignData = designData;
      router.push('/p');
    } catch (error) { console.error('❌ Error capturing gallery design:', error); alert('Failed to save gallery design. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) { fileInputRef.current.value = ''; fileInputRef.current.click(); }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 px-3 sm:px-5 lg:px-8 pt-3 pb-6">
      <Sidebar />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-1 text-center font-['Great_Vibes'] italic">
            <span className="text-black">Mini Photo</span>{" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">Gallery Editor</span>
          </h1>
          <p className="text-xs text-gray-500">Create stunning photo collages with tight, seamless layouts</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* LEFT: Preview */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-200">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </h2>
                <span className="text-xs text-gray-400">Drag to adjust images</span>
              </div>

              <div className="flex justify-center">
                <div className="inline-block bg-gray-100 p-1.5 rounded-lg">
                  <Stage ref={stageRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                    <Layer>
                      <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />
                      {renderGallery()}
                      {textLayers.map((layer) => (
                        <Text
                          key={layer.id} x={layer.x} y={layer.y} text={layer.text}
                          fontSize={layer.fontSize} fontFamily={layer.fontFamily} fill={layer.fill}
                          draggable
                          onDragEnd={(e) => { const node = e.target; setTextLayers((prev) => prev.map((t) => t.id === layer.id ? { ...t, x: node.x(), y: node.y() } : t)); }}
                          onClick={() => setSelectedTextId(layer.id)}
                          onTap={() => setSelectedTextId(layer.id)}
                          shadowColor={selectedTextId === layer.id ? "rgba(0,0,0,0.35)" : "transparent"}
                          shadowBlur={selectedTextId === layer.id ? 6 : 0}
                        />
                      ))}
                      {loadedImages.length === 0 && (
                        <>
                          <Rect x={CANVAS_WIDTH / 2 - 100} y={CANVAS_HEIGHT / 2 - 40} width={200} height={80} fill="#dc2626" />
                          <Text x={CANVAS_WIDTH / 2 - 100} y={CANVAS_HEIGHT / 2 - 15} width={200} text={`UPLOAD ${selectedLayout.count} PHOTOS`} fontSize={16} fontStyle="bold" fill="#ffffff" align="center" />
                          <Text x={CANVAS_WIDTH / 2 - 100} y={CANVAS_HEIGHT / 2 + 10} width={200} text="Select layout & upload →" fontSize={11} fill="#ffffff" align="center" />
                        </>
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 space-y-3 border border-gray-200">

              {/* Orientation */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Orientation</label>
                <button type="button" onClick={toggleOrientation} className="w-full cursor-pointer border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-3 rounded-lg text-sm transition-colors">
                  Switch to {CANVAS_WIDTH >= CANVAS_HEIGHT ? "Vertical" : "Horizontal"}
                </button>
              </div>

              {/* Layout Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                  Select Layout
                </label>
                <select
                  value={selectedLayout.id}
                  onChange={(e) => { const layout = Object.values(GALLERY_LAYOUTS).find(l => l.id === e.target.value); handleLayoutChange(layout); }}
                  className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white hover:border-purple-300 transition-colors"
                >
                  {Object.values(GALLERY_LAYOUTS).map((layout) => (
                    <option key={layout.id} value={layout.id}>{layout.name}</option>
                  ))}
                </select>
                <div className="mt-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-800">📌 Needs <strong>{selectedLayout.count} photos</strong></p>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Photos
                </label>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" key={selectedLayout.id} />
                <button
                  onClick={handleButtonClick} disabled={isProcessing}
                  className="w-full bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {photos.length > 0 ? `Change Photos (${photos.length}/${selectedLayout.count})` : `Select ${selectedLayout.count} Photos`}
                </button>

                {/* Instructions */}
                <div className="mt-2 p-2.5 bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900 font-semibold mb-1">💡 Select multiple photos:</p>
                  <div className="text-xs text-blue-800 space-y-0.5">
                    <p>• Hold <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Ctrl</kbd> (Win) or <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Cmd</kbd> (Mac) and click</p>
                    <p>• Or use <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Shift</kbd> to select a range</p>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-2">
                  {photos.length > 0 ? (
                    <div className="text-xs text-green-700 font-medium text-center p-2 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      ✓ {photos.length} of {selectedLayout.count} photo(s) selected
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                      📸 Click above to select {selectedLayout.count} photos
                    </div>
                  )}
                  {photos.length > 0 && photos.length < selectedLayout.count && (
                    <div className="mt-1 text-xs text-orange-700 text-center p-2 bg-linear-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                      ⚠️ Need {selectedLayout.count - photos.length} more photo(s)
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-1.5">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded overflow-hidden border-2 border-green-400 shadow-sm">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-0.5 left-0.5 bg-green-600 text-white text-xs font-bold px-1 rounded leading-tight">{index + 1}</div>
                      </div>
                    ))}
                    {Array.from({ length: selectedLayout.count - photos.length }).map((_, index) => (
                      <div key={`empty-${index}`} className="relative aspect-square rounded overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">+</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Text */}
              <div className="pt-2.5 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Custom Text</span>
                  <button
                    type="button"
                    onClick={() => {
                      const id = Date.now();
                      setTextLayers((prev) => [...prev, { id, text: "Your text here", x: CANVAS_WIDTH / 2 - 60, y: CANVAS_HEIGHT / 2, fontSize: 22, fill: "#111827", fontFamily: "Poppins, sans-serif" }]);
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
                      onChange={(e) => setSelectedTextId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full border border-gray-300 text-gray-900 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select text layer</option>
                      {textLayers.map((t, idx) => (
                        <option key={t.id} value={t.id}>Text {idx + 1}: {t.text.slice(0, 20) || "(empty)"}</option>
                      ))}
                    </select>

                    {selectedTextId && (() => {
                      const layer = textLayers.find((t) => t.id === selectedTextId) || textLayers[0];
                      if (!layer) return null;
                      return (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">Text</label>
                            <input
                              type="text" value={layer.text} placeholder="Enter custom text"
                              onChange={(e) => { const v = e.target.value; setTextLayers((p) => p.map((t) => t.id === layer.id ? { ...t, text: v } : t)); }}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-0.5">Font Size</label>
                              <input
                                type="number" min={10} max={120} value={layer.fontSize}
                                onChange={(e) => { const v = Number(e.target.value) || 10; setTextLayers((p) => p.map((t) => t.id === layer.id ? { ...t, fontSize: v } : t)); }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-0.5">Color</label>
                              <input
                                type="color" value={layer.fill}
                                onChange={(e) => { const v = e.target.value; setTextLayers((p) => p.map((t) => t.id === layer.id ? { ...t, fill: v } : t)); }}
                                className="w-9 h-9 border border-gray-300 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">Font Family</label>
                            <select
                              value={layer.fontFamily}
                              onChange={(e) => { const v = e.target.value; setTextLayers((p) => p.map((t) => t.id === layer.id ? { ...t, fontFamily: v } : t)); }}
                              className="w-full border border-gray-300 text-gray-900 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="Poppins, sans-serif">Poppins</option>
                              <option value="Arial, sans-serif">Arial</option>
                              <option value="'Times New Roman', serif">Times New Roman</option>
                              <option value="'Courier New', monospace">Courier</option>
                              <option value="'Pacifico', cursive">Script</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setTextLayers((p) => p.filter((t) => t.id !== layer.id)); setSelectedTextId((pid) => pid === layer.id ? null : pid); }}
                            className="w-full text-xs text-red-600 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 font-medium cursor-pointer transition-colors"
                          >
                            Delete This Text
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleDownload} disabled={loadedImages.length === 0 || isProcessing}
                  className={"w-full font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 " + (loadedImages.length > 0 && !isProcessing ? "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm hover:shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed")}
                >
                  {isProcessing ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Preparing...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Download to Device</>
                  )}
                </button>

                <button
                  onClick={handleSaveAndNext}
                  disabled={loadedImages.length === 0 || loadedImages.length < selectedLayout.count || isProcessing}
                  className={"w-full font-bold py-3 px-4 rounded-lg text-base transition-all duration-300 transform " + (loadedImages.length > 0 && loadedImages.length === selectedLayout.count && !isProcessing ? "bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" : "bg-gray-200 text-gray-400 cursor-not-allowed")}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving to Cart...
                    </span>
                  ) : loadedImages.length === 0 ? "Upload Photos First"
                    : loadedImages.length < selectedLayout.count ? `Need ${selectedLayout.count - loadedImages.length} More Photo(s)`
                    : "Save & Select Size →"}
                </button>

                {loadedImages.length > 0 && loadedImages.length === selectedLayout.count && !isProcessing && (
                  <p className="text-xs text-green-600 text-center font-medium">✓ Gallery ready! Click to add to cart & select size</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


