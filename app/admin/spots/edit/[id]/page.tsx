"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function EditSpotPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State untuk form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    facilities: "",
    operationalHours: "08:00 - 22:00",
    spotType: "indoor",
    atmosphere: "quiet",
    visitType: "alone",
    mood: "focused",
    crowdedness: "low",
  });

  // 1. Tarik Data Spot yang mau diedit
  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        // Asumsi rute backend untuk ambil detail berdasarkan ID/Slug
        const res = await fetch(`${apiUrl}/spots/${id}`);
        const json = await res.json();
        
        const data = json.data || json;

        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
            facilities: data.facilities || "",
            operationalHours: data.operationalHours || "08:00 - 22:00",
            spotType: data.spotType || "indoor",
            atmosphere: data.atmosphere || "quiet",
            visitType: data.visitType || "alone",
            mood: data.mood || "focused",
            crowdedness: data.crowdedness || "low",
          });
          
          if (data.photoUrl) {
            setPreviewImage(data.photoUrl);
          }
        }
      } catch (error) {
        console.error("Gagal menarik data:", error);
        alert("Gagal memuat data tempat.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpotData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // 2. Submit Perubahan (Method PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("address", formData.address);
      submitData.append("facilities", formData.facilities);
      submitData.append("operationalHours", formData.operationalHours);
      submitData.append("spotType", formData.spotType);
      submitData.append("atmosphere", formData.atmosphere);
      submitData.append("visitType", formData.visitType);
      submitData.append("mood", formData.mood);
      submitData.append("crowdedness", formData.crowdedness);
      submitData.append("category", formData.spotType); 

      // Hanya kirim file jika Admin memilih foto baru
      if (selectedFile) {
        submitData.append("photoUrl", selectedFile);
      }

      // Gunakan method PUT untuk update data
      const res = await fetch(`${apiUrl}/admins/spots/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (res.ok) {
        alert("Spot berhasil diperbarui!");
        router.push("/admin/dashboard");
      } else {
        const json = await res.json();
        alert(`Gagal: ${json.message}`);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Terjadi kesalahan pada server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF2F3] text-[#2f4b2f] font-bold">
        Memuat data form...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF2F3] font-['DM_Sans'] pb-20">
      <div className="bg-yellow-400 px-6 py-4 flex items-center gap-4 text-[#2f4b2f] rounded-b-[32px] shadow-md sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/40 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Edit Spot</h1>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col gap-6 border border-gray-100">
          
          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Foto Tempat</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-[#2f4b2f] transition-colors relative overflow-hidden bg-gray-50"
            >
              {previewImage ? (
                <Image src={previewImage} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={40} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium">Klik untuk ganti foto baru</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Informasi Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Nama Tempat *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#f5f5f5] px-4 py-3 rounded-xl outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Jam Operasional</label>
              <input type="text" name="operationalHours" value={formData.operationalHours} onChange={handleChange} className="w-full bg-[#f5f5f5] px-4 py-3 rounded-xl outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Alamat Lengkap</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="w-full bg-[#f5f5f5] px-4 py-3 rounded-xl outline-none text-sm resize-none h-20" />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Deskripsi</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#f5f5f5] px-4 py-3 rounded-xl outline-none text-sm resize-none h-24" />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2f4b2f] mb-2">Fasilitas Tambahan</label>
            <input type="text" name="facilities" value={formData.facilities} onChange={handleChange} className="w-full bg-[#f5f5f5] px-4 py-3 rounded-xl outline-none text-sm" />
          </div>

          <div className="border-t border-gray-100 pt-6 mt-2">
            <h3 className="text-sm font-bold text-[#2f4b2f] mb-4">Kategorisasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Spot Type</label>
                <select name="spotType" value={formData.spotType} onChange={handleChange} className="bg-[#f5f5f5] px-3 py-2 rounded-lg text-sm outline-none">
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Atmosphere</label>
                <select name="atmosphere" value={formData.atmosphere} onChange={handleChange} className="bg-[#f5f5f5] px-3 py-2 rounded-lg text-sm outline-none">
                  <option value="quiet">Quiet</option>
                  <option value="busy">Busy</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Visit Type</label>
                <select name="visitType" value={formData.visitType} onChange={handleChange} className="bg-[#f5f5f5] px-3 py-2 rounded-lg text-sm outline-none">
                  <option value="alone">Alone</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Mood</label>
                <select name="mood" value={formData.mood} onChange={handleChange} className="bg-[#f5f5f5] px-3 py-2 rounded-lg text-sm outline-none">
                  <option value="focused">Focused</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">Crowdedness</label>
                <select name="crowdedness" value={formData.crowdedness} onChange={handleChange} className="bg-[#f5f5f5] px-3 py-2 rounded-lg text-sm outline-none">
                  <option value="low">Low</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !formData.name}
            className="mt-6 flex justify-center items-center gap-2 bg-yellow-400 text-[#2f4b2f] font-bold py-4 rounded-xl hover:bg-yellow-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Menyimpan Perubahan..." : (
              <>
                <Save size={18} /> Update Spot
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}