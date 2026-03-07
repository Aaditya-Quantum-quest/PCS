'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PackagePlus, Trash2, Edit3, Image, Tag, DollarSign, FileText, X, Upload, XCircle } from 'lucide-react';

export default function ProductsAdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [filterCategory, setFilterCategory] = useState('All');

  // Per-product size options (label + price)
  const [sizesList, setSizesList] = useState([{ label: '', price: '' }]);

  // New states for image uploads
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadType, setUploadType] = useState('url');

  // States for dynamic customization options
  const [colors, setColors] = useState(['']);
  const [frameMaterials, setFrameMaterials] = useState(['']);
  const [thicknessOptions, setThicknessOptions] = useState(['']);
  const [orientationOptions, setOrientationOptions] = useState(['portrait', 'landscape', 'square']);

  // protect route: only admin (cookie-based)
  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        const isAdmin = !!data.user?.isAdmin;

        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdmin', String(isAdmin));
        }

        if (!isAdmin) {
          router.replace('/');
          return;
        }

        if (!cancelled) {
          setChecking(false);
        }
      } catch (err) {
        console.error('Products admin check failed:', err);
        router.replace('/login');
      }
    };

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // load products
  useEffect(() => {
    if (checking) return;

    axios
      .get('http://localhost:4000/api/admin/products', {
        withCredentials: true,
      })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load products';
        setErrorMsg(msg);
      });
  }, [checking]);

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setErrorMsg('You can only upload up to 4 images');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setErrorMsg('Only JPG, JPEG, PNG, and WEBP images are allowed');
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrorMsg('Each image must be less than 5MB');
      return;
    }

    setSelectedImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
    setErrorMsg('');
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviewUrls[index]);

    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviews);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validate required fields
    if (!title.trim()) {
      setErrorMsg('Please enter a product title');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please enter a slug');
      return;
    }
    if (!category) {
      setErrorMsg('Please select a category');
      return;
    }
    if (uploadType === 'upload' && selectedImages.length === 0) {
      setErrorMsg('Please select at least one image');
      return;
    }
    if (uploadType === 'url' && !imageUrl.trim()) {
      setErrorMsg('Please provide an image URL');
      return;
    }

    // At least one valid size when creating/updating
    const cleanedSizes = sizesList
      .filter((s) => s.label.trim() && s.price !== '')
      .map((s) => ({ label: s.label.trim(), price: Number(s.price) }));

    if (cleanedSizes.length === 0) {
      setErrorMsg('Please add at least one size with price');
      return;
    }

    try {
      // Use the first size's price as base product price (for listings, etc.)
      const basePrice = cleanedSizes[0]?.price ?? 0;

      let productData = {
        title: title.trim(),
        slug: slug.trim(),
        price: basePrice,
        category: category,
        description: description.trim(),
        sizes: cleanedSizes,
        // Add customization options
        colors: colors.filter(c => c.trim() !== ''),
        frameMaterials: frameMaterials.filter(m => m.trim() !== ''),
        thicknessOptions: thicknessOptions.filter(t => t !== '' && !isNaN(t)).map(t => Number(t)),
        orientationOptions: orientationOptions.filter(o => o.trim() !== ''),
      };

      console.log('Product data before upload:', productData);

      // Handle image upload vs URL
      if (uploadType === 'upload' && selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((image) => {
          formData.append('images', image);
        });

        console.log('Uploading images...');

        const uploadRes = await axios.post(
          'http://localhost:4000/api/admin/upload-images',
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Upload response:', uploadRes.data);

        productData.imageUrl = uploadRes.data.imageUrls[0];
        productData.additionalImages = uploadRes.data.imageUrls;
      } else if (uploadType === 'url' && imageUrl.trim()) {
        // Handle multiple URLs separated by commas
        const urls = imageUrl
          .split(',')
          .map(url => {
            url = url.trim();
            // If it's base64 without data URI prefix, add it
            if (!url.startsWith('http') && !url.startsWith('data:')) {
              return `data:image/jpeg;base64,${url}`;
            }
            return url;
          })
          .filter(url => url.length > 0)
          .slice(0, 4); // Limit to 4 images

        if (urls.length === 0) {
          setErrorMsg('Please provide at least one valid image URL');
          return;
        }

        productData.imageUrl = urls[0]; // First URL as main image
        productData.additionalImages = urls; // All URLs in additional images
      }

      console.log('Final product data:', productData);

      const endpoint = editingId
        ? `http://localhost:4000/api/admin/products/${editingId}`
        : 'http://localhost:4000/api/admin/products';

      const method = editingId ? axios.put : axios.post;

      const res = await method(endpoint, productData, {
        withCredentials: true,
      });

      console.log('Server response:', res.data);

      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? res.data.product : p))
        );
        setEditingId(null);
        setSuccessMsg('Product updated successfully!');
      } else {
        setProducts((prev) => [res.data.product, ...prev]);
        setSuccessMsg('Product added successfully!');
      }

      // Reset form
      setTitle('');
      setSlug('');
      setPrice('');
      setImageUrl('');
      setCategory('');
      setDescription('');
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setUploadType('url');
      // Reset customization options
      setColors(['']);
      setFrameMaterials(['']);
      setThicknessOptions(['']);
      setOrientationOptions(['portrait', 'landscape', 'square']);
      setSizesList([{ label: '', price: '' }]);

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving product:', err);
      console.error('Error response:', err.response);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to save product';
      setErrorMsg(msg);
    }
  };

  const handleEdit = (product) => {
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setCategory(product.category || '');
    setDescription(product.description);
    setSizesList(
      product.sizes && product.sizes.length
        ? product.sizes.map((s) => ({
          label: s.label || '',
          price: s.price != null ? String(s.price) : '',
        }))
        : [{ label: '', price: '' }]
    );
    // Set customization options
    setColors(product.colors && product.colors.length > 0 ? product.colors : ['']);
    setFrameMaterials(product.frameMaterials && product.frameMaterials.length > 0 ? product.frameMaterials : ['']);
    setThicknessOptions(product.thicknessOptions && product.thicknessOptions.length > 0 ? product.thicknessOptions.map(t => String(t)) : ['']);
    setOrientationOptions(product.orientationOptions && product.orientationOptions.length > 0 ? product.orientationOptions : ['portrait', 'landscape', 'square']);
    
    setEditingId(product._id);
    setUploadType('url');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setErrorMsg('');
    setSuccessMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/admin/products/${id}`,
        {
          withCredentials: true,
        }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setTitle(''); setSlug(''); setPrice(''); setImageUrl('');
        setCategory(''); setDescription('');
        setSelectedImages([]);
        setImagePreviewUrls([]);
        // Reset customization options
        setColors(['']);
        setFrameMaterials(['']);
        setThicknessOptions(['']);
        setOrientationOptions(['portrait', 'landscape', 'square']);
        setSizesList([{ label: '', price: '' }]);
      }
      setSuccessMsg('Product deleted successfully!');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to delete product';
      setErrorMsg(msg);
    }
  };


  const filteredProducts = filterCategory === 'All'
    ? products
    : products.filter(p => p.category === filterCategory);

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-200 mt-4 font-medium">Checking permissions...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Product Management
          </h1>
          <p className="text-purple-300">Manage your frame inventory and pricing</p>
        </div>

        {/* Add/Edit Product Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              {editingId ? (
                <>
                  <Edit3 className="w-7 h-7 text-amber-400" />
                  Edit Product
                </>
              ) : (
                <>
                  <PackagePlus className="w-7 h-7 text-emerald-400" />
                  Add New Product
                </>
              )}
            </h2>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle(''); setSlug(''); setPrice(''); setImageUrl('');
                  setCategory(''); setDescription('');
                  setSelectedImages([]);
                  setImagePreviewUrls([]);
                  // Reset customization options
                  setColors(['']);
                  setFrameMaterials(['']);
                  setThicknessOptions(['']);
                  setOrientationOptions(['portrait', 'landscape', 'square']);
                  setSizesList([{ label: '', price: '' }]);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="group">
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Golden Frame 24x36"
                  required
                />
              </div>

              {/* Slug */}
              <div className="group">
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="golden-frame-24x36"
                  required
                />
              </div>

              {/* Category - FIXED */}
              <div className="group">
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="" className="bg-slate-900">-- Select a category --</option>
                  <option value="Acrylic Photo" className="bg-slate-900">Acrylic Photo</option>
                  <option value="Framed Acrylic Photo" className="bg-slate-900">Framed Acrylic Photo</option>
                  <option value="Acrylic Cutout" className="bg-slate-900">Acrylic Cutout</option>
                  {/* <option value="Aluminium Framed Acrylic Photo" className="bg-slate-900">Aluminium Framed Acrylic Photo</option> */}
                  {/* <option value="Miniphoto Gallery" className="bg-slate-900">Miniphoto Gallery</option> */}
                  <option value="Clear Acrylic Photo" className="bg-slate-900">Clear Acrylic Photo</option>
                  <option value="Collage Acrylic Photo" className="bg-slate-900">Collage Acrylic Photo</option>
                  {/* <option value="Acrylic Desk Photo" className="bg-slate-900">Acrylic Desk Photo</option> */}
                  {/* <option value="Acrylic Nameplate" className="bg-slate-900">Acrylic Nameplate</option> */}
                  <option value="Acrylic Wall Clock" className="bg-slate-900">Acrylic Wall Clock</option>
                  {/* <option value="Acrylic Fridge Magnets" className="bg-slate-900">Acrylic Fridge Magnets</option> */}
                  {/* <option value="Acrylic KeyChains" className="bg-slate-900">Acrylic KeyChains</option> */}
                  {/* <option value="Acrylic Monogram" className="bg-slate-900">Acrylic Monogram</option> */}
                </select>
              </div>

              {/* Sizes & Prices */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Size Options (label & price) *
                </label>
                <p className="text-xs text-purple-400 mb-3">
                  Add one or more sizes (e.g. 5x7, 8x10) with their prices. These will appear on the buy page.
                </p>
                <div className="space-y-2">
                  {sizesList.map((s, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Size (e.g. 5x7)"
                        value={s.label}
                        onChange={(e) => {
                          const next = [...sizesList];
                          next[index] = { ...next[index], label: e.target.value };
                          setSizesList(next);
                        }}
                        className="col-span-5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Price (₹)"
                        value={s.price}
                        onChange={(e) => {
                          const next = [...sizesList];
                          next[index] = { ...next[index], price: e.target.value };
                          setSizesList(next);
                        }}
                        className="col-span-5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <div className="col-span-2 flex justify-end">
                        {sizesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setSizesList(sizesList.filter((_, i) => i !== index))
                            }
                            className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSizesList([...sizesList, { label: '', price: '' }])
                  }
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-purple-200 border border-white/10 transition-all"
                >
                  <PackagePlus className="w-4 h-4" />
                  Add Another Size
                </button>
              </div>

              {/* Image Upload Type Selector */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Product Images *
                </label>

                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType('url');
                      setSelectedImages([]);
                      setImagePreviewUrls([]);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${uploadType === 'url'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                      }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType('upload');
                      setImageUrl('');
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg transition-all ${uploadType === 'upload'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                      }`}
                  >
                    Upload Images
                  </button>
                </div>

                {uploadType === 'url' && (
                  <>
                    <div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        required={uploadType === 'url'}
                      />
                      <p className="text-xs text-purple-400/70 mt-2">
                        Enter multiple image URLs or base64 data separated by commas (up to 4 images)
                      </p>
                    </div>

                    {imageUrl && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageUrl
                          .split(',')
                          .map(url => url.trim())
                          .filter(url => url.length > 0)
                          .slice(0, 4)
                          .map((url, index) => {
                            // Check if it's base64 data without data URI prefix
                            const isBase64WithoutPrefix = !url.startsWith('http') && !url.startsWith('data:');
                            const imageSrc = isBase64WithoutPrefix
                              ? `data:image/jpeg;base64,${url}`
                              : url;

                            return (
                              <div key={index} className="relative">
                                <img
                                  src={imageSrc}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-xl border border-white/20 shadow-lg"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-size="12"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  Image {index + 1}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </>
                )}
                {uploadType === 'upload' && (
                  <>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <Upload className="w-12 h-12 text-purple-400 mb-3" />
                        <p className="text-purple-300 font-medium mb-1">
                          Click to upload images
                        </p>
                        <p className="text-purple-400/70 text-sm">
                          Upload up to 4 images (JPG, PNG, WEBP - Max 5MB each)
                        </p>
                      </label>
                    </div>

                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl border border-white/20 shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Dynamic Customization Options */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-300 mb-3">
                  Customization Options
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colors */}
                  <div>
                    <label className="block text-xs font-medium text-purple-400 mb-2">
                      Available Colors
                    </label>
                    <div className="space-y-2">
                      {colors.map((color, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g., Natural Oak, Walnut Brown"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...colors];
                              newColors[index] = e.target.value;
                              setColors(newColors);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                          {colors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setColors(colors.filter((_, i) => i !== index))}
                              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setColors([...colors, ''])}
                        className="text-xs text-purple-300 hover:text-white transition-all"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>

                  {/* Frame Materials */}
                  <div>
                    <label className="block text-xs font-medium text-purple-400 mb-2">
                      Frame Materials
                    </label>
                    <div className="space-y-2">
                      {frameMaterials.map((material, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g., Wood, Metal, Acrylic"
                            value={material}
                            onChange={(e) => {
                              const newMaterials = [...frameMaterials];
                              newMaterials[index] = e.target.value;
                              setFrameMaterials(newMaterials);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                          {frameMaterials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFrameMaterials(frameMaterials.filter((_, i) => i !== index))}
                              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFrameMaterials([...frameMaterials, ''])}
                        className="text-xs text-purple-300 hover:text-white transition-all"
                      >
                        + Add Material
                      </button>
                    </div>
                  </div>

                  {/* Thickness Options */}
                  <div>
                    <label className="block text-xs font-medium text-purple-400 mb-2">
                      Frame Thickness (mm)
                    </label>
                    <div className="space-y-2">
                      {thicknessOptions.map((thickness, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="number"
                            placeholder="e.g., 10, 15, 20"
                            value={thickness}
                            onChange={(e) => {
                              const newThickness = [...thicknessOptions];
                              newThickness[index] = e.target.value;
                              setThicknessOptions(newThickness);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />
                          {thicknessOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setThicknessOptions(thicknessOptions.filter((_, i) => i !== index))}
                              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setThicknessOptions([...thicknessOptions, ''])}
                        className="text-xs text-purple-300 hover:text-white transition-all"
                      >
                        + Add Thickness
                      </button>
                    </div>
                  </div>

                  {/* Orientation Options */}
                  <div>
                    <label className="block text-xs font-medium text-purple-400 mb-2">
                      Orientation Options
                    </label>
                    <div className="space-y-2">
                      {orientationOptions.map((orientation, index) => (
                        <div key={index} className="flex gap-2">
                          <select
                            value={orientation}
                            onChange={(e) => {
                              const newOrientations = [...orientationOptions];
                              newOrientations[index] = e.target.value;
                              setOrientationOptions(newOrientations);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="square">Square</option>
                          </select>
                          {orientationOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setOrientationOptions(orientationOptions.filter((_, i) => i !== index))}
                              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setOrientationOptions([...orientationOptions, 'portrait'])}
                        className="text-xs text-purple-300 hover:text-white transition-all"
                      >
                        + Add Orientation
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-vertical"
                  placeholder="Premium quality golden wooden frame..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-[1.02]"
                >
                  {editingId ? (
                    <>
                      <Edit3 className="w-5 h-5" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <PackagePlus className="w-5 h-5" />
                      Add Product
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle(''); setSlug(''); setPrice(''); setImageUrl('');
                      setCategory(''); setDescription('');
                      setSelectedImages([]);
                      setImagePreviewUrls([]);
                      // Reset customization options
                      setColors(['']);
                      setFrameMaterials(['']);
                      setThicknessOptions(['']);
                      setOrientationOptions(['portrait', 'landscape', 'square']);
                      setSizesList([{ label: '', price: '' }]);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-purple-300 font-medium rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-8 py-8 border-b border-white/10">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <PackagePlus className="w-6 h-6 text-purple-400" />
            Filter By Category
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
              {filteredProducts.length}
            </span>
          </h2>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all ${filterCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <PackagePlus className="w-6 h-6 text-purple-400" />
              All Products
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                {products.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-purple-300">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 hidden md:table-cell">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="relative">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-xl border border-white/20 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs text-purple-300/70">
                            No image
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-lg">
                        {product.title}
                      </div>
                      <div className="text-sm text-purple-400 mt-1">
                        {product.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xl font-bold text-emerald-400">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {product.category ? (
                        <span className="px-3 py-1.5 bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                          {product.category}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs font-medium rounded-full border border-red-500/30">
                          No Category
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all hover:scale-110 border border-transparent hover:border-amber-500/30"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 border border-transparent hover:border-red-500/30"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <PackagePlus className="w-20 h-20 text-purple-400/50 mx-auto mb-4" />
              <p className="text-xl text-purple-300 mb-2">
                {filterCategory === 'All' ? 'No products found' : `No products in ${filterCategory}`}
              </p>
              <p className="text-sm text-purple-400">
                {filterCategory === 'All'
                  ? 'Add your first frame to get started!'
                  : 'Try selecting a different category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}