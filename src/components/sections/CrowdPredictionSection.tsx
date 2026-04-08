import { useState, useRef, useEffect } from "react";
import {
  BarChart3,
  Upload,
  AlertCircle,
  Target,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Search,
  Shield,
  Camera,
  Info,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
  source?: string;
}

const CrowdDensityAnalyzer = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detailLevel, setDetailLevel] = useState<
    "Summary" | "Detailed" | "Technical"
  >("Summary");

  const [analysisResults, setAnalysisResults] = useState({
    totalCount: 0,
    confidence: 0,
    density: "Low" as "Low" | "Medium" | "High",
    riskLevel: "Safe" as "Safe" | "Moderate" | "High",
    detectedObjects: [] as Detection[],
    mergedObjects: [] as Detection[],
    finalObjects: [] as Detection[],
    analysisMode: "Real-time" as "Real-time" | "Statistical",
    countType: "Direct Count" as "Direct Count" | "Estimated Count",
    errorMessage: null as string | null,
  });

  const modelRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initializeEngine = async () => {
    try {
      setIsEngineReady(false);
      setAnalysisResults((prev) => ({ ...prev, errorMessage: null }));

      const [tf, cocoSsd] = await Promise.all([
        import("@tensorflow/tfjs"),
        import("@tensorflow-models/coco-ssd"),
      ]);

      await tf.ready();
      try {
        await tf.setBackend("webgl");
      } catch {
        await tf.setBackend("cpu");
      }

      const model = await cocoSsd.load({ base: "mobilenet_v2" });
      if (!isMountedRef.current) return;
      modelRef.current = model;
      setIsEngineReady(true);
      console.log("Crowd Detection Engine initialized successfully");
    } catch (err) {
      if (!isMountedRef.current) return;
      setIsEngineReady(false);
      setAnalysisResults((prev) => ({
        ...prev,
        errorMessage: "Engine Load Error",
      }));
      toast.error("Unable to load detection engine. Please try refreshing.");
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    initializeEngine();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const calculateBoxOverlap = (bbox1: number[], bbox2: number[]) => {
    const [x1, y1, w1, h1] = bbox1;
    const [x2, y2, w2, h2] = bbox2;
    const x_overlap = Math.max(
      0,
      Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2),
    );
    const y_overlap = Math.max(
      0,
      Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2),
    );
    const overlap_area = x_overlap * y_overlap;
    const area1 = w1 * h1;
    const area2 = w2 * h2;
    const union = area1 + area2 - overlap_area;
    return union > 0 ? overlap_area / union : 0;
  };

  const removeRedundantBoxes = (
    detections: Detection[],
    overlapThreshold = 0.45,
  ) => {
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const selected: Detection[] = [];
    const active = new Array(sorted.length).fill(true);

    for (let i = 0; i < sorted.length; i++) {
      if (active[i]) {
        selected.push(sorted[i]);
        for (let j = i + 1; j < sorted.length; j++) {
          if (active[j]) {
            const overlap = calculateBoxOverlap(sorted[i].bbox, sorted[j].bbox);
            if (overlap > overlapThreshold) active[j] = false;
          }
        }
      }
    }
    return selected;
  };

  const normalizeBox = (
    bbox: [number, number, number, number],
    width: number,
    height: number,
  ): [number, number, number, number] => {
    const [x, y, w, h] = bbox;
    const nx = Math.max(0, x);
    const ny = Math.max(0, y);
    const nw = Math.max(0, Math.min(w, width - nx));
    const nh = Math.max(0, Math.min(h, height - ny));
    return [nx, ny, nw, nh];
  };

  const detectPeople = async (
    model: any,
    canvas: HTMLCanvasElement,
    source: string,
    minConfidence = 0.25,
  ) => {
    const detections = await model.detect(canvas, 100, minConfidence);
    return detections
      .filter((d: any) => d.class === "person")
      .map((d: any) => ({
        ...d,
        source,
      })) as Detection[];
  };

  const fuseDetections = (detections: Detection[], overlapThreshold = 0.55) => {
    if (!detections.length) return [];

    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const clusters: Detection[][] = [];

    for (const detection of sorted) {
      let targetCluster: Detection[] | null = null;
      let bestOverlap = 0;

      for (const cluster of clusters) {
        const clusterHead = cluster[0];
        const overlap = calculateBoxOverlap(clusterHead.bbox, detection.bbox);
        if (overlap > overlapThreshold && overlap > bestOverlap) {
          bestOverlap = overlap;
          targetCluster = cluster;
        }
      }

      if (!targetCluster) {
        clusters.push([detection]);
      } else {
        targetCluster.push(detection);
      }
    }

    return clusters.map((cluster) => {
      const totalScore = cluster.reduce((acc, d) => acc + d.score, 0) || 1;
      const fusedBox: [number, number, number, number] = [0, 0, 0, 0];

      cluster.forEach((d) => {
        fusedBox[0] += d.bbox[0] * d.score;
        fusedBox[1] += d.bbox[1] * d.score;
        fusedBox[2] += d.bbox[2] * d.score;
        fusedBox[3] += d.bbox[3] * d.score;
      });

      fusedBox[0] /= totalScore;
      fusedBox[1] /= totalScore;
      fusedBox[2] /= totalScore;
      fusedBox[3] /= totalScore;

      const maxScore = Math.max(...cluster.map((d) => d.score));
      const strengthBoost = Math.min(0.12, (cluster.length - 1) * 0.03);

      return {
        bbox: fusedBox,
        class: "person",
        score: Math.min(0.98, maxScore + strengthBoost),
        source: "Merged",
      } as Detection;
    });
  };

  const calculateIntersection = (a: number[], b: number[]) => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;
    const ix = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
    const iy = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
    return ix * iy;
  };

  const filterContainedBoxes = (detections: Detection[], threshold = 0.72) => {
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const kept: Detection[] = [];

    for (const candidate of sorted) {
      const shouldRemove = kept.some((picked) => {
        const overlapArea = calculateIntersection(candidate.bbox, picked.bbox);
        const candidateArea = candidate.bbox[2] * candidate.bbox[3];
        const pickedArea = picked.bbox[2] * picked.bbox[3];
        const smallerArea = Math.max(1, Math.min(candidateArea, pickedArea));
        const containment = overlapArea / smallerArea;
        return containment > threshold;
      });

      if (!shouldRemove) kept.push(candidate);
    }

    return kept;
  };

  const deduplicateByCenter = (
    detections: Detection[],
    centerThreshold = 0.18,
  ) => {
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const selected: Detection[] = [];

    for (const d of sorted) {
      const [x, y, w, h] = d.bbox;
      const cx = x + w / 2;
      const cy = y + h / 2;
      const diagonal = Math.sqrt(w * w + h * h);

      const hasNearDuplicate = selected.some((s) => {
        const [sx, sy, sw, sh] = s.bbox;
        const scx = sx + sw / 2;
        const scy = sy + sh / 2;
        const distance = Math.hypot(cx - scx, cy - scy);
        const normalizedDist =
          distance /
          Math.max(1, Math.min(diagonal, Math.sqrt(sw * sw + sh * sh)));
        return normalizedDist < centerThreshold;
      });

      if (!hasNearDuplicate) selected.push(d);
    }

    return selected;
  };

  const analyzeImage = async (
    imageElement: HTMLImageElement | HTMLVideoElement,
  ) => {
    if (!modelRef.current) {
      toast.error("Detection engine is not ready");
      return;
    }
    if (!canvasRef.current) return;
    setIsAnalyzing(true);
    setShowResults(false);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const w =
        imageElement instanceof HTMLVideoElement
          ? imageElement.videoWidth
          : imageElement.naturalWidth || imageElement.width;
      const h =
        imageElement instanceof HTMLVideoElement
          ? imageElement.videoHeight
          : imageElement.naturalHeight || imageElement.height;
      if (!w || !h) {
        toast.error("Invalid image source");
        setIsAnalyzing(false);
        return;
      }

      // Multi-pass detection strategy
      const detectionScale = 640 / w;
      canvas.width = 640;
      canvas.height = h * detectionScale;
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      // First pass: Base detection
      const baseDetections = await detectPeople(
        modelRef.current,
        canvas,
        "Primary",
        0.3,
      );
      const allDetections: Detection[] = [...baseDetections];
      const isDenseScene = baseDetections.length >= 10;

      // Second pass: High-resolution for dense scenes
      if (isDenseScene) {
        const highResWidth = 896;
        const highResScale = highResWidth / w;
        const hiResCanvas = document.createElement("canvas");
        const hiResCtx = hiResCanvas.getContext("2d");
        hiResCanvas.width = highResWidth;
        hiResCanvas.height = Math.round(h * highResScale);
        hiResCtx?.drawImage(
          imageElement,
          0,
          0,
          hiResCanvas.width,
          hiResCanvas.height,
        );

        const hiResDetections = await detectPeople(
          modelRef.current,
          hiResCanvas,
          "Secondary",
          0.28,
        );
        const rescaleRatio = canvas.width / hiResCanvas.width;
        hiResDetections.forEach((d) => {
          allDetections.push({
            ...d,
            bbox: [
              d.bbox[0] * rescaleRatio,
              d.bbox[1] * rescaleRatio,
              d.bbox[2] * rescaleRatio,
              d.bbox[3] * rescaleRatio,
            ],
          });
        });
      }

      // Third pass: Tiled detection for better coverage
      const gridCols = isDenseScene ? 3 : 2;
      const gridRows = isDenseScene ? 3 : 2;
      const overlapPercent = isDenseScene ? 0.2 : 0.05;
      const tileWidth = Math.round(
        canvas.width / (1 + (gridCols - 1) * (1 - overlapPercent)),
      );
      const tileHeight = Math.round(
        canvas.height / (1 + (gridRows - 1) * (1 - overlapPercent)),
      );
      const stepX = Math.max(1, Math.round(tileWidth * (1 - overlapPercent)));
      const stepY = Math.max(1, Math.round(tileHeight * (1 - overlapPercent)));

      const tiles: Array<{ x: number; y: number; w: number; h: number }> = [];
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const tileX = Math.min(c * stepX, canvas.width - tileWidth);
          const tileY = Math.min(r * stepY, canvas.height - tileHeight);
          tiles.push({ x: tileX, y: tileY, w: tileWidth, h: tileHeight });
        }
      }

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      for (const tile of tiles) {
        tempCanvas.width = tile.w;
        tempCanvas.height = tile.h;
        tempCtx?.drawImage(
          canvas,
          tile.x,
          tile.y,
          tile.w,
          tile.h,
          0,
          0,
          tile.w,
          tile.h,
        );

        const tileDetections = await detectPeople(
          modelRef.current,
          tempCanvas,
          "Tile",
          isDenseScene ? 0.26 : 0.36,
        );
        tileDetections.forEach((d) => {
          allDetections.push({
            ...d,
            bbox: [
              d.bbox[0] + tile.x,
              d.bbox[1] + tile.y,
              d.bbox[2],
              d.bbox[3],
            ],
          });
        });
      }

      // Post-processing: Cleanup and consolidation
      const normalizedDetections = allDetections
        .map((d) => ({
          ...d,
          bbox: normalizeBox(d.bbox, canvas.width, canvas.height),
        }))
        .filter((d) => d.bbox[2] > 0 && d.bbox[3] > 0);

      // Apply fusion and filtering
      const fusedDetections = fuseDetections(normalizedDetections, 0.55);
      const cleanedDetections = removeRedundantBoxes(
        fusedDetections,
        isDenseScene ? 0.5 : 0.45,
      );
      const filteredDetections = filterContainedBoxes(
        cleanedDetections,
        isDenseScene ? 0.76 : 0.68,
      );
      const finalDetections = deduplicateByCenter(
        filteredDetections,
        isDenseScene ? 0.16 : 0.2,
      );

      // Final validation filtering
      const validatedDetections = finalDetections.filter((d) => {
        const [x, y, bw, bh] = d.bbox;
        const aspectRatio = bw / bh;
        const areaPercent = (bw * bh) / (canvas.width * canvas.height);
        const nearEdge =
          x <= 1 ||
          y <= 1 ||
          x + bw >= canvas.width - 1 ||
          y + bh >= canvas.height - 1;

        const confidenceOk = nearEdge
          ? d.score >= (isDenseScene ? 0.5 : 0.58)
          : d.score >= (isDenseScene ? 0.35 : 0.45);
        const sizeOk =
          areaPercent > (isDenseScene ? 0.00045 : 0.00075) ||
          (d.score >= 0.68 && areaPercent > 0.0003) ||
          (d.score >= 0.82 && areaPercent > 0.00022);

        return (
          confidenceOk &&
          sizeOk &&
          aspectRatio > 0.12 &&
          aspectRatio < 1.6 &&
          bw >= 6 &&
          bh >= 10
        );
      });

      // Determine count and analysis mode
      let finalCount = validatedDetections.length;
      let mode: "Real-time" | "Statistical" = "Real-time";
      let countType: "Direct Count" | "Estimated Count" = "Direct Count";

      if (finalCount > 30) {
        mode = "Statistical";
        countType = "Estimated Count";
        const hiddenCount =
          normalizedDetections.length - filteredDetections.length;
        finalCount += Math.round(hiddenCount * 0.25);
      }

      const avgConfidence =
        validatedDetections.length > 0
          ? Math.round(
              (validatedDetections.reduce((acc, d) => acc + d.score, 0) /
                validatedDetections.length) *
                100,
            )
          : 0;

      let riskStatus: "Safe" | "Moderate" | "High" = "Safe";
      if (finalCount > 40) riskStatus = "High";
      else if (finalCount >= 20) riskStatus = "Moderate";

      setAnalysisResults({
        totalCount: finalCount,
        confidence: avgConfidence,
        density: finalCount > 40 ? "High" : finalCount > 20 ? "Medium" : "Low",
        riskLevel: riskStatus,
        detectedObjects: normalizedDetections,
        mergedObjects: filteredDetections,
        finalObjects: validatedDetections,
        analysisMode: mode,
        countType: countType,
        errorMessage: null,
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 1200);
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const startLiveCapture = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Unable to access camera");
      setIsCameraActive(false);
    }
  };

  const takeCameraSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const snapshotCanvas = document.createElement("canvas");
      snapshotCanvas.width = video.videoWidth;
      snapshotCanvas.height = video.videoHeight;
      snapshotCanvas.getContext("2d")?.drawImage(video, 0, 0);
      setImagePreview(snapshotCanvas.toDataURL("image/jpeg"));
      analyzeImage(video);
      setIsCameraActive(false);
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <section id="crowd-detection" className="h-full w-full flex flex-col pt-10">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 h-[calc(100vh-200px)]">
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left-5 duration-700">
              <div>
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase tracking-[0.2em] font-black text-[10px] px-4 py-2 flex w-fit items-center h-7 backdrop-blur-sm self-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-blue-400 animate-pulse" />
                  {isEngineReady ? "Analyzer Active" : "Loading Engine..."}
                </Badge>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none uppercase">
                  CROWD <span className="text-blue-400 italic">ANALYSIS</span>
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-white/40 font-medium uppercase tracking-widest text-[10px]">
                    Intelligent People Detection | Adaptive Processing
                  </p>
                  {analysisResults.errorMessage && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                      Error: Engine unavailable
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 bg-white/5 rounded-2xl p-1 border border-white/10">
                {(["Summary", "Detailed", "Technical"] as const).map(
                  (level) => (
                    <Button
                      key={level}
                      variant="ghost"
                      onClick={() => setDetailLevel(level)}
                      className={cn(
                        "h-8 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                        detailLevel === level
                          ? "bg-white/20 text-white"
                          : "text-white/40 hover:text-white",
                      )}
                    >
                      {level}
                    </Button>
                  ),
                )}
              </div>
            </div>

            <div className="flex-1 rounded-[3rem] border border-white/5 bg-black/40 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImagePreview(url);
                    const img = new Image();
                    img.onload = () => analyzeImage(img);
                    img.src = url;
                  }
                }}
                className="hidden"
                accept="image/*"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!imagePreview && !isCameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Search className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4">
                    Upload or Capture
                  </h3>
                  <p className="text-sm text-white/50 mb-6">
                    Select an image from your device or use your camera
                  </p>
                  <div className="flex gap-4">
                    <Button
                      disabled={!isEngineReady}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-2xl px-8 h-14 bg-blue-500 hover:bg-blue-600 font-black uppercase tracking-widest transition-all"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload Image
                    </Button>
                    <Button
                      disabled={!isEngineReady}
                      variant="outline"
                      onClick={startLiveCapture}
                      className="rounded-2xl px-8 h-14 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 font-black uppercase tracking-widest"
                    >
                      <Camera className="w-4 h-4 mr-2" /> Camera
                    </Button>
                  </div>
                  {analysisResults.errorMessage && (
                    <Button
                      variant="outline"
                      onClick={initializeEngine}
                      className="mt-4 rounded-2xl px-8 h-12 border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-black uppercase tracking-widest"
                    >
                      Retry Engine
                    </Button>
                  )}
                </div>
              ) : isCameraActive ? (
                <div className="absolute inset-0 bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4 px-8">
                    <Button
                      variant="outline"
                      onClick={() => setIsCameraActive(false)}
                      className="rounded-2xl bg-white/5 border-white/10 text-white/60 uppercase font-black text-[10px] tracking-widest"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={takeCameraSnapshot}
                      className="rounded-2xl px-10 bg-blue-500 hover:bg-blue-600 font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 transition-all hover:scale-110"
                    >
                      Capture
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <img
                    src={imagePreview!}
                    className="w-full h-full object-cover"
                    alt="Analysis"
                  />

                  {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40">
                      <div className="bg-black/60 backdrop-blur-xl px-10 py-6 rounded-3xl border border-blue-500/20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
                        <p className="text-[12px] font-black text-white uppercase tracking-[0.3em]">
                          Analyzing Image...
                        </p>
                      </div>
                    </div>
                  )}

                  {showResults && (
                    <div className="absolute inset-0 z-30 pointer-events-none">
                      <svg
                        className="w-full h-full"
                        viewBox={`0 0 ${canvasRef.current?.width || 100} ${canvasRef.current?.height || 100}`}
                        preserveAspectRatio="xMidYMid slice"
                      >
                        {detailLevel === "Detailed" &&
                          analysisResults.detectedObjects.map((d, i) => (
                            <rect
                              key={`raw-${i}`}
                              x={d.bbox[0]}
                              y={d.bbox[1]}
                              width={d.bbox[2]}
                              height={d.bbox[3]}
                              fill="none"
                              stroke="rgba(96,165,250,0.2)"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                          ))}

                        {detailLevel === "Technical" &&
                          analysisResults.mergedObjects.map((d, i) => (
                            <rect
                              key={`merged-${i}`}
                              x={d.bbox[0]}
                              y={d.bbox[1]}
                              width={d.bbox[2]}
                              height={d.bbox[3]}
                              fill="none"
                              stroke="rgba(96,165,250,0.4)"
                              strokeWidth="2"
                            />
                          ))}

                        {analysisResults.finalObjects.map((d, i) => (
                          <g
                            key={`final-${i}`}
                            className="animate-in fade-in duration-500"
                          >
                            <rect
                              x={d.bbox[0]}
                              y={d.bbox[1]}
                              width={d.bbox[2]}
                              height={d.bbox[3]}
                              fill="rgba(96,165,250,0.05)"
                              stroke="hsl(217, 91%, 60%)"
                              strokeWidth="2"
                              className="animate-pulse"
                            />
                            <circle
                              cx={d.bbox[0] + d.bbox[2] / 2}
                              cy={d.bbox[1] + d.bbox[3] / 2}
                              r="2"
                              fill="hsl(217, 91%, 60%)"
                            />
                          </g>
                        ))}
                      </svg>
                    </div>
                  )}

                  {showResults && (
                    <div className="absolute top-8 right-8 z-40 animate-in fade-in zoom-in duration-500 flex flex-col gap-3">
                      <div className="p-5 bg-black/70 backdrop-blur-2xl rounded-3xl flex items-center gap-4 border border-white/10 min-w-[280px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-30">
                          <Badge
                            variant="outline"
                            className="text-[8px] border-blue-400/40 text-blue-400 uppercase font-black tracking-tighter"
                          >
                            {analysisResults.analysisMode}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            {analysisResults.countType}
                          </p>
                          <p className="text-2xl font-black text-white leading-none mt-1">
                            {analysisResults.totalCount}{" "}
                            <span className="text-[10px] text-white/40 ml-1">
                              People
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="p-5 bg-black/70 backdrop-blur-2xl rounded-3xl flex items-center gap-4 border border-white/10 relative overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            Confidence Level
                          </p>
                          <p
                            className={cn(
                              "text-2xl font-black leading-none mt-1",
                              analysisResults.confidence < 60
                                ? "text-yellow-400"
                                : "text-white",
                            )}
                          >
                            {analysisResults.confidence}%
                          </p>
                        </div>
                        {analysisResults.confidence < 60 && (
                          <div className="absolute bottom-1 right-3 flex items-center gap-1 text-yellow-400 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-[6px] font-black uppercase">
                              Low Confidence
                            </span>
                          </div>
                        )}
                      </div>

                      {analysisResults.confidence < 60 && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center gap-3 animate-bounce">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest leading-tight">
                            Low confidence results – verify image clarity
                          </p>
                        </div>
                      )}

                      <div
                        className={cn(
                          "p-5 bg-black/70 backdrop-blur-2xl rounded-3xl flex items-center gap-4 border-l-4",
                          analysisResults.riskLevel === "Safe"
                            ? "border-l-green-500"
                            : analysisResults.riskLevel === "Moderate"
                              ? "border-l-yellow-500"
                              : "border-l-red-500",
                        )}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center">
                          <Zap
                            className={cn(
                              "w-6 h-6",
                              analysisResults.riskLevel === "Safe"
                                ? "text-green-500"
                                : analysisResults.riskLevel === "Moderate"
                                  ? "text-yellow-500"
                                  : "text-red-500",
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            Risk Assessment
                          </p>
                          <p
                            className={cn(
                              "text-xl font-black uppercase tracking-tighter mt-1",
                              analysisResults.riskLevel === "Safe"
                                ? "text-green-500"
                                : analysisResults.riskLevel === "Moderate"
                                  ? "text-yellow-500"
                                  : "text-red-500",
                            )}
                          >
                            {analysisResults.riskLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="link"
                    onClick={() => {
                      setImagePreview(null);
                      setShowResults(false);
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-white/40 uppercase tracking-widest font-black text-[10px] hover:text-white transition-all bg-black/20 hover:bg-black/40 px-6 py-2 rounded-full border border-white/5"
                  >
                    Clear Analysis
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-8 pt-12">
            <div className="p-8 rounded-[3rem] bg-black/40 border border-white/10 shadow-2xl backdrop-blur-2xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" /> Detection Stats
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Analysis Mode
                  </p>
                  <p className="text-sm font-black text-white italic opacity-80">
                    {analysisResults.analysisMode} Detection Method
                  </p>
                </div>
                <div className="h-px bg-white/5 w-full my-4" />
                <div className="bg-blue-500/5 p-5 rounded-3xl border border-blue-500/20">
                  <p className="text-[11px] text-blue-400 font-black uppercase tracking-widest mb-4 border-b border-blue-500/20 pb-2">
                    Processing Summary
                  </p>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      Initial Detections
                    </span>
                    <span className="text-[10px] text-white font-black">
                      {analysisResults.detectedObjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      Redundancy Removed
                    </span>
                    <span className="text-[10px] text-red-500 font-black">
                      -
                      {analysisResults.detectedObjects.length -
                        analysisResults.mergedObjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      False Positives Filtered
                    </span>
                    <span className="text-[10px] text-orange-500 font-black">
                      -
                      {analysisResults.mergedObjects.length -
                        analysisResults.finalObjects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-[11px] text-white font-black uppercase tracking-tighter">
                      Final Count
                    </span>
                    <span className="text-[14px] text-emerald-500 font-black">
                      {analysisResults.totalCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-blue-500/10 border border-blue-500/20 group relative overflow-hidden shadow-2xl backdrop-blur-2xl">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
              <Shield className="w-10 h-10 text-blue-400 mb-4 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">
                Quick Tips
              </h4>
              <p className="text-[10px] text-white/40 leading-relaxed font-bold mb-6 italic opacity-80">
                Ensure good lighting and clear visibility for accurate results.
                Multiple detection passes analyze different regions and
                resolutions.
              </p>
              <Button
                disabled={!isEngineReady}
                className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 border-none font-black uppercase text-[10px] h-12 shadow-xl shadow-blue-500/20"
                onClick={() => {
                  if (imagePreview) {
                    const img = new Image();
                    img.onload = () => analyzeImage(img);
                    img.src = imagePreview;
                  }
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" /> Reanalyze Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdDensityAnalyzer;
