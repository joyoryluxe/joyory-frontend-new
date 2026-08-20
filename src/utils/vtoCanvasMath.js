// Landmark indices
export const LIP_OUTER = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
export const LIP_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
export const LEYE_UPPER = [33, 246, 161, 160, 159, 158, 157, 173, 133];
export const REYE_UPPER = [263, 466, 388, 387, 386, 385, 384, 398, 362];
export const LEYE_LOWER = [133, 155, 154, 153, 145, 144, 163, 7, 33];
export const REYE_LOWER = [362, 382, 381, 380, 374, 373, 390, 249, 263];

export const LBROW_TOP = [70, 63, 105, 66, 107];
export const LBROW_BOT = [46, 53, 52, 65, 55];
export const RBROW_TOP = [336, 296, 334, 293, 300];
export const RBROW_BOT = [276, 283, 282, 295, 285];
export const LBROW = [...LBROW_TOP, ...[...LBROW_BOT].reverse()];
export const RBROW = [...RBROW_TOP, ...[...RBROW_BOT].reverse()];

export const FACE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

export const LCHECK = [117, 118, 119, 120, 121, 123, 147, 213, 192, 234];
export const RCHECK = [346, 347, 348, 349, 350, 352, 376, 433, 416, 454];

export function pt(lms, i, w, h) {
    return { x: lms[i].x * w, y: lms[i].y * h };
}

export function hexRgb(h) {
    if (!h || h === 'none') return [0, 0, 0];
    const c = h.replace('#', '');
    return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
}

export function catmullSmooth(pts, steps = 14) {
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
    out.push(pts[pts.length - 1]);
    return out;
}

export function drawBrow(ctx, lms, browI, color, alpha, style, thickMul, w, h) {
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

export function drawBlush(ctx, lms, checkI, color, alpha, w, h) {
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

export function drawEyeliner(ctx, lms, eyeUpperI, eyeLowerI, color, alpha, style, placement, w, h) {
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

export function drawLips(ctx, lms, color, alpha, w, h) {
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

export function drawFoundation(ctx, lms, color, alpha, w, h) {
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

export function applyMakeup(ctx, lms, w, h, S) {
    if (S.fOn) drawFoundation(ctx, lms, S.foundC, S.fOp, w, h);
    if (S.blushC) { drawBlush(ctx, lms, LCHECK, S.blushC, S.blushOp, w, h); drawBlush(ctx, lms, RCHECK, S.blushC, S.blushOp, w, h); }
    drawBrow(ctx, lms, LBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
    drawBrow(ctx, lms, RBROW, S.browC, S.browOp, S.browStyle, S.browThick, w, h);
    drawEyeliner(ctx, lms, LEYE_UPPER, LEYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
    drawEyeliner(ctx, lms, REYE_UPPER, REYE_LOWER, S.linerC, S.linerOp, S.linerStyle, S.linerPlacement, w, h);
    drawLips(ctx, lms, S.lipC, S.lOp, w, h);
}

export function applyAdaptiveSmoothing(newLms, prevLms, w, h) {
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
