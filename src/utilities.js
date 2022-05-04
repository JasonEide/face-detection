import {TRIANGULATION} from './triangulation';

// draw triangle
const drawPath = (ctx, points, closePath) => {
    // creates a drawable object
    const region = new Path2D();
    // begins at starting point
    region.moveTo(points[0][0], points[0][1])
    // starts drawing the image
    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        region.lineTo(point[0], point[1]);
    }
    // ends path at the end of the function
    if (closePath) {
        region.closePath();
    }
    // draws the image on the canvas
    ctx.strokeStyle = 'pink'
    ctx.stroke(region);
};
const triangulation = TRIANGULATION
// draw the points
export const drawFacemesh = (predictions, ctx) => {
    if(predictions.length>0){
        // draw points
        predictions.forEach(prediction=>{
            const keypoints = prediction.scaledMesh;
        // draw triangles
            for (let i = 0; i < triangulation.length/3; i++) {
                const points = [
                    triangulation[i * 3],
                    triangulation[i * 3 + 1],
                    triangulation[i * 3 + 2],
                ].map((index) => keypoints[index]);
                drawPath(ctx, points, true);
            }
        // draw points
            for (let i = 0; i < keypoints.length; i++){
                const x = keypoints[i][0];
                const y = keypoints[i][1];
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 3 * Math.PI);
                ctx.fillStyle = 'aqua';
                ctx.fill();
            };
        });
    };
};