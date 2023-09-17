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


let guitar1 = document.querySelector("#guitar-1");
let guitar2 = document.querySelector("#guitar-2");
let guitar3 = document.querySelector("#guitar-3");
let guitar4 = document.querySelector("#guitar-4");
let guitar5 = document.querySelector("#guitar-5");
let guitar6 = document.querySelector("#guitar-6");

let isVideo = false;
let model = null;
// const model =  await handTrack.load();
// const predictions = await model.detect(img);

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
            //if (item.label === 'closed' || item.label === 'pinch' || item.label === 'point' || item.label === "open") {
            if (item.label === "open") {
                //updated canvase to actual dimensions
                const canvasW = canvas2.getBoundingClientRect().width;
                const canvasH = canvas2.getBoundingClientRect().height;
                canvas2.width = canvasW;
                canvas2.height = canvasH;
                
                //updated canvase to actual dimensions
                const htcanvasW = canvas.width;
                const htcanvasH = canvas.height;            

                //console.log(`w: ${videoW}, h: ${videoH}`);
                var dbg  = new debugviz(context2);
                var trackedpoint = new vec2(0.0,0,0.0);
                console.log(`x: ${trackedpoint.x}, y: ${trackedpoint.y}`);
                var sticktip = new vec2(item.bbox[0]*2.2-50.0, item.bbox[1]*2.2-50.0); //scale up the range to get more coverage on higher res canvas
                var sticktip_viz = new circle(sticktip, 20);
                // var colid_guitar_note1 = new circle(new vec2(270, 300), 100);
                // var colid_guitar_note2 = new circle(new vec2(800, 180), 100);
                // var colid_guitar_note3 = new circle(new vec2(400, 180), 100);

                var colid_guitar_note1 = new circle(new vec2(332, 286), 30);
                var colid_guitar_note2 = new circle(new vec2(371, 306), 30);
                var colid_guitar_note3 = new circle(new vec2(417, 322), 30);
                var colid_guitar_note4 = new circle(new vec2(485, 342), 30);
                var colid_guitar_note5 = new circle(new vec2(535, 354), 30);
                var colid_guitar_note6 = new circle(new vec2(571, 373), 30);

                
                // Guitar notes
                if (colid_guitar_note1.is_in_circle(sticktip)) {
                    guitar1.play();
                }
                else if (colid_guitar_note2.is_in_circle(sticktip)) {
                    guitar2.play();
                }
                else if (colid_guitar_note3.is_in_circle(sticktip)) {
                    guitar3.play();
                }
                else if (colid_guitar_note4.is_in_circle(sticktip)) {
                    guitar4.play();
                }
                else if (colid_guitar_note5.is_in_circle(sticktip)) {
                    guitar5.play();
                }
                else if (colid_guitar_note6.is_in_circle(sticktip)) {
                    guitar6.play();
                }
             

                function animate() {
                    context2.clearRect(0, 0, canvasW, canvasH);
                    context2.drawImage(img, sticktip.x-img.width*0.5, sticktip.y, img.width, img.height);
                    dbg.draw_circle(sticktip_viz);
                    dbg.draw_circle(colid_guitar_note1);
                    dbg.draw_circle(colid_guitar_note2);
                    dbg.draw_circle(colid_guitar_note3);
                    dbg.draw_circle(colid_guitar_note4);
                    dbg.draw_circle(colid_guitar_note5);
                    dbg.draw_circle(colid_guitar_note6);
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
