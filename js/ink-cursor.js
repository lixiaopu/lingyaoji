/**
 * 玄缘阁 · 全屏水墨鼠标交互特效
 *
 * 1. 鼠标移动时绘制淡墨毛笔拖尾，0.5~1 秒内自然消散。
 * 2. 鼠标点击时生成水墨晕开粒子动画。
 * 3. 使用 requestAnimationFrame 循环，粒子透明度为 0 时及时清理。
 */

(function () {
  const canvas = document.getElementById("ink-cursor");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // 墨迹点：记录位置、年龄、笔触粗细
  const points = [];
  const MAX_POINTS = 240;
  const MAX_AGE = 55; // ~0.9s @60fps

  // 水墨晕开效果集合
  const splashes = [];

  // 初始化 Canvas 尺寸
  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    // 以 CSS 像素为单位绘制，自动适配高分屏
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // 清空画布（清除实际像素区域，不受当前变换影响）
  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // 在两点之间插值补点，让快速移动时轨迹也不断开
  function addPoint(x, y) {
    const last = points[points.length - 1];
    if (!last) {
      points.push({ x, y, age: 0, size: brushSize(0) });
      return;
    }

    const dx = x - last.x;
    const dy = y - last.y;
    const dist = Math.hypot(dx, dy);
    const step = 4;

    for (let i = 0; i < dist; i += step) {
      const t = i / dist;
      points.push({
        x: last.x + dx * t,
        y: last.y + dy * t,
        age: 0,
        size: brushSize(dist)
      });
    }
    points.push({ x, y, age: 0, size: brushSize(dist) });

    // 限制总点数，避免内存与绘制压力
    if (points.length > MAX_POINTS) {
      points.splice(0, points.length - MAX_POINTS);
    }
  }

  // 笔触粗细：移动越快，笔触越细，模拟毛笔提按
  function brushSize(dist) {
    const base = 4.5;
    const speedFactor = Math.min(dist / 12, 2.2);
    return Math.max(1.4, base - speedFactor + Math.random() * 0.4);
  }

  // 绘制毛笔拖尾：每段独立透明度，营造淡出拖尾
  function drawTrail() {
    if (points.length < 2) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const age = Math.max(p1.age, p2.age);
      const life = 1 - age / MAX_AGE;
      if (life <= 0) continue;

      const alpha = life * 0.38;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineWidth = (p1.size + p2.size) / 2;
      ctx.strokeStyle = `rgba(24, 24, 24, ${alpha})`;
      // 水墨扩散：外缘淡墨晕染
      ctx.shadowBlur = 10 * life;
      ctx.shadowColor = `rgba(24, 24, 24, ${alpha * 0.45})`;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }

  function updateTrail() {
    for (let i = 0; i < points.length; i++) {
      points[i].age++;
    }
    // 移除过老的点
    let firstAlive = 0;
    while (firstAlive < points.length && points[firstAlive].age > MAX_AGE) {
      firstAlive++;
    }
    if (firstAlive > 0) {
      points.splice(0, firstAlive);
    }
  }

  // 点击生成水墨晕开
  function createSplash(x, y) {
    const droplets = [];
    const count = 10 + Math.floor(Math.random() * 8);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 2.2;
      droplets.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        age: 0,
        maxAge: 35 + Math.floor(Math.random() * 25)
      });
    }

    splashes.push({
      x,
      y,
      age: 0,
      maxAge: 55,
      radius: 0,
      droplets
    });
  }

  function drawSplashes() {
    for (const splash of splashes) {
      const life = 1 - splash.age / splash.maxAge;
      if (life <= 0) continue;

      // 中心墨晕：不规则的 radial gradient
      const r = splash.radius;
      const grad = ctx.createRadialGradient(splash.x, splash.y, 0, splash.x, splash.y, r);
      grad.addColorStop(0, `rgba(24,24,24,${0.28 * life})`);
      grad.addColorStop(0.55, `rgba(24,24,24,${0.12 * life})`);
      grad.addColorStop(1, `rgba(24,24,24,0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(splash.x, splash.y, r, 0, Math.PI * 2);
      ctx.fill();

      // 叠加几个不规则墨点，让边缘更有宣纸晕染感
      ctx.fillStyle = `rgba(24,24,24,${0.08 * life})`;
      for (let k = 0; k < 3; k++) {
        const ox = Math.cos(k * 2.1) * r * 0.35;
        const oy = Math.sin(k * 2.1) * r * 0.35;
        ctx.beginPath();
        ctx.arc(splash.x + ox, splash.y + oy, r * (0.45 + Math.random() * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

      // 溅射墨滴
      for (const d of splash.droplets) {
        const dLife = 1 - d.age / d.maxAge;
        if (dLife <= 0) continue;
        ctx.fillStyle = `rgba(24,24,24,${0.35 * dLife})`;
        ctx.beginPath();
        ctx.arc(splash.x + d.x, splash.y + d.y, d.size * dLife, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function updateSplashes() {
    for (const splash of splashes) {
      splash.age++;
      splash.radius += 0.85;

      for (const d of splash.droplets) {
        d.age++;
        d.x += d.vx;
        d.y += d.vy;
        // 墨滴受纸面阻力减速
        d.vx *= 0.96;
        d.vy *= 0.96;
        d.size *= 0.985;
      }
    }

    // 移除已经完全透明的 splash
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      if (s.age > s.maxAge) {
        splashes.splice(i, 1);
        continue;
      }
      // 如果所有墨滴都消失，也可以提前移除
      const allDead = s.droplets.every((d) => d.age > d.maxAge);
      if (allDead && s.age > s.maxAge * 0.7) {
        splashes.splice(i, 1);
      }
    }
  }

  // 事件监听
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    addPoint(e.clientX, e.clientY);
  });

  window.addEventListener("mousedown", (e) => {
    createSplash(e.clientX, e.clientY);
  });

  // 移动端也做简单支持
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    addPoint(t.clientX, t.clientY);
  }, { passive: true });

  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    createSplash(t.clientX, t.clientY);
  }, { passive: true });

  // 动画循环
  function animate() {
    clearCanvas();
    updateTrail();
    drawTrail();
    updateSplashes();
    drawSplashes();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
})();
