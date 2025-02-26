/**
 * Blocks array representing the heights of buildings.
 */
let blocks = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];

/**
 * Calculates the total amount of trapped water based on given heights.
 *
 * @param {number[]} heights - The array of building heights.
 * @param {number} boundaryHeight - Height of boundary towers to add (default: 5).
 * @returns {object} Object containing water amount and whether boundaries were added.
 */
function calculateWater(heights, boundaryHeight = 5) {
    if (heights.length === 0) return { water: 0, boundariesAdded: false };
    let originalWater = calculateWaterHelper(heights);
    if (originalWater === 0) {
        const enhancedHeights = [boundaryHeight, ...heights, boundaryHeight];
        const enhancedWater = calculateWaterHelper(enhancedHeights);
        return { 
            water: enhancedWater, 
            boundariesAdded: true,
            enhancedHeights: enhancedHeights 
        };
    }
    
    return { 
        water: originalWater, 
        boundariesAdded: false,
        enhancedHeights: heights 
    };
}

/**
 * Helper function to calculate water without modifying the input array.
 * 
 * @param {number[]} heights - The array of building heights.
 * @returns {number} Total units of trapped water.
 */
function calculateWaterHelper(heights) {
    const n = heights.length;
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);

    // Compute maximum height from the left at each index
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    }

    // Compute maximum height from the right at each indexlation
    console.log("Before calculation, blocks =", blocks);
    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    }

    // Calculate trapped water at each index
    let totalWater = 0;
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
        console.log("After update, blocks =", blocks);
        render();
    }
}

/**
 * Renders the SVG representation of the buildings and trapped water.
 */
function render() {    
    // Calculate water and determine if boundaries should be added
    const result = calculateWater(blocks);
    console.log("Calculation result:", result);
    
    // Use the heights returned from calculateWater
    const displayBlocks = result.enhancedHeights;
    console.log("Display blocks =", displayBlocks);
    
    const maxHeight = Math.max(...displayBlocks, 6); // Ensuring a minimum grid height
    const svgWidth = displayBlocks.length * 50;
    const svgHeight = (maxHeight + 1) * 50;

    // Generate the SVG for buildings and trapped water
    let mainSvg = `
        <div class="svg-wrapper">
            <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
                <!-- Render building blocks -->
                ${displayBlocks.map((height, index) => {
                    const isBoundary = result.boundariesAdded && 
                        (index === 0 || index === displayBlocks.length - 1);
                    return `<rect x="${index * 50}" y="${(maxHeight - height) * 50}" 
                        width="48" height="${height * 50}" 
                        fill="${isBoundary ? '#FF6347' : '#FFD700'}"/>`;
                }).join('')}
                
                <!-- Render trapped water blocks -->
                ${displayBlocks.map((height, index) => {
                    const leftMax = Math.max(...displayBlocks.slice(0, index + 1));
                    const rightMax = Math.max(...displayBlocks.slice(index));
                    const waterHeight = Math.min(leftMax, rightMax) - height;

                    return waterHeight > 0 ? 
                        `<rect x="${index * 50}" y="${(maxHeight - height - waterHeight) * 50}" 
                        width="48" height="${waterHeight * 50}" 
                        fill="#87CEEB" fill-opacity="0.7"/>` : '';
                }).join('')}

                <!-- Draw horizontal grid lines -->
                ${Array.from({ length: maxHeight + 1 }).map((_, i) => 
                    `<line x1="0" y1="${i * 50}" x2="${svgWidth}" y2="${i * 50}" 
                    stroke="black" stroke-width="1"/>`
                ).join('')}
                
                <!-- Draw vertical grid lines -->
                ${Array.from({ length: displayBlocks.length + 1 }).map((_, i) => 
                    `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${maxHeight * 50}" 
                    stroke="black" stroke-width="1"/>`
                ).join('')}
            </svg>
        </div>
    `;

    // Generate the SVG that shows only the trapped water blocks
    let waterSvg = `
        <div class="svg-wrapper">
            <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
                <!-- Render only trapped water blocks -->
                ${displayBlocks.map((height, index) => {
                    const leftMax = Math.max(...displayBlocks.slice(0, index + 1));
                    const rightMax = Math.max(...displayBlocks.slice(index));
                    const waterHeight = Math.min(leftMax, rightMax) - height;

                    return waterHeight > 0 ? 
                        `<rect x="${index * 50}" y="${(maxHeight - height - waterHeight) * 50}" 
                        width="48" height="${waterHeight * 50}" 
                        fill="#87CEEB" fill-opacity="0.7"/>` : '';
                }).join('')}

                <!-- Draw horizontal grid lines -->
                ${Array.from({ length: maxHeight + 1 }).map((_, i) => 
                    `<line x1="0" y1="${i * 50}" x2="${svgWidth}" y2="${i * 50}" 
                    stroke="black" stroke-width="1"/>`
                ).join('')}
                
                <!-- Draw vertical grid lines -->
                ${Array.from({ length: displayBlocks.length + 1 }).map((_, i) => 
                    `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${maxHeight * 50}" 
                    stroke="black" stroke-width="1"/>`
                ).join('')}
            </svg>
        </div>
    `;

    // Render both SVGs in the container
    document.getElementById('svgContainer').innerHTML = mainSvg + "<br>" + waterSvg;

    // Display total water collected and boundary information
    const message = result.boundariesAdded 
        ? `Total water units with boundary towers: ${result.water} (Boundary towers added as original would trap zero water)`
        : `Total water units: ${result.water}`;
    
    document.getElementById('result').textContent = message;

    // Display extra diagnostic information
    const blocksInfo = document.createElement('div');
    blocksInfo.innerHTML = `
        <p>Input array length: ${blocks.length}, Values: [${blocks.join(', ')}]</p>
        <p>Display array length: ${displayBlocks.length}, Values: [${displayBlocks.join(', ')}]</p>
    `;
    document.getElementById('svgContainer').appendChild(blocksInfo);
}

function testSpecificCase() {
    blocks = [1, 2, 3, 4, 3, 2, 1]; 
    console.log("Test case set: blocks =", blocks);
    render();
}

render();

document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test [1,2,3,4,3,2,1] Case';
    testButton.onclick = testSpecificCase;
    document.body.insertBefore(testButton, document.getElementById('svgContainer'));
});