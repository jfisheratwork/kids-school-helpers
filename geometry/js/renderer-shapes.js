export function renderShapeSVG(type, params, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // We assume a standard 200x200 viewport for all SVGs, scaling nicely
    let svgContent = '';
    const strokeColor = '#059669'; // emerald-600
    const fillColor = '#ecfdf5'; // emerald-50
    const textColor = '#1f2937'; // gray-800

    switch(type) {
        case 'rect':
            // Params: w, h, labelW, labelH
            const rw = Math.min(160, 160 * (params.w / Math.max(params.w, params.h)));
            const rh = Math.min(160, 160 * (params.h / Math.max(params.w, params.h)));
            const rx = (200 - rw) / 2;
            const ry = (200 - rh) / 2;
            svgContent = `
                <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                <text x="100" y="${ry - 10}" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelW}</text>
                <text x="${rx + rw + 10}" y="100" text-anchor="start" alignment-baseline="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelH}</text>
            `;
            break;
            
        case 'circle':
            // Params: r, labelR
            svgContent = `
                <circle cx="100" cy="100" r="80" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                <!-- Center dot -->
                <circle cx="100" cy="100" r="3" fill="${strokeColor}"/>
                <!-- Radius line -->
                <line x1="100" y1="100" x2="180" y2="100" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                <text x="140" y="90" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelR}</text>
            `;
            break;
            
        case 'triangle':
            // Params: b, h, labelB, labelH, labelC (optional for hypotenuse), isRight
            const tb = Math.min(160, 160 * (params.b / Math.max(params.b, params.h)));
            const th = Math.min(160, 160 * (params.h / Math.max(params.b, params.h)));
            const tx = (200 - tb) / 2;
            const ty = (200 - th) / 2;
            
            if (params.isRight) {
                // Right triangle (aligned to bottom left)
                svgContent = `
                    <polygon points="${tx},${ty + th} ${tx + tb},${ty + th} ${tx},${ty}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                    <!-- Right angle square -->
                    <polyline points="${tx},${ty + th - 10} ${tx + 10},${ty + th - 10} ${tx + 10},${ty + th}" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="${tx + tb/2}" y="${ty + th + 20}" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelB}</text>
                    <text x="${tx - 10}" y="${ty + th/2}" text-anchor="end" alignment-baseline="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelH}</text>
                    ${params.labelC ? `<text x="${tx + tb/2 + 10}" y="${ty + th/2 - 10}" text-anchor="start" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelC}</text>` : ''}
                `;
            } else {
                // Isosceles-ish triangle
                svgContent = `
                    <polygon points="${tx},${ty + th} ${tx + tb},${ty + th} ${tx + tb/2},${ty}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                    <!-- Height line -->
                    <line x1="${tx + tb/2}" y1="${ty}" x2="${tx + tb/2}" y2="${ty + th}" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                    <!-- Right angle square for height -->
                    <polyline points="${tx + tb/2},${ty + th - 10} ${tx + tb/2 + 10},${ty + th - 10} ${tx + tb/2 + 10},${ty + th}" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    
                    <text x="100" y="${ty + th + 20}" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelB}</text>
                    <text x="${tx + tb/2 + 5}" y="${ty + th/2}" text-anchor="start" alignment-baseline="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelH}</text>
                `;
            }
            break;

        case 'prism':
            // Params: l, w, h, labelL, labelW, labelH
            // Fixed isometric view for simplicity
            svgContent = `
                <!-- Back faces (hidden lines) -->
                <polyline points="40,60 120,60 120,140" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                <line x1="40" y1="60" x2="40" y2="140" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                <line x1="40" y1="140" x2="80" y2="160" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                
                <!-- Visible faces -->
                <!-- Top -->
                <polygon points="80,80 160,80 120,60 40,60" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round"/>
                <!-- Front -->
                <polygon points="80,80 160,80 160,160 80,160" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round"/>
                <!-- Right -->
                <polygon points="160,80 120,60 120,140 160,160" fill="#a7f3d0" stroke="${strokeColor}" stroke-width="3" stroke-linejoin="round"/>
                
                <!-- Labels -->
                <text x="120" y="175" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelL}</text>
                <text x="65" y="125" text-anchor="end" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelH}</text>
                <text x="145" y="165" text-anchor="start" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelW}</text>
            `;
            break;
            
        case 'cylinder':
            // Params: r, h, labelR, labelH
            svgContent = `
                <!-- Bottom ellipse (back half dashed) -->
                <path d="M 60 150 A 40 15 0 0 1 140 150" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                <!-- Cylinder body and bottom front -->
                <path d="M 60 50 L 60 150 A 40 15 0 0 0 140 150 L 140 50" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                <!-- Top ellipse -->
                <ellipse cx="100" cy="50" rx="40" ry="15" fill="#a7f3d0" stroke="${strokeColor}" stroke-width="3"/>
                <!-- Radius line -->
                <circle cx="100" cy="50" r="3" fill="${strokeColor}"/>
                <line x1="100" y1="50" x2="140" y2="50" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="4"/>
                
                <!-- Labels -->
                <text x="120" y="40" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelR}</text>
                <text x="45" y="105" text-anchor="end" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.labelH}</text>
            `;
            break;
            
        case 'angle':
            // Params: angle1, angle2 (the actual degrees), isSupplementary, isComplementary
            if (params.isComplementary) {
                // 90 degree corner
                svgContent = `
                    <polyline points="40,40 40,160 160,160" fill="none" stroke="${strokeColor}" stroke-width="4"/>
                    <!-- Right angle box -->
                    <polyline points="40,145 55,145 55,160" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <!-- Bisecting line -->
                    <line x1="40" y1="160" x2="120" y2="60" stroke="${strokeColor}" stroke-width="3"/>
                    
                    <!-- Arcs -->
                    <path d="M 40 100 A 60 60 0 0 1 85 105" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <path d="M 95 115 A 60 60 0 0 1 100 160" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    
                    <text x="60" y="90" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.label1}</text>
                    <text x="120" y="145" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.label2}</text>
                `;
            } else if (params.isSupplementary) {
                // 180 degree line
                svgContent = `
                    <line x1="20" y1="160" x2="180" y2="160" stroke="${strokeColor}" stroke-width="4"/>
                    <!-- Intersecting line -->
                    <line x1="100" y1="160" x2="150" y2="40" stroke="${strokeColor}" stroke-width="3"/>
                    
                    <!-- Arcs -->
                    <path d="M 60 160 A 40 40 0 0 1 115 125" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <path d="M 125 100 A 60 60 0 0 1 140 160" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    
                    <text x="75" y="110" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.label1}</text>
                    <text x="150" y="130" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif">${params.label2}</text>
                `;
            } else {
                // Triangle angles (sum to 180)
                svgContent = `
                    <polygon points="40,160 160,160 80,60" fill="${fillColor}" stroke="${strokeColor}" stroke-width="3"/>
                    
                    <!-- Arcs -->
                    <!-- Bottom left -->
                    <path d="M 65 160 A 25 25 0 0 0 52 135" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="75" y="150" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif" font-size="12">${params.label1}</text>
                    
                    <!-- Bottom right -->
                    <path d="M 135 160 A 25 25 0 0 1 145 140" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="125" y="150" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif" font-size="12">${params.label2}</text>
                    
                    <!-- Top -->
                    <path d="M 72 80 A 25 25 0 0 0 92 75" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="82" y="100" text-anchor="middle" fill="${textColor}" font-weight="bold" font-family="sans-serif" font-size="12">${params.label3}</text>
                `;
            }
            break;
    }

    container.innerHTML = `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
}
