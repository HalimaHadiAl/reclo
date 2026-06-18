import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, Upload, X, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VirtualTryOn({ kebaya }) {
  const [mode, setMode] = useState(null); // null | "camera" | "upload"
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  useEffect(() => {
    if (mode === "camera") {
      setCameraError(null);
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setCameraError("Kamera tidak dapat diakses. Pastikan izin kamera diaktifkan."));
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mode]);

  const stopCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
  };

  const handleClose = () => {
    stopCamera();
    setMode(null);
    setCapturedPhoto(null);
    setUploadedPhoto(null);
    setResultUrl(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const generateTryOn = async () => {
    const photoSrc = capturedPhoto || uploadedPhoto;
    if (!photoSrc) return;
    setGenerating(true);
    setResultUrl(null);

    // Convert dataURL or use directly
    let photoUrl = photoSrc;
    if (photoSrc.startsWith("data:")) {
      const blob = await (await fetch(photoSrc)).blob();
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      const res = await base44.integrations.Core.UploadFile({ file });
      photoUrl = res.file_url;
    }

    const kebayaImage = kebaya.main_image;
    const prompt = `You are a fashion AI assistant. The user is trying on a "${kebaya.name}" kebaya which is ${kebaya.color || "elegant"} colored made of ${kebaya.fabric || "premium fabric"}. 
    
    Create a realistic fashion try-on image: take the person from the first photo and show them wearing this beautiful Indonesian kebaya dress. The kebaya should be naturally fitted on their body, maintaining the person's face and pose. Make it look like a professional fashion photo. Keep the background simple and elegant. The kebaya style is: ${kebaya.description || "traditional Indonesian kebaya"}.`;

    const result = await base44.integrations.Core.GenerateImage({
      prompt,
      existing_image_urls: kebayaImage ? [photoUrl, kebayaImage] : [photoUrl],
    });

    setResultUrl(result.url);
    setGenerating(false);
  };

  const reset = () => {
    setCapturedPhoto(null);
    setUploadedPhoto(null);
    setResultUrl(null);
    if (mode === "camera") {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
  };

  const currentPhoto = capturedPhoto || uploadedPhoto;

  return (
    <div className="mt-8">
      {!mode ? (
        <div className="border border-border p-6 bg-secondary/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary" />
            <h4 className="font-display text-lg font-medium tracking-wider text-foreground">
              Virtual Try-On AI
            </h4>
          </div>
          <p className="font-body text-xs text-muted-foreground mb-5">
            Coba kebaya ini secara virtual — gunakan kamera atau upload foto Anda
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setMode("camera")}
              className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary py-3 font-body text-xs font-semibold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Camera size={14} />
              Kamera Langsung
            </button>
            <label className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground py-3 font-body text-xs font-semibold tracking-widest uppercase hover:border-primary hover:text-primary transition-colors cursor-pointer">
              <Upload size={14} />
              Upload Foto
              <input type="file" accept="image/*" onChange={(e) => { handleUpload(e); setMode("upload"); }} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="border border-border bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <span className="font-display text-base font-medium tracking-wider text-foreground">
                  Virtual Try-On — {kebaya.name}
                </span>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {/* Camera view */}
              {mode === "camera" && !currentPhoto && (
                <div className="relative">
                  {cameraError ? (
                    <div className="bg-secondary/20 aspect-[3/4] flex items-center justify-center">
                      <p className="font-body text-sm text-muted-foreground text-center px-6">{cameraError}</p>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full aspect-[3/4] object-cover bg-black"
                        style={{ transform: "scaleX(-1)" }}
                      />
                      {/* Overlay guide */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="border-2 border-primary/60 rounded-full w-32 h-44 opacity-50" />
                      </div>
                      <p className="absolute bottom-4 left-0 right-0 text-center font-body text-xs text-white bg-black/40 py-2">
                        Posisikan tubuh Anda dalam bingkai
                      </p>
                    </>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  {!cameraError && (
                    <button
                      onClick={capturePhoto}
                      className="mt-4 w-full bg-primary text-primary-foreground py-3 font-body text-xs font-semibold tracking-widest uppercase hover:opacity-90"
                    >
                      <Camera size={14} className="inline mr-2" />
                      Ambil Foto
                    </button>
                  )}
                </div>
              )}

              {/* Photo captured / uploaded — ready to generate */}
              {currentPhoto && !resultUrl && !generating && (
                <div>
                  <img
                    src={currentPhoto}
                    alt="Your photo"
                    className="w-full aspect-[3/4] object-cover"
                    style={capturedPhoto ? { transform: "scaleX(-1)" } : {}}
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={reset}
                      className="flex-1 border border-border py-3 font-body text-xs font-semibold tracking-widest uppercase text-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={13} /> Ulangi
                    </button>
                    <button
                      onClick={generateTryOn}
                      className="flex-1 bg-primary text-primary-foreground py-3 font-body text-xs font-semibold tracking-widest uppercase hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={13} /> Coba Kebaya
                    </button>
                  </div>
                </div>
              )}

              {/* Generating */}
              {generating && (
                <div className="aspect-[3/4] flex flex-col items-center justify-center gap-4 bg-secondary/20">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="font-display text-lg font-light text-foreground">Memproses AI Try-On...</p>
                  <p className="font-body text-xs text-muted-foreground text-center px-8">
                    AI kami sedang mengenakan {kebaya.name} pada foto Anda
                  </p>
                </div>
              )}

              {/* Result */}
              {resultUrl && (
                <div>
                  <div className="relative">
                    <img src={resultUrl} alt="Try-on result" className="w-full" />
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 font-body text-xs font-semibold tracking-wider">
                      AI Result
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={reset}
                      className="flex-1 border border-border py-3 font-body text-xs font-semibold tracking-widest uppercase text-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={13} /> Coba Lagi
                    </button>
                    <a
                      href={resultUrl}
                      download="reclo-tryon.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-primary text-primary-foreground py-3 font-body text-xs font-semibold tracking-widest uppercase hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      Simpan Foto
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}