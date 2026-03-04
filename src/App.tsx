/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calculator, BarChart3, Settings2, FunctionSquare } from 'lucide-react';
import { Footer } from './components/Footer';

type MathFunction = {
  id: string;
  name: string;
  f: (x: number) => number;
  F: (x: number) => number;
  tex: string;
};

const functions: MathFunction[] = [
  {
    id: 'parabola',
    name: 'Parábola',
    f: (x) => -0.15 * Math.pow(x - 5, 2) + 5,
    F: (x) => -0.05 * Math.pow(x - 5, 3) + 5 * x,
    tex: 'f(x) = -0.15(x-5)² + 5'
  },
  {
    id: 'sine',
    name: 'Onda Senoidal',
    f: (x) => 2 * Math.sin(x / 1.5) + 3,
    F: (x) => -3 * Math.cos(x / 1.5) + 3 * x,
    tex: 'f(x) = 2sin(x/1.5) + 3'
  },
  {
    id: 'exponential',
    name: 'Exponencial',
    f: (x) => 0.1 * Math.exp(0.4 * x) + 1,
    F: (x) => 0.25 * Math.exp(0.4 * x) + x,
    tex: 'f(x) = 0.1e^(0.4x) + 1'
  }
];

export default function App() {
  const [funcId, setFuncId] = useState('parabola');
  const [n, setN] = useState(4);
  const [method, setMethod] = useState<'left' | 'right' | 'midpoint' | 'trapezoid'>('left');
  const [a, setA] = useState(1);
  const [b, setB] = useState(8);
  const [showExact, setShowExact] = useState(true);

  const activeFunc = functions.find(f => f.id === funcId) || functions[0];

  const xMin = 0;
  const xMax = 10;
  const yMin = 0;
  const yMax = 6;

  const width = 800;
  const height = 500;
  const padding = { top: 40, right: 40, bottom: 40, left: 40 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const mapX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * innerWidth;
  const mapY = (y: number) => height - padding.bottom - ((y - yMin) / (yMax - yMin)) * innerHeight;

  const handleAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val < b) setA(val);
  };

  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val > a) setB(val);
  };

  const { exactArea, approxArea, rects, curvePath, areaPath, xTicks, yTicks } = useMemo(() => {
    const exactArea = activeFunc.F(b) - activeFunc.F(a);
    
    const dx = (b - a) / n;
    let approxArea = 0;
    const rects = [];

    for (let i = 0; i < n; i++) {
      const x0 = a + i * dx;
      const x1 = x0 + dx;
      
      if (method === 'trapezoid') {
        const y0 = activeFunc.f(x0);
        const y1 = activeFunc.f(x1);
        approxArea += ((y0 + y1) / 2) * dx;
        
        rects.push({
          type: 'polygon',
          points: `${mapX(x0)},${mapY(0)} ${mapX(x0)},${mapY(y0)} ${mapX(x1)},${mapY(y1)} ${mapX(x1)},${mapY(0)}`,
        });
      } else {
        let y = 0;
        if (method === 'left') y = activeFunc.f(x0);
        else if (method === 'right') y = activeFunc.f(x1);
        else if (method === 'midpoint') y = activeFunc.f(x0 + dx / 2);
        
        approxArea += y * dx;
        
        rects.push({
          type: 'rect',
          x: mapX(x0),
          y: mapY(y),
          width: mapX(x1) - mapX(x0),
          height: mapY(0) - mapY(y)
        });
      }
    }

    const curvePoints = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      curvePoints.push(`${mapX(x)},${mapY(activeFunc.f(x))}`);
    }
    const curvePath = `M ${curvePoints.join(' L ')}`;

    const areaPoints = [`${mapX(a)},${mapY(0)}`];
    for (let x = a; x <= b; x += 0.05) {
      areaPoints.push(`${mapX(x)},${mapY(activeFunc.f(x))}`);
    }
    areaPoints.push(`${mapX(b)},${mapY(0)}`);
    const areaPath = `M ${areaPoints.join(' L ')} Z`;

    const xTicks = Array.from({length: xMax - xMin + 1}, (_, i) => i + xMin);
    const yTicks = Array.from({length: yMax - yMin + 1}, (_, i) => i + yMin);

    return { exactArea, approxArea, rects, curvePath, areaPath, xTicks, yTicks };
  }, [activeFunc, a, b, n, method]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 p-6 pb-28 flex flex-col gap-8 h-screen overflow-y-auto shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FunctionSquare className="w-6 h-6 text-blue-600" />
            Sumas de Riemann
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Visualiza cómo la suma de áreas de rectángulos aproxima la integral definida.
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Function */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Función f(x)
            </label>
            <select 
              value={funcId}
              onChange={(e) => setFuncId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              {functions.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono text-center">
              {activeFunc.tex}
            </div>
          </div>

          {/* Method */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Método de aproximación</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'left', label: 'Izquierda' },
                { id: 'right', label: 'Derecha' },
                { id: 'midpoint', label: 'Punto Medio' },
                { id: 'trapezoid', label: 'Trapecios' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    method === m.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* N Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Particiones (N)</label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{n}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="200" 
              value={n} 
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1</span>
              <span>200</span>
            </div>
          </div>

          {/* A and B Sliders */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Límite inferior (A)</label>
                <span className="text-sm font-bold text-slate-900">{a.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={b - 0.5} 
                step="0.5"
                value={a} 
                onChange={handleAChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Límite superior (B)</label>
                <span className="text-sm font-bold text-slate-900">{b.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min={a + 0.5} 
                max="10" 
                step="0.5"
                value={b} 
                onChange={handleBChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                <BarChart3 className="w-4 h-4 text-slate-400" /> Área Exacta
              </span>
              <span className="font-mono font-semibold text-slate-900">{exactArea.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                <Calculator className="w-4 h-4 text-blue-500" /> Área Aproximada
              </span>
              <span className="font-mono font-semibold text-blue-600">{approxArea.toFixed(4)}</span>
            </div>
            <div className="h-px bg-slate-200 w-full my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 font-medium">Error Absoluto</span>
              <span className="font-mono font-semibold text-red-500">{Math.abs(exactArea - approxArea).toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-6 pb-28 md:p-12 md:pb-32 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-8 relative">
          
          {/* Toggle Exact Area */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
            <label className="flex items-center gap-2 cursor-pointer bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={showExact} 
                onChange={(e) => setShowExact(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">Mostrar área exacta</span>
            </label>
          </div>

          <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-sm">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
              <pattern id="grid" width={innerWidth / (xMax - xMin)} height={innerHeight / (yMax - yMin)} patternUnits="userSpaceOnUse">
                <path d={`M ${innerWidth / (xMax - xMin)} 0 L 0 0 0 ${innerHeight / (yMax - yMin)}`} fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid Background */}
            <rect x={padding.left} y={padding.top} width={innerWidth} height={innerHeight} fill="url(#grid)" />

            {/* Axes */}
            <line x1={mapX(xMin)} y1={mapY(0)} x2={mapX(xMax)} y2={mapY(0)} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1={mapX(0)} y1={mapY(yMin)} x2={mapX(0)} y2={mapY(yMax)} stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

            {/* X Axis Labels */}
            {xTicks.map(x => (
              <text key={`tx-${x}`} x={mapX(x)} y={mapY(0) + 20} textAnchor="middle" className="text-[11px] fill-slate-500 font-mono font-medium">
                {x}
              </text>
            ))}
            {/* Y Axis Labels */}
            {yTicks.map(y => (
              y > 0 && <text key={`ty-${y}`} x={mapX(0) - 12} y={mapY(y) + 4} textAnchor="end" className="text-[11px] fill-slate-500 font-mono font-medium">
                {y}
              </text>
            ))}

            {/* Exact Area Highlight */}
            {showExact && (
              <path d={areaPath} fill="url(#areaGradient)" className="transition-all duration-500" />
            )}

            {/* Rectangles / Trapezoids */}
            <g className="transition-all duration-300">
              {rects.map((rect, i) => (
                rect.type === 'rect' ? (
                  <rect 
                    key={`rect-${i}`}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="rgba(239, 68, 68, 0.8)"
                    strokeWidth="1.5"
                    className="transition-all duration-300 ease-out hover:fill-red-500/30"
                  />
                ) : (
                  <polygon 
                    key={`trap-${i}`}
                    points={rect.points}
                    fill="rgba(249, 115, 22, 0.15)"
                    stroke="rgba(249, 115, 22, 0.8)"
                    strokeWidth="1.5"
                    className="transition-all duration-300 ease-out hover:fill-orange-500/30"
                  />
                )
              ))}
            </g>

            {/* Function Curve */}
            <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />

            {/* A and B markers */}
            <g className="opacity-80">
              <line x1={mapX(a)} y1={mapY(0)} x2={mapX(a)} y2={mapY(activeFunc.f(a))} stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1={mapX(b)} y1={mapY(0)} x2={mapX(b)} y2={mapY(activeFunc.f(b))} stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 4" />
              
              <circle cx={mapX(a)} cy={mapY(0)} r="4" fill="#0f172a" className="drop-shadow-sm" />
              <text x={mapX(a)} y={mapY(-0.4)} textAnchor="middle" className="text-[13px] font-bold fill-slate-800">A</text>
              
              <circle cx={mapX(b)} cy={mapY(0)} r="4" fill="#0f172a" className="drop-shadow-sm" />
              <text x={mapX(b)} y={mapY(-0.4)} textAnchor="middle" className="text-[13px] font-bold fill-slate-800">B</text>
            </g>
          </svg>
          
          {/* Equation Label */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="font-mono text-sm text-slate-700 font-medium">
              ∫<sub className="text-[10px]">{a.toFixed(1)}</sub><sup className="text-[10px]">{b.toFixed(1)}</sup> f(x) dx ≈ Σ f(x_i) Δx
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

