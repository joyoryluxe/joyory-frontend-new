import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import {
  FaCamera, FaImage, FaDownload, FaChevronLeft, FaChevronRight,
  FaTimes, FaSpinner, FaHistory, FaCheckCircle, FaArrowLeft,
  FaHeart, FaRegHeart
} from 'react-icons/fa';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import '../styles/MainVirtualTryOn.css';

import Header from '../components/common/Header';
import { UserContext } from '../context/UserContext.jsx';
import axiosInstance from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import vtoHero from "../assets/Virtual-tryon-new.png";
import vtoFirst from '../assets/vto_new.png';
import vtoMobile from '../assets/vto_mobile.png';
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import joyoryLogo from "../assets/Logo.png";

// ── Landmark indices (unchanged) ──────────────────────────────
const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

const LBROW_TOP = [70, 63, 105, 66, 107];
const LBROW_BOT = [46, 53, 52, 65, 55];
const RBROW_TOP = [336, 296, 334, 293, 300];
const RBROW_BOT = [276, 283, 282, 295, 285];
const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

function pt(lms, i, w, h) { return { x: lms[i].x * w, y: lms[i].y * h }; }
function hexRgb(h) {
  if (!h || h === 'none') return [0, 0, 0];
  const c = h.replace('#', '');
  return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
}

function catmullSmooth(pts, steps = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push({
        x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      });
    }
  }
  out.push(pts[pts.length - 1]); return out;
}

function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
  if (!color || color === 'none') return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h;
  const ox = off.getContext('2d');
  const half = Math.floor(browI.length / 2);
  let tPts = browI.slice(0, half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
  let bPts = browI.slice(half).map(i => pt(lms, i, w, h)).sort((a, b) => a.x - b.x);
  let pts = [...tPts, ...bPts.reverse()];
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const scaleY = 0.90 + (thickMul * 0.45);
  const scaleX = 1.00 + (thickMul * 0.08);
  pts = pts.map(p => ({ x: cx + (p.x - cx) * scaleX, y: cy + (p.y - cy) * scaleY }));
  ox.beginPath();
  const last = pts[pts.length - 1];
  ox.moveTo((pts[0].x + last.x) / 2, (pts[0].y + last.y) / 2);
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
    ox.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  }
  ox.closePath();
  let opMul = 1.0, blurAmt = 1.6;
  if (style === 'feathered') { opMul = 0.60; blurAmt = 1.4; }
  else if (style === 'bold') { opMul = 0.95; blurAmt = 0.8; }
  else if (style === 'defined') { opMul = 0.85; blurAmt = 0.7; }
  else { opMul = 0.75; blurAmt = 1.8; }
  ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${blurAmt}px)`; ctx.globalAlpha = Math.min(alpha * opMul * 1.5, 0.95); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${blurAmt * 0.35}px)`; ctx.globalAlpha = alpha * opMul * 0.4; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
  if (!color || alpha <= 0) return;
  const pts = checkI.map(i => pt(lms, i, w, h));
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const faceL = pt(lms, 234, w, h), faceR = pt(lms, 454, w, h);
  const faceW = Math.max(Math.abs(faceR.x - faceL.x), 60);
  const isLeft = checkI.includes(234);
  const templePt = isLeft ? faceL : faceR;
  const sweepAngle = Math.atan2(templePt.y - cy, templePt.x - cx);
  const rx = faceW * 0.28, ry = faceW * 0.12;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h;
  const ox = off.getContext('2d');
  ox.save(); ox.translate(cx, cy); ox.rotate(sweepAngle);
  ox.filter = `blur(${rx * 0.20}px)`; ox.scale(1, ry / rx);
  const gr = ox.createRadialGradient(-rx * 0.15, 0, 0, 0, 0, rx);
  gr.addColorStop(0.00, `rgba(${r},${g},${b},${alpha * 1.8})`);
  gr.addColorStop(0.40, `rgba(${r},${g},${b},${alpha * 0.7})`);
  gr.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
  ox.fillStyle = gr; ox.beginPath(); ox.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ox.fill(); ox.restore();
  ox.globalCompositeOperation = 'destination-out'; ox.filter = 'blur(4px)';
  const eyeHole = (isLeft ? LEYE_LOWER : REYE_LOWER).map(i => pt(lms, i, w, h));
  ox.beginPath(); ox.ellipse(eyeHole[4].x, eyeHole[4].y - faceW * 0.015, faceW * 0.14, faceW * 0.06, 0, 0, Math.PI * 2); ox.fill();
  const luma = (0.299 * r + 0.587 * g + 0.114 * b);
  const isSuperDark = luma < 60;
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = isSuperDark ? 0.85 : 0.35; ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = isSuperDark ? 0.3 : 0.65; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
  if (!color || color === 'none' || style === 'none') return;
  const [r, g, b] = hexRgb(color);
  const isLeft = eyeUpperI.includes(33);
  const innerCorner = isLeft ? 133 : 362;
  let rawUp = eyeUpperI.map(i => pt(lms, i, w, h)), rawLo = eyeLowerI.map(i => pt(lms, i, w, h));
  if (eyeUpperI[0] !== innerCorner) rawUp.reverse();
  if (eyeLowerI[0] !== innerCorner) rawLo.reverse();
  const smUp = catmullSmooth(rawUp, 18), smLo = catmullSmooth(rawLo, 18);
  const allPts = [...smUp, ...smLo];
  const cx = allPts.reduce((s, p) => s + p.x, 0) / allPts.length, cy = allPts.reduce((s, p) => s + p.y, 0) / allPts.length;
  const eyeW = Math.sqrt(Math.pow(smUp[smUp.length - 1].x - smUp[0].x, 2) + Math.pow(smUp[smUp.length - 1].y - smUp[0].y, 2)) || 10;
  const SP = {
    thin: { th: 0.06, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: false },
    cat: { th: 0.09, wingLen: 0.17, wingLift: 0.14, lo: false, smoky: false, tight: false },
    medium: { th: 0.12, wingLen: 0.12, wingLift: 0.08, lo: false, smoky: false, tight: false },
    dramatic: { th: 0.20, wingLen: 0.32, wingLift: 0.25, lo: true, smoky: false, tight: false },
    smoky: { th: 0.20, wingLen: 0, wingLift: 0, lo: true, smoky: true, tight: false },
    tightline: { th: 0.03, wingLen: 0, wingLift: 0, lo: false, smoky: false, tight: true }
  };
  const sp = SP[style] || SP.thin;
  const linerThickMul = 1.0;
  const baseThick = Math.max(eyeW * sp.th * linerThickMul, 1.2);

  const drawLinerCurve = (curve, isUpper) => {
    const sn = curve.length;
    const pts = curve.map((p, i) => {
      const prev = curve[Math.max(0, i - 1)], next = curve[Math.min(sn - 1, i + 1)];
      const tx = next.x - prev.x, ty = next.y - prev.y;
      const len = Math.sqrt(tx * tx + ty * ty) || 1;
      const nx1 = -ty / len, ny1 = tx / len, nx2 = ty / len, ny2 = -tx / len;
      const d1 = (p.x + nx1 - cx) ** 2 + (p.y + ny1 - cy) ** 2, d2 = (p.x + nx2 - cx) ** 2 + (p.y + ny2 - cy) ** 2;
      const nx = d1 > d2 ? nx1 : nx2, ny = d1 > d2 ? ny1 : ny2;
      const t = i / (sn - 1);
      let tFct = isUpper ? (sp.smoky ? 0.1 + 0.9 * Math.pow(t, 0.8) : style === 'dramatic' ? 0.05 + 0.95 * Math.pow(t, 2.2) : style === 'cat' ? 0.05 + 0.95 * Math.pow(t, 1.5) : t < 0.25 ? Math.pow(t / 0.25, 1.5) : 1) : (sp.smoky ? 0.05 + 0.85 * t : style === 'dramatic' ? 0.02 + 0.55 * Math.pow(t, 1.5) : 0.02 + 0.4 * t);
      if (!isUpper && t > 0.85) tFct *= (1 - ((t - 0.85) / 0.15) * 0.9);
      const pxThick = baseThick * tFct * (isUpper ? 1 : 0.5);
      return { x: p.x + nx * pxThick, y: p.y + ny * pxThick, nx, ny };
    });
    const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
    ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
    curve.forEach((p, i) => i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y));
    if (isUpper && sp.wingLen > 0) {
      const lookIdx = Math.max(0, sn - 4);
      const wx = curve[sn - 1].x - curve[lookIdx].x, wy = curve[sn - 1].y - curve[lookIdx].y;
      const wLen = Math.sqrt(wx * wx + wy * wy) || 1, uX = wx / wLen, uY = wy / wLen;
      const outerTip = pts[sn - 1];
      const targetX = curve[sn - 1].x + uX * eyeW * sp.wingLen + outerTip.nx * eyeW * sp.wingLift;
      const targetY = curve[sn - 1].y + uY * eyeW * sp.wingLen + outerTip.ny * eyeW * sp.wingLift;
      const cpX = curve[sn - 1].x + uX * eyeW * sp.wingLen * 0.4, cpY = curve[sn - 1].y + uY * eyeW * sp.wingLen * 0.4;
      ox.quadraticCurveTo(cpX, cpY, targetX, targetY); ox.lineTo(outerTip.x, outerTip.y);
    }
    [...pts].reverse().forEach(p => ox.lineTo(p.x, p.y)); ox.closePath(); ox.fill();
    ctx.save();
    if (sp.smoky) {
      ctx.globalCompositeOperation = 'multiply'; ctx.filter = `blur(${baseThick * 1.5}px)`; ctx.globalAlpha = Math.min(alpha * 1.2, 0.9); ctx.drawImage(off, 0, 0);
      ctx.filter = `blur(${baseThick * 0.7}px)`; ctx.globalAlpha = Math.min(alpha * 0.8, 0.9); ctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.filter = `blur(${baseThick * 0.2}px)`; ctx.globalAlpha = alpha * 0.4; ctx.drawImage(off, 0, 0);
    } else {
      ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.2px)'; ctx.globalAlpha = Math.min(alpha * 1.2, 0.95); ctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'blur(0.4px)'; ctx.globalAlpha = alpha * 0.85; ctx.drawImage(off, 0, 0);
    }
    ctx.restore();
  };

  if (sp.tight) {
    ctx.save(); ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.lineWidth = Math.max(eyeW * 0.025, 1.2);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.filter = 'blur(0.6px)'; ctx.beginPath();
    smUp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
    if (placement === 'both' || placement === 'lower') drawLinerCurve(smLo, false);
    return;
  }
  if (placement === 'upper') { drawLinerCurve(smUp, true); if (sp.lo) drawLinerCurve(smLo, false); }
  else if (placement === 'lower') drawLinerCurve(smLo, false);
  else { drawLinerCurve(smUp, true); drawLinerCurve(smLo, false); }
}

