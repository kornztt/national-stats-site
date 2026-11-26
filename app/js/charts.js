// 手写 SVG 图表：折线、柱状、横向条形、环形。全部用内联 SVG，不依赖任何库。
var CHART_COLORS = ["#c8402a", "#1f4e79", "#2a7f6f", "#c9a227", "#7a5c9e", "#4a6fa5", "#8a8d93", "#d97b29"];

function escText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 折线图：points 是 [{x: 标签, v: 数值}]，opts: {w, h, unit, color, ymin}
function lineChart(points, opts) {
  var w = opts.w || 560, h = opts.h || 260, padL = 52, padR = 14, padT = 18, padB = 30;
  var color = opts.color || "#c8402a";
  var vals = points.map(function (p) { return p.v; });
  var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
  var lo = opts.ymin != null ? opts.ymin : Math.max(0, min - (max - min) * 0.15);
  var hi = max + (max - min) * 0.12;
  var iw = w - padL - padR, ih = h - padT - padB;
  function X(i) { return padL + (points.length === 1 ? iw / 2 : (iw * i) / (points.length - 1)); }
  function Y(v) { return padT + ih - ((v - lo) / (hi - lo)) * ih; }
  var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="折线图">';
  var ticks = 4, t;
  for (t = 0; t <= ticks; t++) {
    var tv = lo + ((hi - lo) * t) / ticks, ty = Y(tv);
    s += '<line x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + ty.toFixed(1) + '" stroke="#e3e0d8" stroke-width="1"/>';
    s += '<text x="' + (padL - 6) + '" y="' + (ty + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b7280">' + tv.toFixed(0) + '</text>';
  }
  s += '<line x1="' + padL + '" y1="' + (padT + ih) + '" x2="' + (w - padR) + '" y2="' + (padT + ih) + '" stroke="#9aa0a6" stroke-width="1"/>';
  var path = points.map(function (p, i) { return (i === 0 ? "M" : "L") + X(i).toFixed(1) + "," + Y(p.v).toFixed(1); }).join(" ");
  s += '<path d="' + path + ' ' + X(points.length - 1).toFixed(1) + ',' + (padT + ih) + ' L' + X(0).toFixed(1) + ',' + (padT + ih) + ' Z" fill="' + color + '" fill-opacity="0.08"/>';
  s += '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>';
  points.forEach(function (p, i) {
    s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"/>';
    if (i % 2 === 0 || i === points.length - 1) {
      var label = p.v.toFixed(2).replace(/\.00$/, "");
      var lx = X(i), anchor = "middle";
      if (i === points.length - 1) { lx = w - 4; anchor = "end"; }
      s += '<text x="' + lx.toFixed(1) + '" y="' + (Y(p.v) - 9).toFixed(1) + '" text-anchor="' + anchor + '" font-size="11" font-weight="600" fill="#1f2a3a">' + label + '</text>';
    }
    s += '<text x="' + X(i).toFixed(1) + '" y="' + (padT + ih + 18) + '" text-anchor="middle" font-size="11" fill="#6b7280">' + escText(p.x) + '</text>';
  });
  if (opts.unit) s += '<text x="' + padL + '" y="12" font-size="11" fill="#6b7280">单位：' + escText(opts.unit) + '</text>';
  return s + "</svg>";
}

// 柱状图：bars 是 [{x: 标签, v: 数值}]
function barChart(bars, opts) {
  var w = opts.w || 560, h = opts.h || 260, padL = 52, padR = 14, padT = 22, padB = 30;
  var vals = bars.map(function (b) { return b.v; });
  var max = Math.max.apply(null, vals);
  var hi = max * 1.15;
  var iw = w - padL - padR, ih = h - padT - padB;
  var slot = iw / bars.length, bw = Math.min(46, slot * 0.62);
  var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="柱状图">';
  var ticks = 4, t;
  for (t = 0; t <= ticks; t++) {
    var tv = (hi * t) / ticks, ty = padT + ih - (ih * t) / ticks;
    s += '<line x1="' + padL + '" y1="' + ty.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + ty.toFixed(1) + '" stroke="#e3e0d8" stroke-width="1"/>';
    s += '<text x="' + (padL - 6) + '" y="' + (ty + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b7280">' + tv.toFixed(0) + '</text>';
  }
  s += '<line x1="' + padL + '" y1="' + (padT + ih) + '" x2="' + (w - padR) + '" y2="' + (padT + ih) + '" stroke="#9aa0a6" stroke-width="1"/>';
  bars.forEach(function (b, i) {
    var bh = (ih * b.v) / hi;
    var x = padL + slot * i + (slot - bw) / 2;
    var y = padT + ih - bh;
    var c = (opts.colors && opts.colors[i % opts.colors.length]) || CHART_COLORS[i % CHART_COLORS.length];
    s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + c + '"/>';
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#1f2a3a">' + b.v.toFixed(2).replace(/\.00$/, "") + '</text>';
    s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (padT + ih + 18) + '" text-anchor="middle" font-size="11" fill="#6b7280">' + escText(b.x) + '</text>';
  });
  if (opts.unit) s += '<text x="' + padL + '" y="12" font-size="11" fill="#6b7280">单位：' + escText(opts.unit) + '</text>';
  return s + "</svg>";
}

// 横向条形图：rows 是 [{x: 标签, v: 数值}]，支持正负值（以 0 为中线）
function hbarChart(rows, opts) {
  var w = opts.w || 560, labelW = opts.labelW || 110, padR = 54, rowH = 30, padT = 8;
  var h = padT + rows.length * rowH + 14;
  var vals = rows.map(function (r) { return r.v; });
  var span = Math.max.apply(null, vals.map(function (v) { return Math.abs(v); })) * 1.15 || 1;
  var zeroX = labelW + ((w - labelW - padR) * (opts.centerZero ? 0.5 : 0));
  var scale = opts.centerZero ? (w - labelW - padR) / 2 / span : (w - labelW - padR) / span;
  var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="横向条形图">';
  rows.forEach(function (r, i) {
    var y = padT + i * rowH + 5;
    var bw = Math.abs(r.v) * scale;
    var x = opts.centerZero ? (r.v >= 0 ? zeroX : zeroX - bw) : labelW;
    var c = r.v >= 0 ? (opts.posColor || "#2a7f6f") : (opts.negColor || "#c8402a");
    s += '<text x="' + (labelW - 8) + '" y="' + (y + 13) + '" text-anchor="end" font-size="12" fill="#1f2a3a">' + escText(r.x) + '</text>';
    s += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + Math.max(bw, 2).toFixed(1) + '" height="18" rx="3" fill="' + c + '"/>';
    var lx = opts.centerZero ? (r.v >= 0 ? x + bw + 6 : x - 6) : x + bw + 6;
    var anchor = opts.centerZero && r.v < 0 ? "end" : "start";
    s += '<text x="' + lx.toFixed(1) + '" y="' + (y + 13) + '" text-anchor="' + anchor + '" font-size="12" font-weight="600" fill="#1f2a3a">' + (r.v > 0 ? "+" : "") + r.v.toFixed(1) + '%</text>';
  });
  if (opts.centerZero) s += '<line x1="' + zeroX + '" y1="' + padT + '" x2="' + zeroX + '" y2="' + (padT + rows.length * rowH) + '" stroke="#9aa0a6" stroke-width="1"/>';
  return s + "</svg>";
}

// 环形图：parts 是 [{name, share}]，share 为百分比
function donutChart(parts, opts) {
  var size = opts.size || 220, thick = opts.thick || 34;
  var r = (size - thick) / 2, cx = size / 2, cy = size / 2;
  var circ = 2 * Math.PI * r, offset = 0;
  var s = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="环形图">';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#eceae4" stroke-width="' + thick + '"/>';
  parts.forEach(function (p, i) {
    var len = (p.share / 100) * circ;
    var c = (opts.colors && opts.colors[i % opts.colors.length]) || CHART_COLORS[i % CHART_COLORS.length];
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + c + '" stroke-width="' + thick + '" stroke-dasharray="' + Math.max(len - 1.5, 0.5).toFixed(1) + ' ' + (circ - len + 1.5).toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
    offset += len;
  });
  s += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#1f2a3a">' + escText(opts.centerTop || "") + '</text>';
  s += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="12" fill="#6b7280">' + escText(opts.centerBottom || "") + '</text>';
  return s + "</svg>";
}

function legendRow(parts, colors) {
  return parts.map(function (p, i) {
    var c = (colors && colors[i % colors.length]) || CHART_COLORS[i % CHART_COLORS.length];
    return '<span class="legend-item"><i style="background:' + c + '"></i>' + escText(p.name) + ' ' + p.share + '%</span>';
  }).join("");
}
