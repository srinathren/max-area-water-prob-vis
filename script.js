let blocks = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];

function calculateWater(heights) {
    if (heights.length === 0) return 0;
    let totalWater = 0;
    const n = heights.length;
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i-1], heights[i]);
    }
    
    rightMax[n-1] = heights[n-1];
    for (let i = n-2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i+1], heights[i]);
    }
    
    for (let i = 0; i < n; i++) {
        totalWater += Math.min(leftMax[i], rightMax[i]) - heights[i];
    }
    
    return totalWater;
}

function updateBlocks() {
    const input = document.getElementById('heightInput').value;
    const newBlocks = input.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
        
    if (newBlocks.length > 0) {
        blocks = newBlocks;
        render();
    }
}

function render() {
    const maxHeight = Math.max(...blocks, 6);
    const svgWidth = blocks.length * 50;
    const svgHeight = (maxHeight + 1) * 50;
    
    // First SVG (Bars + Water)
    const mainSvg = `
        <div class="svg-wrapper">
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
            ${blocks.map((height, index) => `
                <rect
                    x="${index * 50}"
                    y="${(maxHeight - height) * 50}"
                    width="48"
                    height="${height * 50}"
                    fill="#FFD700"
                />
            `).join('')}
            
            ${blocks.map((height, index) => {
                const leftMax = Math.max(...blocks.slice(0, index + 1));
                const rightMax = Math.max(...blocks.slice(index));
                const waterHeight = Math.min(leftMax, rightMax) - height;
                
                return waterHeight > 0 ? `
                    <rect
                        x="${index * 50}"
                        y="${(maxHeight - height - waterHeight) * 50}"
                        width="48"
                        height="${waterHeight * 50}"
                        fill="#87CEEB"
                        fill-opacity="0.7"
                    />
                ` : '';
            }).join('')}

            <!-- Horizontal Grid Lines -->
            ${Array.from({ length: maxHeight }).map((_, i) => `
                <line
                    x1="0"
                    y1="${i * 50}"
                    x2="${svgWidth}"
                    y2="${i * 50}"
                    stroke="black"
                    stroke-width="1"
                />
            `).join('')}
            
            <!-- Vertical Grid Lines -->
            ${Array.from({ length: blocks.length + 1 }).map((_, i) => `
                <line
                    x1="${i * 50}"
                    y1="0"
                    x2="${i * 50}"
                    y2="${maxHeight * 50}"
                    stroke="black"
                    stroke-width="1"
                />
            `).join('')}
        </svg>
        </div>
    `;

    // Second SVG (Water Blocks Only)
    const waterSvg = `
        <div class="svg-wrapper">
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
            ${blocks.map((height, index) => {
                const leftMax = Math.max(...blocks.slice(0, index + 1));
                const rightMax = Math.max(...blocks.slice(index));
                const waterHeight = Math.min(leftMax, rightMax) - height;
                
                return waterHeight > 0 ? `
                    <rect
                        x="${index * 50}"
                        y="${(maxHeight - height - waterHeight) * 50}"
                        width="48"
                        height="${waterHeight * 50}"
                        fill="#87CEEB"
                        fill-opacity="0.7"
                    />
                ` : '';
            }).join('')}

            <!-- Horizontal Grid Lines -->
            ${Array.from({ length: maxHeight }).map((_, i) => `
                <line
                    x1="0"
                    y1="${i * 50}"
                    x2="${svgWidth}"
                    y2="${i * 50}"
                    stroke="black"
                    stroke-width="1"
                />
            `).join('')}
            
            <!-- Vertical Grid Lines -->
            ${Array.from({ length: blocks.length + 1 }).map((_, i) => `
                <line
                    x1="${i * 50}"
                    y1="0"
                    x2="${i * 50}"
                    y2="${maxHeight * 50}"
                    stroke="black"
                    stroke-width="1"
                />
            `).join('')}
        </svg>
        </div>
    `;

    document.getElementById('svgContainer').innerHTML = mainSvg + "<br>" + waterSvg;
    document.getElementById('result').textContent = `Total water units: ${calculateWater(blocks)}`;
}

render();
