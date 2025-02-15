/**
 * Blocks array representing the heights of buildings.
 */
let blocks = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];

/**
 * Calculates the total amount of trapped water based on given heights.
 *
 * @param {number[]} heights - The array of building heights.
 * @returns {number} Total units of trapped water.
 */
function calculateWater(heights) {
    if (heights.length === 0) return 0;

    let totalWater = 0;
    const n = heights.length;
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);

    // Compute maximum height from the left at each index
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    }

    // Compute maximum height from the right at each index
    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    }

    // Calculate trapped water at each index
    for (let i = 0; i < n; i++) {
        totalWater += Math.min(leftMax[i], rightMax[i]) - heights[i];
    }

    return totalWater;
}

/**
 * Updates the blocks array based on user input and re-renders the graph.
 */
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

/**
 * Renders the SVG representation of the buildings and trapped water.
 */
function render() {
    const maxHeight = Math.max(...blocks, 6); // Ensuring a minimum grid height
    const svgWidth = blocks.length * 50;
    const svgHeight = (maxHeight + 1) * 50;

    /**
     * Generates the SVG for buildings and trapped water.
     */
    const mainSvg = `
        <div class="svg-wrapper">
            <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
                <!-- Render building blocks -->
                ${blocks.map((height, index) => `
                    <rect x="${index * 50}" y="${(maxHeight - height) * 50}" width="48" height="${height * 50}" fill="#FFD700"/>
                `).join('')}
                
                <!-- Render trapped water blocks -->
                ${blocks.map((height, index) => {
                    const leftMax = Math.max(...blocks.slice(0, index + 1));
                    const rightMax = Math.max(...blocks.slice(index));
                    const waterHeight = Math.min(leftMax, rightMax) - height;

                    return waterHeight > 0 ? `
                        <rect x="${index * 50}" y="${(maxHeight - height - waterHeight) * 50}" width="48" height="${waterHeight * 50}" fill="#87CEEB" fill-opacity="0.7"/>
                    ` : '';
                }).join('')}

                <!-- Draw horizontal grid lines -->
                ${Array.from({ length: maxHeight }).map((_, i) => `
                    <line x1="0" y1="${i * 50}" x2="${svgWidth}" y2="${i * 50}" stroke="black" stroke-width="1"/>
                `).join('')}
                
                <!-- Draw vertical grid lines -->
                ${Array.from({ length: blocks.length + 1 }).map((_, i) => `
                    <line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${maxHeight * 50}" stroke="black" stroke-width="1"/>
                `).join('')}
            </svg>
        </div>
    `;

    /**
     * Generates the SVG that shows only the trapped water blocks.
     */
    const waterSvg = `
        <div class="svg-wrapper">
            <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
                <!-- Render only trapped water blocks -->
                ${blocks.map((height, index) => {
                    const leftMax = Math.max(...blocks.slice(0, index + 1));
                    const rightMax = Math.max(...blocks.slice(index));
                    const waterHeight = Math.min(leftMax, rightMax) - height;

                    return waterHeight > 0 ? `
                        <rect x="${index * 50}" y="${(maxHeight - height - waterHeight) * 50}" width="48" height="${waterHeight * 50}" fill="#87CEEB" fill-opacity="0.7"/>
                    ` : '';
                }).join('')}

                <!-- Draw horizontal grid lines -->
                ${Array.from({ length: maxHeight }).map((_, i) => `
                    <line x1="0" y1="${i * 50}" x2="${svgWidth}" y2="${i * 50}" stroke="black" stroke-width="1"/>
                `).join('')}
                
                <!-- Draw vertical grid lines -->
                ${Array.from({ length: blocks.length + 1 }).map((_, i) => `
                    <line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${maxHeight * 50}" stroke="black" stroke-width="1"/>
                `).join('')}
            </svg>
        </div>
    `;

    // Render both SVGs in the container
    document.getElementById('svgContainer').innerHTML = mainSvg + "<br>" + waterSvg;

    // Display total water collected
    document.getElementById('result').textContent = `Total water units: ${calculateWater(blocks)}`;
}

// Initial rendering of the SVG
render();
