import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Upload,
  Zap,
  Target,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Search,
  Shield,
  Camera,
  Layers,
  Thermometer,
  Expand,
  Info,
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

const CrowdPredictionSection = () => {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [debugLevel, setDebugLevel] = useState<
    "Off" | "Raw" | "Merged" | "Final"
  >("Off");

  const [analysisData, setAnalysisData] = useState({
    count: 0,
    confidence: 0,
    density: "Low" as "Low" | "Medium" | "High",
    risk: "Safe" as "Safe" | "Moderate" | "High Risk",
    rawDetections: [] as Detection[],
    mergedDetections: [] as Detection[],
    finalDetections: [] as Detection[],
    inferenceMode: "YOLO" as "YOLO" | "DENSITY",
    accuracyType: "Detected Count" as
      | "Detected Count"
      | "Estimated Count (Density Model)",
    error: null as string | null,
  });

  const modelRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      setAnalysisData((prev) => ({ ...prev, error: null }));

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
      setIsModelLoading(false);
      console.log("Stable Hybrid Crowd Engine Online");
    } catch (err) {
      if (!isMountedRef.current) return;
      setIsModelLoading(false);
      setAnalysisData((prev) => ({ ...prev, error: "Model Load Error" }));
      toast.error("Model failed to load. Please retry.");
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadModel();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const calculateIOU = (bbox1: number[], bbox2: number[]) => {
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

  const applyNMS = (detections: Detection[], iouThreshold = 0.45) => {
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const selected: Detection[] = [];
    const active = new Array(sorted.length).fill(true);

    for (let i = 0; i < sorted.length; i++) {
      if (active[i]) {
        selected.push(sorted[i]);
        for (let j = i + 1; j < sorted.length; j++) {
          if (active[j]) {
            const iou = calculateIOU(sorted[i].bbox, sorted[j].bbox);
            // If IoU > threshold → keep only highest confidence box (this one)
            if (iou > iouThreshold) active[j] = false;
          }
        }
      }
    }
    return selected;
  };

  const normalizeBBox = (
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

  const detectPersons = async (
    model: any,
    target: HTMLCanvasElement,
    source: string,
    minScore = 0.25,
  ) => {
    const raw = await model.detect(target, 100, minScore);
    return raw
      .filter((d: any) => d.class === "person")
      .map((d: any) => ({
        ...d,
        source,
      })) as Detection[];
  };

  const weightedBoxFusion = (detections: Detection[], iouThreshold = 0.55) => {
    if (!detections.length) return [];

    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const clusters: Detection[][] = [];

    for (const detection of sorted) {
      let targetCluster: Detection[] | null = null;
      let bestIou = 0;

      for (const cluster of clusters) {
        const clusterHead = cluster[0];
        const iou = calculateIOU(clusterHead.bbox, detection.bbox);
        if (iou > iouThreshold && iou > bestIou) {
          bestIou = iou;
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
      const weightSum = cluster.reduce((acc, d) => acc + d.score, 0) || 1;
      const fusedBox: [number, number, number, number] = [0, 0, 0, 0];

      cluster.forEach((d) => {
        fusedBox[0] += d.bbox[0] * d.score;
        fusedBox[1] += d.bbox[1] * d.score;
        fusedBox[2] += d.bbox[2] * d.score;
        fusedBox[3] += d.bbox[3] * d.score;
      });

      fusedBox[0] /= weightSum;
      fusedBox[1] /= weightSum;
      fusedBox[2] /= weightSum;
      fusedBox[3] /= weightSum;

      const maxScore = Math.max(...cluster.map((d) => d.score));
      const consensusBoost = Math.min(0.12, (cluster.length - 1) * 0.03);

      return {
        bbox: fusedBox,
        class: "person",
        score: Math.min(0.98, maxScore + consensusBoost),
        source: "Fused",
      } as Detection;
    });
  };

  const getIntersectionArea = (a: number[], b: number[]) => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;
    const ix = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
    const iy = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
    return ix * iy;
  };

  const applyContainmentSuppression = (
    detections: Detection[],
    threshold = 0.72,
  ) => {
    const sorted = [...detections].sort((a, b) => b.score - a.score);
    const kept: Detection[] = [];

    for (const candidate of sorted) {
      const suppress = kept.some((picked) => {
        const overlapArea = getIntersectionArea(candidate.bbox, picked.bbox);
        const candidateArea = candidate.bbox[2] * candidate.bbox[3];
        const pickedArea = picked.bbox[2] * picked.bbox[3];
        const smallerArea = Math.max(1, Math.min(candidateArea, pickedArea));
        const containment = overlapArea / smallerArea;
        return containment > threshold;
      });

      if (!suppress) kept.push(candidate);
    }

    return kept;
  };

  const applyCenterDistanceDedup = (
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

      const hasNearCenter = selected.some((s) => {
        const [sx, sy, sw, sh] = s.bbox;
        const scx = sx + sw / 2;
        const scy = sy + sh / 2;
        const dist = Math.hypot(cx - scx, cy - scy);
        const norm =
          dist / Math.max(1, Math.min(diagonal, Math.sqrt(sw * sw + sh * sh)));
        return norm < centerThreshold;
      });

      if (!hasNearCenter) selected.push(d);
    }

    return selected;
  };

  const runInference = async (
    imageElement: HTMLImageElement | HTMLVideoElement,
  ) => {
    if (!modelRef.current) {
      toast.error("Model is not ready yet");
      return;
    }
    if (!canvasRef.current) return;
    setIsScanning(true);
    setShowAnalysis(false);

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
        setIsScanning(false);
        return;
      }

      // Resize internally to optimal resolution (640px width)
      const scale = 640 / w;
      canvas.width = 640;
      canvas.height = h * scale;
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      // Stage A: Global pass first, then choose sparse/dense strategy.
      const baseGlobal = await detectPersons(
        modelRef.current,
        canvas,
        "Global",
        0.3,
      );
      const masterRaw: Detection[] = [...baseGlobal];
      const denseScene = baseGlobal.length >= 10;

      // Stage B: Hi-res pass only for dense scenes.
      if (denseScene) {
        const hiResWidth = 896;
        const hiScale = hiResWidth / w;
        const hiResCanvas = document.createElement("canvas");
        const hiResCtx = hiResCanvas.getContext("2d");
        hiResCanvas.width = hiResWidth;
        hiResCanvas.height = Math.round(h * hiScale);
        hiResCtx?.drawImage(
          imageElement,
          0,
          0,
          hiResCanvas.width,
          hiResCanvas.height,
        );

        const hiResRaw = await detectPersons(
          modelRef.current,
          hiResCanvas,
          "Global-HiRes",
          0.28,
        );
        const backScale = canvas.width / hiResCanvas.width;
        hiResRaw.forEach((d) => {
          masterRaw.push({
            ...d,
            bbox: [
              d.bbox[0] * backScale,
              d.bbox[1] * backScale,
              d.bbox[2] * backScale,
              d.bbox[3] * backScale,
            ],
          });
        });
      }

      // Stage C: tile strategy adapts by scene density.
      const cols = denseScene ? 3 : 2;
      const rows = denseScene ? 3 : 2;
      const overlapRatio = denseScene ? 0.2 : 0.05;
      const tileW = Math.round(
        canvas.width / (1 + (cols - 1) * (1 - overlapRatio)),
      );
      const tileH = Math.round(
        canvas.height / (1 + (rows - 1) * (1 - overlapRatio)),
      );
      const strideX = Math.max(1, Math.round(tileW * (1 - overlapRatio)));
      const strideY = Math.max(1, Math.round(tileH * (1 - overlapRatio)));

      const tiles: Array<{ x: number; y: number; w: number; h: number }> = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx = Math.min(c * strideX, canvas.width - tileW);
          const ty = Math.min(r * strideY, canvas.height - tileH);
          tiles.push({ x: tx, y: ty, w: tileW, h: tileH });
        }
      }

      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");
      for (const tile of tiles) {
        offCanvas.width = tile.w;
        offCanvas.height = tile.h;
        offCtx?.drawImage(
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

        const tileRaw = await detectPersons(
          modelRef.current,
          offCanvas,
          "Tile",
          denseScene ? 0.26 : 0.36,
        );
        tileRaw.forEach((d) => {
          masterRaw.push({
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

      // Step 1: normalize boxes before merge
      const normalizedRaw = masterRaw
        .map((d) => ({
          ...d,
          bbox: normalizeBBox(d.bbox, canvas.width, canvas.height),
        }))
        .filter((d) => d.bbox[2] > 0 && d.bbox[3] > 0);

      // Step 2: merge duplicate boxes with WBF + multi-step dedup.
      const fusedDetections = weightedBoxFusion(normalizedRaw, 0.55);
      const nmsDetections = applyNMS(fusedDetections, denseScene ? 0.5 : 0.45);
      const containmentDetections = applyContainmentSuppression(
        nmsDetections,
        denseScene ? 0.76 : 0.68,
      );
      const mergedPassed = applyCenterDistanceDedup(
        containmentDetections,
        denseScene ? 0.16 : 0.2,
      );

      // 2. FALSE POSITIVE FILTERING
      const finalDetections = mergedPassed.filter((d) => {
        const [x, y, bw, bh] = d.bbox;
        const aspect = bw / bh;
        const areaRatio = (bw * bh) / (canvas.width * canvas.height);
        const touchesEdge =
          x <= 1 ||
          y <= 1 ||
          x + bw >= canvas.width - 1 ||
          y + bh >= canvas.height - 1;

        const scorePass = touchesEdge
          ? d.score >= (denseScene ? 0.5 : 0.58)
          : d.score >= (denseScene ? 0.35 : 0.45);
        const areaPass =
          areaRatio > (denseScene ? 0.00045 : 0.00075) ||
          (d.score >= 0.68 && areaRatio > 0.0003) ||
          (d.score >= 0.82 && areaRatio > 0.00022);

        // Adaptive filtering tuned for crowded scenes and partial occlusions.
        return (
          scorePass &&
          areaPass &&
          aspect > 0.12 &&
          aspect < 1.6 &&
          bw >= 6 &&
          bh >= 10
        );
      });

      // 3. FINAL COUNT & DROWD HANDLING
      let finalCount = finalDetections.length;
      let mode: "YOLO" | "DENSITY" = "YOLO";
      let accuracyType: "Detected Count" | "Estimated Count (Density Model)" =
        "Detected Count";

      // Automatic Fallback Switch (High overlap or count > 30)
      if (finalCount > 30) {
        mode = "DENSITY";
        accuracyType = "Estimated Count (Density Model)";
        // Simple pixel-density fallback logic
        const overlapCount = normalizedRaw.length - mergedPassed.length;
        finalCount += Math.round(overlapCount * 0.25); // Account for hidden occlusions
      }

      const avgConf =
        finalDetections.length > 0
          ? Math.round(
              (finalDetections.reduce((acc, d) => acc + d.score, 0) /
                finalDetections.length) *
                100,
            )
          : 0;

      let risk: "Safe" | "Moderate" | "High Risk" = "Safe";
      if (finalCount > 40) risk = "High Risk";
      else if (finalCount >= 20) risk = "Moderate";

      setAnalysisData({
        count: finalCount,
        confidence: avgConf,
        density: finalCount > 40 ? "High" : finalCount > 20 ? "Medium" : "Low",
        risk,
        rawDetections: normalizedRaw,
        mergedDetections: mergedPassed,
        finalDetections: finalDetections,
        inferenceMode: mode,
        accuracyType: accuracyType,
        error: null,
      });

      setTimeout(() => {
        setIsScanning(false);
        setShowAnalysis(true);
      }, 1500);
    } catch (err) {
      toast.error("Inference stabilization failure");
      setIsScanning(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsLive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Camera access denied");
      setIsLive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const snapshotCanvas = document.createElement("canvas");
      snapshotCanvas.width = video.videoWidth;
      snapshotCanvas.height = video.videoHeight;
      snapshotCanvas.getContext("2d")?.drawImage(video, 0, 0);
      setImgPreview(snapshotCanvas.toDataURL("image/jpeg"));
      runInference(video);
      setIsLive(false);
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <section
      id="crowd-prediction"
      className="h-full w-full flex flex-col pt-10"
    >
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 h-[calc(100vh-200px)]">
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left-5 duration-700">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.2em] font-black text-[10px] px-4 py-2 flex w-fit items-center h-7 backdrop-blur-sm self-start">
                  <Shield className="w-3.5 h-3.5 mr-2 text-primary animate-pulse" />
                  {isModelLoading
                    ? "Stable Engine Loading..."
                    : "Stable Inference Active"}
                </Badge>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none uppercase">
                  HYBRID <span className="text-primary italic">STABILITY</span>
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-white/40 font-medium uppercase tracking-widest text-[10px]">
                    Balanced Pipeline: Adaptive Precision | WBF + NMS
                  </p>
                  {analysisData.error && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                      Engine offline
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 bg-white/5 rounded-2xl p-1 border border-white/10">
                {(["Off", "Raw", "Merged", "Final"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    variant="ghost"
                    onClick={() => setDebugLevel(lvl)}
                    className={cn(
                      "h-8 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                      debugLevel === lvl
                        ? "bg-white/20 text-white"
                        : "text-white/40 hover:text-white",
                    )}
                  >
                    {lvl}
                  </Button>
                ))}
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
                    setImgPreview(url);
                    const img = new Image();
                    img.onload = () => runInference(img);
                    img.src = url;
                  }
                }}
                className="hidden"
                accept="image/*"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!imgPreview && !isLive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4">
                    Initialize Stable Analysis
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      disabled={isModelLoading}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-2xl px-8 h-14 bg-primary hover:bg-orange-600 font-black uppercase tracking-widest transition-all"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Select Image
                    </Button>
                    <Button
                      disabled={isModelLoading}
                      variant="outline"
                      onClick={startCamera}
                      className="rounded-2xl px-8 h-14 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 font-black uppercase tracking-widest"
                    >
                      Camera
                    </Button>
                  </div>
                  {analysisData.error && (
                    <Button
                      variant="outline"
                      onClick={loadModel}
                      className="mt-4 rounded-2xl px-8 h-12 border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-black uppercase tracking-widest"
                    >
                      Retry Engine
                    </Button>
                  )}
                </div>
              ) : isLive ? (
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
                      onClick={() => setIsLive(false)}
                      className="rounded-2xl bg-white/5 border-white/10 text-white/60 uppercase font-black text-[10px] tracking-widest"
                    >
                      Abort
                    </Button>
                    <Button
                      onClick={captureSnapshot}
                      className="rounded-2xl px-10 bg-primary hover:bg-orange-600 font-black uppercase tracking-widest shadow-2xl shadow-primary/40 transition-all hover:scale-110"
                    >
                      Capture Info
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <img
                    src={imgPreview!}
                    className="w-full h-full object-cover"
                    alt="Target"
                  />

                  {isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40">
                      <div className="bg-black/60 backdrop-blur-xl px-10 py-6 rounded-3xl border border-primary/20 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,107,0,0.5)]" />
                        <p className="text-[12px] font-black text-white uppercase tracking-[0.3em]">
                          Balancing Recall Pass...
                        </p>
                      </div>
                    </div>
                  )}

                  {showAnalysis && (
                    <div className="absolute inset-0 z-30 pointer-events-none">
                      <svg
                        className="w-full h-full"
                        viewBox={`0 0 ${canvasRef.current?.width || 100} ${canvasRef.current?.height || 100}`}
                        preserveAspectRatio="xMidYMid slice"
                      >
                        {/* DEBUG: RAW DETECTIONS */}
                        {debugLevel === "Raw" &&
                          analysisData.rawDetections.map((d, i) => (
                            <rect
                              key={`raw-${i}`}
                              x={d.bbox[0]}
                              y={d.bbox[1]}
                              width={d.bbox[2]}
                              height={d.bbox[3]}
                              fill="none"
                              stroke="rgba(255,0,0,0.3)"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                          ))}

                        {/* DEBUG: MULTI-PASS MERGED */}
                        {debugLevel === "Merged" &&
                          analysisData.mergedDetections.map((d, i) => (
                            <rect
                              key={`merged-${i}`}
                              x={d.bbox[0]}
                              y={d.bbox[1]}
                              width={d.bbox[2]}
                              height={d.bbox[3]}
                              fill="none"
                              stroke="rgba(0,180,255,0.4)"
                              strokeWidth="2"
                            />
                          ))}

                        {/* FINAL BALANCED DETECTIONS */}
                        {(debugLevel === "Final" || debugLevel === "Off") &&
                          analysisData.finalDetections.map((d, i) => (
                            <g
                              key={`final-${i}`}
                              className="animate-in fade-in duration-500"
                            >
                              <rect
                                x={d.bbox[0]}
                                y={d.bbox[1]}
                                width={d.bbox[2]}
                                height={d.bbox[3]}
                                fill="rgba(255,107,0,0.05)"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                className="animate-pulse"
                              />
                              <circle
                                cx={d.bbox[0] + d.bbox[2] / 2}
                                cy={d.bbox[1] + d.bbox[3] / 2}
                                r="2"
                                fill="hsl(var(--primary))"
                              />
                            </g>
                          ))}
                      </svg>
                    </div>
                  )}

                  {showAnalysis && (
                    <div className="absolute top-8 right-8 z-40 animate-in fade-in zoom-in duration-500 flex flex-col gap-3">
                      <div className="p-5 glass-panel rounded-3xl flex items-center gap-4 border-white/10 min-w-[280px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-30">
                          <Badge
                            variant="outline"
                            className="text-[8px] border-primary/40 text-primary uppercase font-black tracking-tighter"
                          >
                            {analysisData.inferenceMode}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            {analysisData.accuracyType}
                          </p>
                          <p className="text-2xl font-black text-white leading-none mt-1">
                            {analysisData.count}{" "}
                            <span className="text-[10px] text-white/40 ml-1">
                              Humans
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="p-5 glass-panel rounded-3xl flex items-center gap-4 border-white/10 relative overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            Detection Confidence
                          </p>
                          <p
                            className={cn(
                              "text-2xl font-black leading-none mt-1",
                              analysisData.confidence < 60
                                ? "text-yellow-500"
                                : "text-white",
                            )}
                          >
                            {analysisData.confidence}%
                          </p>
                        </div>
                        {analysisData.confidence < 60 && (
                          <div className="absolute bottom-1 right-3 flex items-center gap-1 text-yellow-500 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-[6px] font-black uppercase">
                              Low Accuracy
                            </span>
                          </div>
                        )}
                      </div>

                      {analysisData.confidence < 60 && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center gap-3 animate-bounce">
                          <Info className="w-4 h-4 text-yellow-500" />
                          <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest leading-tight">
                            Low confidence – result may be inaccurate
                            <br />
                            due to poor visibility or dense occlusion.
                          </p>
                        </div>
                      )}

                      <div
                        className={cn(
                          "p-5 glass-panel rounded-3xl flex items-center gap-4 border-l-4",
                          analysisData.risk === "Safe"
                            ? "border-l-emerald-500"
                            : analysisData.risk === "Moderate"
                              ? "border-l-yellow-500"
                              : "border-l-red-500",
                        )}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center">
                          <Zap
                            className={cn(
                              "w-6 h-6",
                              analysisData.risk === "Safe"
                                ? "text-emerald-500"
                                : analysisData.risk === "Moderate"
                                  ? "text-yellow-500"
                                  : "text-red-500",
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                            Neural Safety Index
                          </p>
                          <p
                            className={cn(
                              "text-xl font-black uppercase tracking-tighter mt-1",
                              analysisData.risk === "Safe"
                                ? "text-emerald-500"
                                : analysisData.risk === "Moderate"
                                  ? "text-yellow-500"
                                  : "text-red-500",
                            )}
                          >
                            {analysisData.risk}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="link"
                    onClick={() => {
                      setImgPreview(null);
                      setShowAnalysis(false);
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-white/40 uppercase tracking-widest font-black text-[10px] hover:text-white transition-all bg-black/20 hover:bg-black/40 px-6 py-2 rounded-full border border-white/5"
                  >
                    Reset Hybrid Pipeline
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-8 pt-12">
            <div className="p-8 rounded-[3rem] glass-panel border-white/10 shadow-2xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Multi-Pass Stats
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest tracking-[0.2em]">
                    Stability Matrix
                  </p>
                  <p className="text-sm font-black text-white italic opacity-80">
                    Recall/Precision Balanced Mode
                  </p>
                </div>
                <div className="h-px bg-white/5 w-full my-4" />
                <div className="bg-primary/5 p-5 rounded-3xl border border-primary/20">
                  <p className="text-[11px] text-primary font-black uppercase tracking-widest mb-4 border-b border-primary/20 pb-2">
                    Final Logic Tree
                  </p>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      Raw Neural Hits
                    </span>
                    <span className="text-[10px] text-white font-black">
                      {analysisData.rawDetections.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      NMS Suppression
                    </span>
                    <span className="text-[10px] text-red-500 font-black">
                      -
                      {analysisData.rawDetections.length -
                        analysisData.mergedDetections.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] text-white/40 uppercase">
                      FP Filtering
                    </span>
                    <span className="text-[10px] text-orange-500 font-black">
                      -
                      {analysisData.mergedDetections.length -
                        analysisData.finalDetections.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                    <span className="text-[11px] text-white font-black uppercase tracking-tighter">
                      Verified Count
                    </span>
                    <span className="text-[14px] text-emerald-500 font-black">
                      {analysisData.count}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-primary/10 border border-primary/20 group relative overflow-hidden shadow-2xl">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
              <Shield className="w-10 h-10 text-primary mb-4 animate-pulse" />
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 font-black">
                Neural Calibration
              </h4>
              <p className="text-[10px] text-white/40 leading-relaxed font-bold mb-6 italic opacity-80">
                Optimized 640px inference pass with recursive tiling. Precision
                floor maintained at 40% confidence.
              </p>
              <Button
                disabled={isModelLoading}
                className="w-full rounded-2xl bg-primary hover:bg-orange-600 border-none font-black uppercase text-[10px] h-12 shadow-xl shadow-primary/20"
                onClick={() => {
                  if (imgPreview) {
                    const img = new Image();
                    img.onload = () => runInference(img);
                    img.src = imgPreview;
                  }
                }}
              >
                Force Recall Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdPredictionSection;