function drawLips(ctx, lms, color, alpha, w, h) {
  if (!color || color === 'none') return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
  ox.beginPath();
  LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
  ox.closePath();
  [...LIP_INNER].reverse().forEach((id, i) => { const p = pt(lms, id, w, h); i === 0 ? ox.moveTo(p.x, p.y) : ox.lineTo(p.x, p.y); });
  ox.closePath();
  ox.fillStyle = `rgb(${r},${g},${b})`; ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(1.8px)'; ctx.globalAlpha = Math.min(alpha * 0.9, 0.85); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.globalAlpha = alpha * 0.35; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function drawFoundation(ctx, lms, color, alpha, w, h) {
  if (!color || color === 'none' || alpha <= 0) return;
  const [r, g, b] = hexRgb(color);
  const off = document.createElement('canvas'); off.width = w; off.height = h; const ox = off.getContext('2d');
  ox.filter = 'blur(10px)'; ox.fillStyle = `rgb(${r},${g},${b})`; ox.beginPath();
  FACE.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); });
  ox.closePath(); ox.fill();
  ox.globalCompositeOperation = 'destination-out'; ox.fillStyle = '#fff'; ox.filter = 'blur(3.5px)'; ox.beginPath();
  [...LEYE_UPPER, ...[...LEYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.beginPath();[...REYE_UPPER, ...[...REYE_LOWER].reverse()].forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.filter = 'blur(2px)'; ox.beginPath(); LIP_OUTER.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.filter = 'blur(5px)'; ox.globalAlpha = 0.9; ox.beginPath(); LBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ox.beginPath(); RBROW.forEach((id, i) => { const p = pt(lms, id, w, h); i ? ox.lineTo(p.x, p.y) : ox.moveTo(p.x, p.y); }); ox.closePath(); ox.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = Math.min(alpha * 0.95, 0.85); ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = alpha * 0.55; ctx.drawImage(off, 0, 0);
  ctx.restore();
}

function applyMakeup(ctx, lms, w, h, S) {
  if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
  if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
  drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
  drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
  drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
  drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
  drawLips(ctx, lms, S.lipC, S.lOp, w, h);
}

function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
  if (!prevLms) return newLms.map(p => ({ ...p }));
  let totalDist = 0;
  const anchors = [4, 152, 33, 263, 61, 291];
  anchors.forEach(idx => {
    const dx = (newLms[idx].x - prevLms[idx].x) * w;
    const dy = (newLms[idx].y - prevLms[idx].y) * h;
    totalDist += Math.sqrt(dx * dx + dy * dy);
  });
  const avgDist = totalDist / anchors.length;
  let dynFactor = 0.75;
  if (avgDist > 8) dynFactor = 0.0;
  else if (avgDist > 1) dynFactor = 0.75 * (1 - ((avgDist - 1) / 7));
  return newLms.map((p, i) => ({
    x: prevLms[i].x * dynFactor + p.x * (1 - dynFactor),
    y: prevLms[i].y * dynFactor + p.y * (1 - dynFactor),
    z: prevLms[i].z !== undefined ? (prevLms[i].z * dynFactor + p.z * (1 - dynFactor)) : p.z
  }));
}
// ─────────────────────────────────────────────────────────────────────────────

