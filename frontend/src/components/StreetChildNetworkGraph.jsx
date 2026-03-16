import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const StreetChildNetworkGraph = () => {
  const canvasRef = useRef(null);
  const { t } = useLanguage();

  const graphData = {
    nodes: [
      // Children
      { id: 'C1', label: 'John Doe', type: 'child', color: '#3b82f6' },
      { id: 'C2', label: 'Samuel O.', type: 'child', color: '#3b82f6' },
      { id: 'C3', label: 'Aisha K.', type: 'child', color: '#3b82f6' },
      { id: 'C4', label: 'Mary W.', type: 'child', color: '#3b82f6' },
      
      // Group Leaders
      { id: 'L1', label: 'Mzee B.', type: 'leader', color: '#f59e0b' },
      
      // Locations
      { id: 'LOC1', label: 'Central Park', type: 'location', color: '#ef4444' },
      { id: 'LOC2', label: 'Kibera Outpost', type: 'location', color: '#ef4444' },
      
      // Institutions
      { id: 'NGO1', label: 'Red Cross', type: 'ngo', color: '#10b981' },
      { id: 'SHEL1', label: 'Safe Haven', type: 'shelter', color: '#8b5cf6' },
      { id: 'MED1', label: 'City Clinic', type: 'clinic', color: '#ec4899' },
    ],
    links: [
      { source: 'C1', target: 'L1', label: 'Leader' },
      { source: 'C2', target: 'L1', label: 'Leader' },
      { source: 'C1', target: 'LOC1', label: 'Found At' },
      { source: 'C3', target: 'LOC1', label: 'Found At' },
      { source: 'C2', target: 'LOC2', label: 'Movement' },
      { source: 'C1', target: 'NGO1', label: 'Registered' },
      { source: 'C2', target: 'NGO1', label: 'Registered' },
      { source: 'C3', target: 'NGO1', label: 'Registered' },
      { source: 'C1', target: 'SHEL1', label: 'Placed' },
      { source: 'C4', target: 'SHEL1', label: 'Placed' },
      { source: 'C2', target: 'MED1', label: 'Health Check' },
    ]
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Basic Force-Directed Simulation (Simplified for Demo)
    let nodes = graphData.nodes.map(n => ({ 
      ...n, 
      x: Math.random() * width, 
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }));

    const links = graphData.links.map(l => ({
      ...l,
      source: nodes.find(n => n.id === l.source),
      target: nodes.find(n => n.id === l.target)
    }));

    const runSim = () => {
      // Apply forces
      for (let i = 0; i < 50; i++) {
        // Repulsion between nodes
        nodes.forEach(n1 => {
          nodes.forEach(n2 => {
            if (n1 === n2) return;
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 50 / (dist * dist);
            n1.vx += (dx / dist) * force;
            n1.vy += (dy / dist) * force;
          });
        });

        // Attraction for links
        links.forEach(l => {
          const dx = l.target.x - l.source.x;
          const dy = l.target.y - l.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 100) * 0.01;
          l.source.vx += (dx / dist) * force;
          l.source.vy += (dy / dist) * force;
          l.target.vx -= (dx / dist) * force;
          l.target.vy -= (dy / dist) * force;
        });

        // Center gravity
        nodes.forEach(n => {
          n.vx += (width / 2 - n.x) * 0.005;
          n.vy += (height / 2 - n.y) * 0.005;
          
          // Friction
          n.vx *= 0.9;
          n.vy *= 0.9;
          
          n.x += n.vx;
          n.y += n.vy;
        });
      }

      // Draw
      ctx.clearRect(0, 0, width, height);

      // Draw links
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e2e8f0';
      links.forEach(l => {
        ctx.beginPath();
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + 20);
      });
    };

    const interval = setInterval(runSim, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 overflow-hidden relative h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1 rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-13.4-6.4l2.1 2.1m8.6 8.6l2.1 2.1m-10.7 0l2.1-2.1m8.6-8.6l2.1-2.1" />
            </svg>
          </span>
          Street Child Network Graph
        </h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Child</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Leader</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Location</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> NGO</span>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-full cursor-crosshair"
      />
      <div className="absolute bottom-6 right-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl max-w-[200px] border border-slate-700">
        <h4 className="text-[10px] font-black uppercase text-blue-400 mb-1">Intelligence Insight</h4>
        <p className="text-[11px] leading-relaxed">Cluster detected near <strong>Mzee B.</strong> and <strong>Central Park</strong>. Possible coordination hub for unauthorized movements.</p>
      </div>
    </div>
  );
};

export default StreetChildNetworkGraph;
