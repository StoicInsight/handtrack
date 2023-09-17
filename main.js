const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const context2 = canvas2.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let kick = document.querySelector("#kick");
let hihat1 = document.querySelector("#hihat1");
let hihat2 = document.querySelector("#hihat2");
let hihat3 = document.querySelector("#hihat3");

let isVideo = false;
let model = null;
// const model =  await handTrack.load();
// const predictions = await model.detect(img);
var videoW;
var videoH;

var v = document.getElementById("myvideo");
v.addEventListener( "loadedmetadata", function (e) {
    videoW = this.videoWidth,
    videoH = this.videoHeight;
}, false );

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.55,    // confidence threshold for predictions.
    modelSize: "small",

}

// const modelParams = {
//   flipHorizontal: false,
//     outputStride: 16,
//     imageScaleFactor: 1,
//     maxNumBoxes: 20,
//     iouThreshold: 0.2,
//     scoreThreshold: 0.6,
//     modelType: "ssd320fpnlite",
//     modelSize: "large",
//     bboxLineWidth: "2",
//     fontSize: 17,
// }

class vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    length()
    {   
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    scale(s)
    {
        this.x *= s;
        this.y *= s;
    }
    vmul(s)
    {
        this.x *= s.x;
        this.y *= s.y;
    }
}
class circle
{
    constructor(c, r)
    {
        this.c = c;
        this.r = r;
    }
    
    is_in_circle(p)
    {
        var diff = new vec2(this.c.x-p.x, this.c.y-p.y);
        var dist = diff.length();
        console.log(`dist: ${dist}`)
        return ((dist-this.r)<=0.0)?true:false;
    }
}
class debugviz
{
    constructor(obj)
    {
        this.ctx = obj;
    }

    draw_circle(circ)
    {
        this.ctx.strokeStyle = "green";
        this.ctx.fillStyle = "green";
        this.ctx.beginPath();
        this.ctx.ellipse(circ.c.x, circ.c.y, circ.r, circ.r, 0, 0, Math.PI*2.0);
        this.ctx.stroke()
        return;
    }
}



function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

function filterPredictions(predictions) {
    predictions.filter((item) => {
        if (item.label === 'closed') {
            return item
        }
    })
}

function clamp(min, max, x)
{
    return (x<min?min:
            x>max?max:x);
}


function clampedcenter(x1, y1, x2, y2, minw, maxw, minh, maxh)
{
    var c = new vec2(0.5*(clamp(minw, maxw, x2) - clamp(minw, maxw, x1)), 0.5*(clamp(minh, maxh, y2) - clamp(minh, maxh, y1)));
    c.x = x1 + c.x;
    c.y = y1 + c.y;
    return c;
}

function runDetection() {
    model.detect(video).then(predictions => {
        const img = document.getElementById("scream");
        
        predictions.filter((item) => {
            //updated canvase to actual dimensions
            const canvasW = canvas2.getBoundingClientRect().width;
            const canvasH = canvas2.getBoundingClientRect().height;
            canvas2.width = canvasW;
            canvas2.height = canvasH;
            
            //updated canvase to actual dimensions
            const htcanvasW = canvas.width;//canvas.getBoundingClientRect().width;
            const htcanvasH = canvas.height;//canvas.getBoundingClientRect().height;
            //canvas.width = htcanvasW;
            //canvas.height = htcanvasH;
            
            //if (item.label === 'closed' || item.label === 'pinch' || item.label === 'point' || item.label === "open") {

            if (item.label === "open") {
                //console.log(`w: ${videoW}, h: ${videoH}`);
                var dbg  = new debugviz(context2);
                var trackedpoint = new vec2(0.0,0,0.0);
                trackedpoint = clampedcenter(item.bbox[0], item.bbox[1], item.bbox[2], item.bbox[3], 0.0, videoW, 0.0, videoH);
                trackedpoint.vmul(new vec2(canvasW/videoW, canvasH/videoH));
                
                console.log(`x: ${trackedpoint.x}, y: ${trackedpoint.y}`);
                var sticktip = new vec2(trackedpoint.x-(img.width*0.5),
                                        trackedpoint.y-(img.height*0.5));
                var sticktip_viz = new circle(sticktip, 20);
                var colid_hihat1 = new circle(new vec2(270, 300), 100);
                var colid_hihat2 = new circle(new vec2(800, 180), 100);
                var colid_hihat3 = new circle(new vec2(400, 180), 100);
                
                // Hi-Hats
                if (colid_hihat1.is_in_circle(sticktip)) {
                    hihat1.play();
                }
                else if (colid_hihat2.is_in_circle(sticktip)) {
                    hihat2.play();
                }
                else if (colid_hihat3.is_in_circle(sticktip)) {
                    hihat3.play();
                }

                function animate() {
                    context2.clearRect(0, 0, canvasW, canvasH);
                    context2.drawImage(img, sticktip.x, sticktip.y, img.width, img.height);
                    dbg.draw_circle(sticktip_viz);
                    dbg.draw_circle(colid_hihat1);
                    dbg.draw_circle(colid_hihat2);
                    dbg.draw_circle(colid_hihat3);
                    requestAnimationFrame(animate)
                }
                animate()
            }
                    })

        // console.log("Predictions: ", predictions);
        model.renderPredictions(predictions.filter((item) => {
            if ((item.label === 'closed' || item.label === 'open' || item.label === 'point') && item.score > 0.30) {
                return item;
            }
        }), canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});


//RESOURCES
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D