const MainVirtualTryon = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vtoStep, setVtoStep] = useState('landing');
  const [mode, setMode] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeShade, setActiveShade] = useState(null);
  const { user } = useContext(UserContext);
  const [activeShadeObj, setActiveShadeObj] = useState(null);
  const [wishlistData, setWishlistData] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [intensity, setIntensity] = useState(80);
  const [compareMode, setCompareMode] = useState(false);
  const [baPos, setBaPos] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Initializing...');

  const [vtoTypes, setVtoTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [shades, setShades] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingShades, setLoadingShades] = useState(false);

  // ── DYNAMIC LANDING IMAGES FROM BACKEND ─────────────────────────────
  const [landingImages, setLandingImages] = useState({
    heroBanner: null,
    cardBackground: null,
    phoneView: null,
    stepImages: []
  });
  const [_loadingLandingImages, setLoadingLandingImages] = useState(false);
  // ────────────────────────────────────────────────────────────────────

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [sidePanel, setSidePanel] = useState('types');
  const [uploadedImage, setUploadedImage] = useState(null);

  const S = useRef({
    lipC: 'none', lOp: 0.8,
    linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
    browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
    foundC: '#fce9d8', fOn: false, fOp: 0.18,
    blushC: null, blushOp: 0.8
  });
  const smoothedLms = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const cameraTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const cleanupVTOEngine = useCallback(() => {
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (err) {
        console.warn("Camera stop suppressed error:", err?.message || err);
      }
      cameraRef.current = null;
    }
    if (faceMeshRef.current) {
      const mesh = faceMeshRef.current;
      faceMeshRef.current = null;
      try {
        const closePromise = mesh.close();
        if (closePromise && typeof closePromise.catch === 'function') {
          closePromise.catch((err) => {
            console.warn("FaceMesh close promise suppressed:", err?.message || err);
          });
        }
      } catch (err) {
        console.warn("FaceMesh close suppressed error:", err?.message || err);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanupVTOEngine();
    };
  }, [cleanupVTOEngine]);

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const { data } = await axiosInstance.get("/api/user/wishlist");
        if (data.success) setWishlistData(data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
      }
    } catch (e) {
      console.error("Error fetching wishlist", e);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const isInWishlist = (pid, sku) => {
    if (!pid || !sku) return false;
    return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
  };

  const toggleWishlist = async (prod, shade) => {
    if (!prod || !shade) return toast.error("Select a shade first");
    const pid = prod._id;
    const sku = shade.sku || shade.variantSku || shade._id;
    if (!sku) return toast.error("Selected shade has no SKU");

    if (!user || user.guest) {
      toast.error("Please login to use wishlist");
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: pid, sku }));
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    try {
      const inWl = isInWishlist(pid, sku);
      if (inWl) {
        await axiosInstance.delete(`/api/user/wishlist/${pid}`, { data: { sku } });
        toast.success("Removed from wishlist!");
      } else {
        await axiosInstance.post(`/api/user/wishlist/${pid}`, { sku });
        toast.success("Added to wishlist!");
      }
      await fetchWishlistData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Wishlist error");
    }
  };

  const handleAddToCart = async () => {
    if (!activeProduct || !activeShadeObj) {
      toast.error("Please select a product and shade first.");
      return;
    }

    setAddingToCart(true);
    const sku = activeShadeObj.sku || activeShadeObj.variantSku || activeShadeObj._id;
    const pid = activeProduct._id;

    try {
      const payload = {
        productId: pid,
        variants: [{ variantSku: sku, quantity: 1 }]
      };

      const { data } = await axiosInstance.post("/api/user/cart/add", payload);
      if (!data.success) throw new Error(data.message || "Cart add failed");

      toast.success("Product added to cart!");
      // navigate("/cartpage");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add to cart");
      if (e.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const removeShade = () => {
    setActiveShade(null);
    setActiveShadeObj(null);

    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lipC = 'none'; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = 'none'; }
    else if (type.includes('found')) { S.current.foundC = 'none'; S.current.fOn = false; }
    else if (type.includes('blush')) { S.current.blushC = null; }
    else if (type.includes('brow')) { S.current.browC = 'none'; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => {
        try {
          if (isMountedRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: img });
          }
        } catch (e) {
          console.warn("FaceMesh send error suppressed:", e?.message || e);
        }
      };
      img.src = uploadedImage;
    }
  };

  const getShadeThumbnail = () => {
    if (activeShadeObj) {
      if (activeShadeObj.image) return activeShadeObj.image;
      if (activeShadeObj.images && activeShadeObj.images.length > 0) return activeShadeObj.images[0];
    }
    if (activeProduct) {
      if (activeProduct.image) return activeProduct.image;
      if (activeProduct.images && activeProduct.images.length > 0) return activeProduct.images[0];
    }
    return "https://via.placeholder.com/56";
  };
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await axios.get('https://beauty.joyory.com/api/vto/workflow');
        setVtoTypes(res.data.types || []);
      } catch (err) {
        console.error("Error fetching types", err);
      } finally {
        setLoadingTypes(false);
        setStatusMsg('Ready ✓');
      }
    };
    fetchTypes();
  }, []);

  // Load product directly from query parameters if present (supports both ID and slug)
  const queryProductId = searchParams.get('productId');
  const queryProductSlug = searchParams.get('productSlug');
  const querySku = searchParams.get('sku');
  const queryVtoType = searchParams.get('vtoType');

  useEffect(() => {
    const targetProductIdentifier = queryProductSlug || queryProductId;
    if (targetProductIdentifier) {
      console.log("[VTO DEBUG] loadProductFromQuery triggered. identifier:", targetProductIdentifier, "querySku:", querySku);
      const loadProductFromQuery = async () => {
        setStatusMsg('Loading your product...');
        setVtoStep('engine');
        setMode('live');
        setSidePanel('shades');
        setLoadingShades(true);
        try {
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(targetProductIdentifier);
          let product = null;
          let shadesList = [];

          if (isObjectId) {
            // Fetch shades and info for this specific product by ID
            const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${targetProductIdentifier}`);
            product = res.data.product;
            shadesList = product?.shades || [];
          } else {
            // Fetch product details by slug
            const res = await axiosInstance.get(`/api/user/products/${targetProductIdentifier}`);
            product = res.data;
            if (product) {
              // Map variants list to VTO shades format
              shadesList = (product.variants || product.shadeOptions || []).map(v => ({
                shadeName: v.shadeName || v.name || "Default",
                hex: v.hex || v.color,
                image: v.image || (v.images && v.images[0]) || product.image || (product.images && product.images[0]),
                sku: v.sku || v.variantSku || v._id,
                displayPrice: v.displayPrice || product.price,
                originalPrice: v.originalPrice || product.mrp || product.price
              }));
            }
          }

          console.log("[VTO DEBUG] fetched product:", product);
          if (product) {
            setActiveProduct(product);
            setShades(shadesList);

            // Determine VTO category type
            // const rawType = product.type || product.vtoType || (typeof product.category === 'object' ? product.category.name : product.category) || 'lipstick';

            const rawType = queryVtoType || product.vtoType || product.type || (typeof product.category === 'object' ? product.category.name : product.category) || 'lipstick';
            const normalizedType = rawType.toLowerCase();
            setActiveType(normalizedType);

            // Select active shade (either matching SKU or first available)
            let chosenShade = null;
            if (querySku) {
              chosenShade = shadesList.find(s => (s.sku === querySku || s.variantSku === querySku || s._id === querySku));
            }
            if (!chosenShade && shadesList.length > 0) {
              chosenShade = shadesList[0];
            }

            console.log("[VTO DEBUG] chosenShade determined:", chosenShade);
            if (chosenShade) {
              setActiveShade(chosenShade.sku || chosenShade._id || chosenShade.name);
              setActiveShadeObj(chosenShade);
              let hex = chosenShade.hex || chosenShade.color;
              if (hex) {
                if (!hex.startsWith('#')) hex = '#' + hex;
                const typeLower = normalizedType.toLowerCase();
                if (typeLower.includes('lip')) { S.current.lipC = hex; }
                else if (typeLower.includes('eye') && !typeLower.includes('brow')) { S.current.linerC = hex; }
                else if (typeLower.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
                else if (typeLower.includes('blush')) { S.current.blushC = hex; }
                else if (typeLower.includes('brow')) { S.current.browC = hex; }
              }
            }

            // Also fetch the product list for this category to keep sidebar working
            setLoadingProducts(true);
            const pRes = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${normalizedType}`);
            setProducts(pRes.data.products || []);
          }
        } catch (err) {
          console.error("Error loading direct VTO product", err);
          setStatusMsg('Error loading product');
        } finally {
          setLoadingShades(false);
          setLoadingProducts(false);
          setStatusMsg('Ready ✓');
        }
      };
      loadProductFromQuery();
    }
  }, [queryProductId, queryProductSlug, querySku]);

  // ── FETCH DYNAMIC LANDING IMAGES FROM BACKEND ───────────────────────
  useEffect(() => {
    const fetchLandingImages = async () => {
      setLoadingLandingImages(true);
      try {
        const res = await axios.get('https://beauty.joyory.com/api/vto/workflow?section=landing');
        const data = res.data;
        setLandingImages({
          heroBanner: data.heroBanner || data.landing?.heroBanner || null,
          cardBackground: data.cardBackground || data.landing?.cardBackground || null,
          phoneView: data.phoneView || data.landing?.phoneView || null,
          stepImages: data.stepImages || data.landing?.stepImages || []
        });
      } catch (err) {
        console.error("Error fetching landing images", err);
      } finally {
        setLoadingLandingImages(false);
      }
    };
    fetchLandingImages();
  }, []);

  // Track previous step to avoid scrolling on initial mount
  const prevStepRef = useRef(vtoStep);
  useEffect(() => {
    prevStepRef.current = vtoStep;
  }, [vtoStep]);

  // Prevent vertical scrolling on HTML/Body during the entire VTO flow
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      cleanupVTOEngine();
      setVtoStep('landing');
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [cleanupVTOEngine]);

  // Handle window resize in compare mode
  useEffect(() => {
    const handleResize = () => {
      if (compareMode && canvasRef.current && faceMeshRef.current && mode === 'photo' && uploadedImage) {
        const img = new Image();
        img.onload = async () => {
          try {
            if (isMountedRef.current && faceMeshRef.current) {
              await faceMeshRef.current.send({ image: img });
            }
          } catch (e) {
            console.warn("FaceMesh resize send error suppressed:", e?.message || e);
          }
        };
        img.src = uploadedImage;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [compareMode, mode, uploadedImage]);

  // Initialize MediaPipe FaceMesh
  useEffect(() => {
    if (vtoStep === 'engine') {
      let active = true;
      let localMesh = null;
      let localCamera = null;

      try {
        localMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        });
        localMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        localMesh.onResults((results) => {
          if (!active || !isMountedRef.current) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const videoWidth = results.image.width;
          const videoHeight = results.image.height;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            let lms = results.multiFaceLandmarks[0];
            if (mode === 'live') {
              lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
              smoothedLms.current = lms;
            }
            applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
          } else {
            if (mode === 'live') smoothedLms.current = null;
          }
        });

        faceMeshRef.current = localMesh;

        if (mode === 'live') {
          const initCam = () => {
            if (!active || !isMountedRef.current) return;
            if (webcamRef.current && webcamRef.current.video) {
              try {
                localCamera = new Camera(webcamRef.current.video, {
                  onFrame: async () => {
                    if (!active || !isMountedRef.current || !faceMeshRef.current || !webcamRef.current?.video) return;
                    try {
                      await faceMeshRef.current.send({ image: webcamRef.current.video });
                    } catch (frameErr) {
                      // Suppress frame processing errors during teardown/navigation
                    }
                  },
                  width: 640,
                  height: 480
                });
                localCamera.start();
                cameraRef.current = localCamera;
                if (active && isMountedRef.current) setStatusMsg('Live Mode Active');
              } catch (camErr) {
                console.warn("Camera init error:", camErr);
              }
            }
          };

          if (webcamRef.current && webcamRef.current.video) {
            initCam();
          } else {
            cameraTimeoutRef.current = setTimeout(() => {
              initCam();
            }, 1000);
          }
        }
      } catch (err) {
        console.error("FaceMesh initialization error", err);
      }

      return () => {
        active = false;
        if (cameraTimeoutRef.current) {
          clearTimeout(cameraTimeoutRef.current);
          cameraTimeoutRef.current = null;
        }
        if (cameraRef.current) {
          try { cameraRef.current.stop(); } catch (e) {}
          cameraRef.current = null;
        }
        if (localCamera) {
          try { localCamera.stop(); } catch (e) {}
        }
        if (faceMeshRef.current) {
          const mesh = faceMeshRef.current;
          faceMeshRef.current = null;
          try {
            const p = mesh.close();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch (e) {}
        }
        if (localMesh && localMesh !== faceMeshRef.current) {
          try {
            const p = localMesh.close();
            if (p && typeof p.catch === 'function') p.catch(() => {});
          } catch (e) {}
        }
      };
    } else {
      cleanupVTOEngine();
    }
  }, [vtoStep, mode, cleanupVTOEngine]);

  // Handle Photo Mode static analysis
  useEffect(() => {
    if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
      setStatusMsg('Processing Photo...');
      const img = new Image();
      img.onload = async () => {
        try {
          if (isMountedRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: img });
            if (isMountedRef.current) setStatusMsg('Photo Ready!');
          }
        } catch (e) {
          console.warn("Photo send error suppressed:", e?.message || e);
        }
      };
      img.src = uploadedImage;
    }
  }, [vtoStep, mode, uploadedImage]);

  const handleTypeSelect = async (type) => {
    setActiveType(type);
    setSidePanel('products');
    setLoadingProducts(true);
    try {
      const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?type=${type}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSelect = async (product) => {
    setActiveProduct(product);
    setSidePanel('shades');
    setLoadingShades(true);
    try {
      const res = await axios.get(`https://beauty.joyory.com/api/vto/workflow?productId=${product._id}`);
      setShades(res.data.product?.shades || []);
    } catch (err) {
      console.error("Error fetching shades", err);
    } finally {
      setLoadingShades(false);
    }
  };

  const applyShade = (shade) => {
    console.log("[VTO DEBUG] applyShade clicked:", shade);
    setActiveShade(shade.sku || shade._id || shade.name);
    setActiveShadeObj(shade);
    let hex = shade.hex || shade.color;
    if (!hex) return;
    if (!hex.startsWith('#')) hex = '#' + hex;

    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lipC = hex; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
    else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
    else if (type.includes('blush')) { S.current.blushC = hex; }
    else if (type.includes('brow')) { S.current.browC = hex; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => {
        try {
          if (isMountedRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: img });
          }
        } catch (e) {
          console.warn("FaceMesh applyShade send suppressed:", e?.message || e);
        }
      };
      img.src = uploadedImage;
    }
  };

  const handleIntensityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setIntensity(val);
    const alpha = val / 100;
    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lOp = alpha; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
    else if (type.includes('found')) { S.current.fOp = alpha; }
    else if (type.includes('blush')) { S.current.blushOp = alpha; }
    else if (type.includes('brow')) { S.current.browOp = alpha; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => {
        try {
          if (isMountedRef.current && faceMeshRef.current) {
            await faceMeshRef.current.send({ image: img });
          }
        } catch (e) {
          console.warn("FaceMesh handleIntensityChange send suppressed:", e?.message || e);
        }
      };
      img.src = uploadedImage;
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setMode('photo');
      setVtoStep('engine');
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'joyory-vto.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const labelFor = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCategoryIcon = (type) => {
    const t = (type || '').toLowerCase();

    // All categories use highly logical, luxury vector SVG icons
    let svgIcon = null;

    if (t.includes('lip') || t.includes('lipstick')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Lipstick base container */}
          <rect x="8" y="13" width="8" height="8" rx="1" stroke="currentColor" />
          {/* Inner silver tube collar */}
          <rect x="9.5" y="9" width="5" height="4" stroke="currentColor" />
          {/* Slanted lipstick body */}
          <path d="M9.5 9V6.5L12 4.5l2.5 1.5V9H9.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
          {/* Decorative stripe on base */}
          <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" />
        </svg>
      );
    } else if (t.includes('blush') || t.includes('cheek')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="5" stroke="currentColor" />
          <ellipse cx="12" cy="17" rx="6" ry="4" stroke="currentColor" />
          <ellipse cx="12" cy="17" rx="4" ry="2.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M19 8l1 1-1 1M5 9l1-1-1-1" strokeWidth="1" />
        </svg>
      );
    } else if (t.includes('eyeliner')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 13.5C16 11 19.5 11 22 13c-2-3-5.5-4.5-9-3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M4 20L15 9l2 2L6 22H4v-2z" fill="currentColor" fillOpacity="0.15" />
          <path d="M14 10l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L15.5 11.5" />
          <path d="M13.5 10.5l-1-1" strokeWidth="2" />
        </svg>
      );
    } else if (t.includes('eye') || t.includes('shadow') || t.includes('eyes')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
          <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <line x1="5" y1="20" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4.5" cy="20" r="1.2" fill="currentColor" />
          <circle cx="19.5" cy="20" r="1.2" fill="currentColor" />
        </svg>
      );
    } else if (t.includes('brow') || t.includes('eyebrow') || t.includes('brows')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13.5c3.5-3 8.5-4.5 13-2 2.5 1.4 4 3 5 4-1.5-2.5-4.5-4.5-8-4.5-4 0-7.5 1.5-10 2.5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
          <line x1="6" y1="18" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8l1.5-1.5a1 1 0 0 1 1.4 0v0a1 1 0 0 1 0 1.4L17.5 9.5" />
          <path d="M5 19l1.5-1.5" />
        </svg>
      );
    } else if (t.includes('found') || t.includes('face') || t.includes('concealer') || t.includes('foundation')) {
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="10" width="10" height="11" rx="2" stroke="currentColor" />
          <rect x="8.5" y="12" width="7" height="7" fill="currentColor" fillOpacity="0.25" stroke="none" />
          <path d="M10 10V7h4v3" />
          <path d="M14 6H9.5a1 1 0 0 0-1 1v1h3" />
          <path d="M19 12c0 1.6-1.3 3-3 3s-3-1.4-3-3c0-1.5 2-4.5 3-4.5s3 3 3 4.5z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
        </svg>
      );
    } else {
      // Fallback eyeshadow palette style
      svgIcon = (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" />
          <circle cx="7.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="8.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="7.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
          <circle cx="16.5" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    }

    return (
      <div
        className="vto-category-svg-wrapper"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "inherit"
        }}
      >
        {svgIcon}
      </div>
    );
  };

  const handleBaDragStart = (e) => {
    if (!compareMode) return;
    setIsDragging(true);
    handleBaDragCalc(e);
  };

  const handleBaDragEnd = () => {
    if (!compareMode) return;
    setIsDragging(false);
  };

  const handleBaDragMove = (e) => {
    if (!compareMode || !isDragging) return;
    handleBaDragCalc(e);
  };

  // FIXED: Use containerRef instead of e.currentTarget for accurate positioning
  const handleBaDragCalc = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
    } else {
      return;
    }
    let newPos = (clientX - rect.left) / rect.width;
    newPos = Math.max(0.05, Math.min(0.95, newPos));
    setBaPos(newPos);
  }, []);

  const goBackToLandingWithScroll = useCallback(() => {
    cleanupVTOEngine();
    setCompareMode(false);
    setMode(null);
    setActiveType(null);
    setActiveProduct(null);
    setActiveShade(null);
    setActiveShadeObj(null);
    setSidePanel('types');
    setSearchParams({}, { replace: true });
    setVtoStep('landing');
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  }, [cleanupVTOEngine, setSearchParams]);

  // Back button: go one step back in the instructions flow
  const handleInstrBack = useCallback(() => {
    goBackToLandingWithScroll();
  }, [goBackToLandingWithScroll]);

  // Close button: show confirmation dialog
  const handleInstrClose = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  // Confirm exit → navigate to VirtualTryon page
  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    cleanupVTOEngine();
    navigate('/Virtualtryon');
  }, [cleanupVTOEngine, navigate]);

  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  // Back button handler - exits compare mode but stays in engine
  const handleBackFromCompare = useCallback(() => {
    setCompareMode(false);
    setBaPos(0.5);
  }, []);

  const getImageSrc = (backendUrl, localFallback) => backendUrl || localFallback;

  return (
    <div className={`vto-main-wrapper d-flex ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
      <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>


        {/* LANDING CONTENT – only when step === 'landing' */}
        {vtoStep === 'landing' && (
          <div className="vto-landing-screen-integrated">

            {/* 🟢 FULL VIRTUALTRYON PAGE UNDERLAY */}
            <div className="vto-bg-content-underlay">
              <div className="virtualtryon-container pt-5 mt-2">
                <section className="hero-slider w-100">
                  <div className="position-relative w-100 h-100 mt-xl-4 mt-3 padding-left-rightss">
                    <img
                      src={vtoHero}
                      alt="Virtual Try-On"
                      className="slide-media pt-0"
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  </div>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works-section container mt-5" style={{ paddingBottom: '120px' }}>
                  <h2 className="section-title page-title-main-name mb-4 text-start">How It Works</h2>
                  <div className="row g-4">
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step1}
                        alt="Step 1"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>1</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Use the Live Camera, upload a photo, or select a model to begin.
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step2}
                        alt="Step 2"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>2</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Browse makeup categories and select the products you'd like to try on.
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <img
                        src={step3}
                        alt="Step 3"
                        className="step-image img-fluid w-100"
                      />
                      <h3 className="step-number page-title-main-name mt-3 fw-semibold" style={{ fontSize: '1rem', color: '#222' }}>
                        Step <span style={{ color: '#b5845a' }}>3</span>
                      </h3>
                      <p className="step-description page-title-main-name text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                        Use the slider to compare before and after to find your ideal combination.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Dark background overlay */}
            <div className="vto-bg-layer"></div>

            {/* 🟢 CENTERED MODAL CARD (looks exactly like second screenshot) */}
            <div className="vto-landing-card-container main-backe-2" id="main-backe-2">
              <div className="vto-landing-bg-box">
                <picture>
                  <source media="(max-width: 768px)" srcSet={vtoMobile} />
                  <img
                    src={getImageSrc(landingImages.cardBackground, vtoFirst)}
                    alt="VTO Background"
                    className="vto-bg-img img-fluid"
                  />
                </picture>

                {/* Close Button at top right of image */}
                <button
                  className="vto-landing-close-btn"
                  onClick={() => navigate(-1)}
                  aria-label="Close Virtual Try-On"
                >
                  <FaTimes />
                </button>

                {/* Centered Brand Overlay */}
                <div className="vto-landing-brand-overlay">
                  JOYORY
                </div>

                {/* Split Slider Line & Handle Overlay */}
                <div className="vto-landing-slider-line">
                  <div className="vto-landing-slider-handle">
                    <FaChevronLeft size={8} style={{ marginRight: '-1px' }} />
                    <FaChevronRight size={8} style={{ marginLeft: '-1px' }} />
                  </div>
                </div>
              </div>
              <div className="vto-landing-content-box">
                <h1 className="vto-title-landing">VIRTUAL TRY ON</h1>
                <p className="vto-subtitle-landing">
                  For the best Virtual Try-On experience, please use Safari on iOS and Chrome on Android.
                </p>
                <div className="vto-actions-landing">
                  <button
                    className="vto-btn-black"
                    onClick={() => {
                      window.history.pushState({ vto: true }, "");
                      setMode('live');
                      setVtoStep('engine');
                    }}
                  >
                    SELFIE MODE
                  </button>
                  <button
                    className="vto-btn-black"
                    onClick={() => { setMode('photo'); setVtoStep('instructions'); }}
                  >
                    UPLOAD PHOTO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENGINE – full screen below header, with hero background */}
        {vtoStep === 'engine' && (
          <div className='vto-engine-bg-wrapper' style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Dark overlay for readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              zIndex: 0
            }} />
            {/* The original engine workspace, now with transparent background */}
            <div className="vto-workspace" style={{ background: 'transparent', position: 'relative', zIndex: 1, flex: 1, display: 'flex', minHeight: 0 }}>
              {!compareMode && (
                <div className="vto-engine-sidebar">
                  {sidePanel === 'types' && (
                    <div className="vto-sidebar-items">
                      {loadingTypes ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        vtoTypes.map((type, i) => (
                          <div key={i} className={`vto-sidebar-item ${activeType === type ? 'active' : ''}`} onClick={() => handleTypeSelect(type)}>
                            <div className="vto-sidebar-icon-box">
                              {getCategoryIcon(type)}
                            </div>
                            <span className="vto-sidebar-label">{labelFor(type)}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}

                  {sidePanel === 'products' && (
                    <div className="vto-sidebar-items vto-sidebar-products">
                      <div className="vto-sidebar-item" onClick={() => { setActiveType(null); setProducts([]); setSidePanel('types'); }}>
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
                      </div>
                      {loadingProducts ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        (() => {
                          const activeProductIdx = products.findIndex(p => p._id === activeProduct?._id);
                          const visibleProducts = (activeProductIdx === -1 || activeProductIdx < 5)
                            ? products.slice(0, 5)
                            : [products[activeProductIdx], ...products.filter(p => p._id !== activeProduct?._id).slice(0, 4)];

                          return (
                            <>
                              {visibleProducts.map((p, i) => (
                                <div key={p._id || i} className={`vto-sidebar-item ${activeProduct?._id === p._id ? 'active' : ''}`} onClick={() => handleProductSelect(p)}>
                                  <div className="vto-sidebar-icon-box">
                                    <img src={p.image || "https://via.placeholder.com/56"} alt={p.name} className="vto-cat-thumb-img" style={{ borderRadius: '8px' }} />
                                  </div>
                                  <span className="vto-sidebar-label">{p.name || p.brand}</span>
                                </div>
                              ))}
                              {products.length > 0 && (
                                <div className="vto-sidebar-item vto-sidebar-more-item" onClick={() => navigate('/vto-products')}>
                                  <div
                                    className="vto-sidebar-icon-box d-flex align-items-center justify-content-center"
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.1)',
                                      border: '2px dashed rgba(255, 255, 255, 0.4)',
                                      color: '#fff',
                                      borderRadius: '8px'
                                    }}
                                  >
                                    <span style={{ fontSize: '24px', fontWeight: '300', marginTop: '-2px' }}>+</span>
                                  </div>
                                  <span className="vto-sidebar-label" style={{ opacity: 0.8 }}>More</span>
                                </div>
                              )}
                            </>
                          );
                        })()
                      }
                    </div>
                  )}

                  {sidePanel === 'shades' && (
                    <div className="vto-sidebar-items vto-sidebar-shades">
                      <div className="vto-sidebar-item" onClick={() => setSidePanel('products')}>
                        <div className="vto-sidebar-icon-box" style={{ background: 'transparent', border: 'none', color: '#fff' }}><FaChevronLeft size={24} /></div>
                      </div>
                      {loadingShades ? <div className="vto-spinner-wrap-small"><FaSpinner className="vto-spin" /></div> :
                        shades.map((shade, idx) => (
                          <div key={shade.sku || idx} className={`vto-sidebar-item ${activeShade === shade.sku || activeShade === shade.variantSku || activeShade === shade._id || activeShade === shade.name ? 'active' : ''}`} onClick={() => applyShade(shade)}>
                            <div className="vto-sidebar-shade-square" style={{ backgroundColor: (shade.hex && typeof shade.hex === 'string' && shade.hex.startsWith('#')) ? shade.hex : '#' + (shade.hex || shade.color || '000000') }} />
                            <span className="vto-sidebar-label">{shade.shadeName}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}

              <div
                ref={containerRef}
                className="vto-canvas-container"
                onMouseDown={compareMode ? handleBaDragStart : undefined}
                onMouseMove={compareMode ? handleBaDragMove : undefined}
                onMouseUp={compareMode ? handleBaDragEnd : undefined}
                onMouseLeave={compareMode ? handleBaDragEnd : undefined}
                onTouchStart={compareMode ? handleBaDragStart : undefined}
                onTouchMove={compareMode ? handleBaDragMove : undefined}
                onTouchEnd={compareMode ? handleBaDragEnd : undefined}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: compareMode ? (isDragging ? 'ew-resize' : 'col-resize') : 'default',
                  flex: 1,
                  minHeight: 0,
                  '--bottom-controls-pos': activeShadeObj ? '110px' : '30px',
                  '--bottom-controls-pos-mobile': activeShadeObj ? '100px' : '10px',
                  '--status-pos': activeShadeObj ? '110px' : '30px',
                  '--status-pos-mobile': activeShadeObj ? '100px' : '10px'
                }}
              >
                {/* BEFORE Layer – Original camera/image (no makeup) */}
                <div
                  className="vto-ba-before-layer"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 1,
                  }}
                >
                  {mode === 'live' && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                      }}
                      videoConstraints={{ facingMode: "user" }}
                    />
                  )}

                  {mode === 'photo' && uploadedImage && (
                    <img
                      ref={imageRef}
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </div>

                {/* AFTER Layer (Canvas with Makeup) – Clipped to show only right side */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 2,
                    clipPath: compareMode
                      ? `inset(0 0 0 ${baPos * 100}%)`
                      : 'none',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="vto-main-canvas"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: mode === 'live' ? 'scaleX(-1)' : 'none',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Compare Mode UI Overlay */}
                {compareMode && (
                  <>
                    {/* BEFORE / AFTER Labels */}
                    <div className="vto-compare-pills-container" style={{
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                      pointerEvents: 'none',
                    }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 18px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        marginTop: '15px'

                      }}>
                        BEFORE
                      </div>
                      <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        marginTop: '15px'

                      }}>
                        AFTER
                      </div>
                    </div>

                    {/* Back Button in Compare Mode */}
                    <button
                      onClick={handleBackFromCompare}
                      className="vto-compare-back-btn"
                      style={{
                        position: 'absolute',
                        top: '24px',
                        left: '12px',
                        zIndex: 15,
                        background: 'rgba(0,0,0,0.65)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.85)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.65)';
                      }}
                    >
                      <FaArrowLeft size={14} />
                      Back
                    </button>

                    {/* Divider Line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${baPos * 100}%`,
                        width: '3px',
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 0 12px rgba(0,0,0,0.5), 0 0 4px rgba(0,0,0,0.3)',
                        zIndex: 10,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Draggable Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${baPos * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 11,
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        border: '2px solid rgba(0,0,0,0.1)',
                      }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                          <div style={{ width: '3px', height: '16px', background: '#333', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Invisible wide drag strip for easy mobile touch */}
                    <div
                      onMouseDown={handleBaDragStart}
                      onTouchStart={handleBaDragStart}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${baPos * 100}%`,
                        width: '60px',
                        transform: 'translateX(-50%)',
                        zIndex: 12,
                        cursor: 'ew-resize',
                      }}
                    />
                  </>
                )}

                {!compareMode && <div className="vto-status" style={{ zIndex: 20 }}>{statusMsg}</div>}
              </div>

              {!compareMode && (
                <div className="vto-intensity-slider-wrap">
                  <div className="vto-slider-track-thin">
                    <input type="range" className="vto-vertical-slider-thin" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
                  </div>
                  <div className="vto-slider-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" />
                    </svg>
                  </div>
                </div>
              )}

              {/* {!compareMode && (
                <div className="vto-top-left-controls">
                  <button className="vto-back-btn-v2" onClick={goBackToLandingWithScroll} title="Go Back">
                    <FaChevronLeft />
                  </button>
                </div>
              )} */}

              {!compareMode && (
                <div className="vto-top-controls-v2">
                  <button className="vto-compare-btn" onClick={() => setCompareMode(true)}>COMPARE</button>
                  <button className="vto-close-btn-v2" onClick={goBackToLandingWithScroll}><FaTimes /></button>
                </div>
              )}

              <div className="vto-bottom-controls-v2">
                <button className="vto-download-btn-v2" onClick={downloadImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 15V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="white" />
                  </svg>
                </button>
              </div>
            </div>
            {(() => {
              console.log("[VTO DEBUG] Render block check - activeProduct:", activeProduct?.name, "activeShadeObj:", activeShadeObj?.shadeName);
              return null;
            })()}
            {activeShadeObj && activeProduct && (
              <div className="vto-shade-popup">
                <div className="vto-shade-popup-left">
                  <img className="vto-shade-popup-thumb" src={getShadeThumbnail()} alt={activeShadeObj.shadeName || activeProduct.name} />
                </div>
                <div className="vto-shade-popup-middle">
                  <div className="vto-shade-popup-product-name">{activeProduct.name}</div>
                  <div className="vto-shade-popup-shade-name">{activeShadeObj.shadeName}</div>
                  <div className="vto-shade-popup-price">
                    ₹{activeShadeObj.displayPrice || activeShadeObj.price || activeProduct.price}
                  </div>
                </div>
                <div className="vto-shade-popup-actions">
                  <button className="vto-shade-popup-btn vto-shade-popup-btn-clear" onClick={removeShade} title="Remove Shade">
                    <FaTimes />
                  </button>
                  <button
                    className={`vto-shade-popup-btn vto-shade-popup-btn-wishlist ${isInWishlist(activeProduct._id, activeShadeObj.sku || activeShadeObj.variantSku || activeShadeObj._id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(activeProduct, activeShadeObj)}
                    title="Wishlist"
                  >
                    {isInWishlist(activeProduct._id, activeShadeObj.sku || activeShadeObj.variantSku || activeShadeObj._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button className="vto-shade-popup-btn-buy" onClick={handleAddToCart} disabled={addingToCart}>
                    {addingToCart ? 'Adding...' : 'Add to Bag'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INSTRUCTIONS SCREEN – kept as a modal for consistency */}
        {vtoStep === 'instructions' && (
          <div className="vto-instructions-screen">
            <div className="vto-instr-card">
              {/* Confirm Exit Dialog */}
              {showExitConfirm && (
                <div className="vto-exit-confirm-overlay">
                  <div className="vto-exit-confirm-box">
                    <div className="vto-exit-confirm-icon">✕</div>
                    <h3 className="vto-exit-confirm-title">Leave Try-On?</h3>
                    <p className="vto-exit-confirm-msg">Are you sure you want to exit? Your current session will not be saved.</p>
                    <div className="vto-exit-confirm-actions">
                      <button className="vto-exit-btn-cancel" onClick={handleCancelExit}>Stay</button>
                      <button className="vto-exit-btn-confirm" onClick={handleConfirmExit}>Yes, Exit</button>
                    </div>
                  </div>
                </div>
              )}
              <div className="vto-instr-header">
                <button className="vto-instr-icon-btn vto-instr-back-btn" onClick={handleInstrBack} title="Go Back">
                  <FaChevronLeft />
                </button>
                <div className="vto-instr-brand">
                  <img src={joyoryLogo} alt="Joyory" className="vto-instr-logo" />
                </div>
                <button className="vto-instr-icon-btn vto-instr-close-btn" onClick={handleInstrClose} title="Exit">
                  <FaTimes />
                </button>
              </div>
              <div className="vto-instr-content">
                <h2 className="vto-instr-title">PHOTO INSTRUCTIONS</h2>
                <p className="vto-instr-subtitle">
                  For the best virtual try-on experience, please follow these simple guidelines when taking or selecting your photo.
                </p>
                <div className="vto-instr-list">
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p>Use a Photo that is of the face straight on.</p>
                  </div>
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <p>Make Sure Nothing Is Obstructing The Face.</p>
                  </div>
                  <div className="vto-instr-item">
                    <div className="vto-instr-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      </svg>
                    </div>
                    <p>Make Sure That The Lighting Is Not Too Dim Or Too Bright.</p>
                  </div>
                </div>
              </div>
              <div className="vto-instr-footer">
                <button className="vto-btn-black-rect" onClick={() => fileInputRef.current?.click()}>UPLOAD PHOTO</button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    const msg = error?.message || error?.toString() || '';
    if (msg.includes('SolutionWasm') || msg.includes('already deleted') || msg.includes('BindingError')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    const msg = error?.message || error?.toString() || '';
    if (msg.includes('SolutionWasm') || msg.includes('already deleted') || msg.includes('BindingError')) {
      console.warn("Suppressed SolutionWasm unmount error in ErrorBoundary:", error);
      return;
    }
    console.error("ErrorBoundary caught VTO error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', color: '#b91c1c', background: '#fff', zIndex: 10000, position: 'fixed', inset: 0, overflow: 'auto', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Something went wrong.</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>Please see the error details below:</p>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', border: '1px solid #e0e0e0', lineHeight: '1.5' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MainVirtualTryOnWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <MainVirtualTryon {...props} />
    </ErrorBoundary>
  );
}





