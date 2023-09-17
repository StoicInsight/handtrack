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

let snare1 = document.querySelector("#snare1");
let snare2 = document.querySelector("#snare2");
let snare3 = document.querySelector("#snare3");
let snare4 = document.querySelector("#snare4");


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




function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "May the Force Be With You!"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Jumping.."
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Energy Drained"
    }
}

function filterPredictions(predictions) {
    predictions.filter((item) => {
        if (item.label === 'closed') {
            return item
        }
    })
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
            const htcanvasW = canvas.width;
            const htcanvasH = canvas.height;            
            //if (item.label === 'closed' || item.label === 'pinch' || item.label === 'point' || item.label === "open") {

            if (item.label === "open") {
                //console.log(`w: ${videoW}, h: ${videoH}`);
                var dbg  = new debugviz(context2);
                var trackedpoint = new vec2(0.0,0,0.0);
                // console.log(`x: ${trackedpoint.x}, y: ${trackedpoint.y}`);
                var sticktip = new vec2(item.bbox[0]*2.2-50.0, item.bbox[1]*2.2-50.0); //scale up the range to get more coverage on higher res canvas
                var sticktip_viz = new circle(sticktip, 20);
                var colid_hihat1 = new circle(new vec2(150, 316), 75);
                var colid_hihat2 = new circle(new vec2(254, 169), 75);
                var colid_hihat3 = new circle(new vec2(684, 173), 75);

                var kick_circle = new circle(new vec2(466, 454), 80);

                var snare_1 = new circle(new vec2(271, 365), 50);
                var snare_2 = new circle(new vec2(386, 263), 50);
                var snare_3 = new circle(new vec2(558, 261), 50);
                var snare_4 = new circle(new vec2(701, 417), 75);
       
                
                // Hi-Hats
                if (colid_hihat1.is_in_circle(sticktip)) {
                    hihat1.play();
                }
                else if (colid_hihat2.is_in_circle(sticktip)) {
                    hihat2.play();
                }
                else if (colid_hihat3.is_in_circle(sticktip)) {
                    hihat3.play();
                } else if (kick_circle.is_in_circle(sticktip)) {
                    kick.play()
                }else if (snare_1.is_in_circle(sticktip)) {
                    snare1.play()
                }else if (snare_2.is_in_circle(sticktip)) {
                    snare2.play()
                }else if (snare_3.is_in_circle(sticktip)) {
                    snare3.play()
                }else if (snare_4.is_in_circle(sticktip)) {
                    snare4.play()
                }

                function animate() {
                    context2.clearRect(0, 0, canvasW, canvasH);
                    context2.drawImage(img, sticktip.x-img.width*0.5, sticktip.y, img.width, img.height);
                    dbg.draw_circle(sticktip_viz);
                    dbg.draw_circle(colid_hihat1);
                    dbg.draw_circle(colid_hihat2);
                    dbg.draw_circle(colid_hihat3);
                    dbg.draw_circle(kick_circle);
                    dbg.draw_circle(snare_1);
                    dbg.draw_circle(snare_2);
                    dbg.draw_circle(snare_3);
                    dbg.draw_circle(snare_4);

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
    updateNote.innerText = "Jump Imminent!"
    trackButton.disabled = false
});


//RESOURCES
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D