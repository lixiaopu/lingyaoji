/**
 * 灵爻集 · 全屏水墨墨滴晕开特效
 *
 * 点击页面任意位置生成水墨晕染（Ink Blot）粒子动画：
 * 从中心向外扩散，边缘带有宣纸般的毛糙感，随后渐隐消散。
 * 使用 requestAnimationFrame 循环，透明度为 0 时及时清理。
 */

(function () {
  const canvas = document.getElementById("ink-cursor");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // 当前所有未消散的水墨晕开
  const splashes = [];

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // 生成一个不规则水墨团：由多个重叠圆组成，模拟真实墨滴边缘
  function buildBlotShape(radius) {
    const blobs = [];

    // 中心浓墨
    blobs.push({ ox: 0, oy: 0, r: radius, a: 0.92 });

    // 内部纹理：让墨团不那么均匀
    const innerCount = 6 + Math.floor(Math.random() * 5);
    for (let i = 0; i < innerCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 0.55;
      blobs.push({
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        r: radius * (0.35 + Math.random() * 0.35),
        a: 0.32 + Math.random() * 0.22
      });
    }

    // 边缘毛糙：大量小圆点让外圈产生宣纸晕染感
    const edgeCount = 34 + Math.floor(Math.random() * 18);
    for (let i = 0; i < edgeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = radius * (0.5 + Math.random() * 0.7);
      blobs.push({
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        r: radius * (0.25 + Math.random() * 0.45),
        a: 0.1 + Math.random() * 0.12
      });
    }

    return blobs;
  }

  // 点击时创建一次水墨晕开
  function createSplash(x, y) {
    const maxRadius = 55 + Math.random() * 28;

    // 主墨团
    const mainBlot = {
      ox: 0,
      oy: 0,
      maxR: maxRadius,
      blobs: buildBlotShape(maxRadius)
    };

    // 伴随的小墨团（类似参考图中下方的小墨滴）
    const satelliteCount = Math.random() > 0.35 ? 1 : 2;
    const satellites = [];
    for (let i = 0; i < satelliteCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = maxRadius * (0.8 + Math.random() * 0.9);
      const sr = maxRadius * (0.35 + Math.random() * 0.25);
      satellites.push({
        ox: Math.cos(angle) * dist,
        oy: Math.sin(angle) * dist,
        maxR: sr,
        blobs: buildBlotShape(sr)
      });
    }

    // 少量溅射粒子，向外轻微飞散
    const spatters = [];
    const spatterCount = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < spatterCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.6;
      spatters.push({
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 3,
        age: 0,
        maxAge: 30 + Math.floor(Math.random() * 20)
      });
    }

    splashes.push({
      x,
      y,
      age: 0,
      maxAge: 90 + Math.floor(Math.random() * 30),
      radius: 0,
      mainBlot,
      satellites,
      spatters
    });
  }

  function drawBlot(blot, cx, cy, scale, life) {
    for (const b of blot.blobs) {
      const bx = cx + blot.ox * scale + b.ox * scale;
      const by = cy + blot.oy * scale + b.oy * scale;
      const br = b.r * scale;
      const alpha = b.a * life;
      if (alpha <= 0) continue;

      // 用径向渐变让边缘自然淡出
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, `rgba(24,24,24,${alpha})`);
      grad.addColorStop(0.65, `rgba(24,24,24,${alpha * 0.55})`);
      grad.addColorStop(1, "rgba(24,24,24,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSplashes() {
    for (const s of splashes) {
      const life = 1 - s.age / s.maxAge;
      if (life <= 0) continue;

      // 整体向外晕染扩散，但速度逐渐减慢
      const expand = Math.sin((s.age / s.maxAge) * Math.PI * 0.5);
      const scale = 0.35 + expand * 0.95;

      // 主墨团
      drawBlot(s.mainBlot, s.x, s.y, scale, life);

      // 伴随小墨团
      for (const sat of s.satellites) {
        drawBlot(sat, s.x, s.y, scale, life);
      }

      // 溅射墨点
      for (const p of s.spatters) {
        const pLife = 1 - p.age / p.maxAge;
        if (pLife <= 0) continue;
        const px = s.x + p.x;
        const py = s.y + p.y;
        ctx.fillStyle = `rgba(24,24,24,${0.35 * pLife * life})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * pLife, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function updateSplashes() {
    for (const s of splashes) {
      s.age++;

      for (const p of s.spatters) {
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.size *= 0.985;
      }
    }

    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      if (s.age > s.maxAge) {
        splashes.splice(i, 1);
      }
    }
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousedown", (e) => {
    createSplash(e.clientX, e.clientY);
  });

  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    createSplash(t.clientX, t.clientY);
  }, { passive: true });

  function animate() {
    clearCanvas();
    updateSplashes();
    drawSplashes();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();
