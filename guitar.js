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

        // if(predictions[0].label === 'open') {
        //   console.log(predictions)
        // }

        // function drawAndClear(x,y) {
        //     if (i < 20) {
        //         canvas.drawImage(img, x, y, 150, 180);
        //         // console.log("Cleared and drew");

        //         i++;
        //         setTimeout(drawAndClear, 1000); // Wait for 3 seconds before the next iteration
        //     } else {
        //         // After the loop is finished, wait for 10 seconds
        //         setTimeout(() => {
        //             console.log("Finished waiting for 10 seconds");
        //         }, 10000);
        //     }
        // }
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
                var colid_guitar_note1 = new circle(new vec2(270, 300), 100);
                var colid_guitar_note2 = new circle(new vec2(800, 180), 100);
                var colid_guitar_note3 = new circle(new vec2(400, 180), 100);
                
                // Hi-Hats
                if (colid_guitar_note1.is_in_circle(sticktip)) {
                    guitar1.play();
                }
                else if (colid_guitar_note2.is_in_circle(sticktip)) {
                    guitar2.play();
                }
                else if (colid_guitar_note3.is_in_circle(sticktip)) {
                    guitar3.play();
                }

                function animate() {
                    context2.clearRect(0, 0, canvasW, canvasH);
                    context2.drawImage(img, sticktip.x-img.width*0.5, sticktip.y, img.width, img.height);
                    dbg.draw_circle(sticktip_viz);
                    dbg.draw_circle(colid_guitar_note1);
                    dbg.draw_circle(colid_guitar_note2);
                    dbg.draw_circle(colid_guitar_note3);
                    requestAnimationFrame(animate)
                }
            animate()
            }
/*                
                if ((item.bbox[0] > 10 && item.bbox[0] < 150) && (item.bbox[1] > 200 && item.bbox[1] < 210)) {
                    guitar1.play();
                }

                // if ((item.bbox[0] > 500 && item.bbox[0] < 800) && (item.bbox[1] > 100 && item.bbox[1] < 200)) {
                //     gui2.play();
                // }

                if ((item.bbox[0] > 200 && item.bbox[0] < 400) && (item.bbox[1] > 100 && item.bbox[1] < 180)) {
                    guitar2.play();
                }

                if ((item.bbox[0] > 175 && item.bbox[0] < 240) && (item.bbox[1] > 245 && item.bbox[1] < 260)) {
                    guitar3.play();
                    // console.log("KICK");
                }

                // Snares

                // Kick
                // if ((item.bbox[0] > 371 && item.bbox[0] < 554) && (item.bbox[1] > 396 && item.bbox[1] < 513)) {
                //     kick.play();
                // }

                // context.drawImage(img, item.bbox[0], item.bbox[1], 300, 300);
                // context.clearRect(0, 0, canvas.width, canvas.height);
                function animate() {
                    context2.clearRect(0, 0, canvas.width, canvas.height);
                    context2.drawImage(img, item.bbox[0] - 100, item.bbox[1] - 150, 110, 110);

                    requestAnimationFrame(animate)
                }
                animate()
            }
            */
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

// function drawHats() {
//     context2.beginPath();
//     context2.lineWidth = "6";
//     context2.strokeStyle = "red";
//     context2.rect(150, 315, 84, 160);
//     context2.stroke();

//     context2.beginPath();
//     context2.lineWidth = "6";
//     context2.strokeStyle = "red";
//     context2.rect(253, 174, 84, 160);
//     context2.stroke();

//     context2.beginPath();
//     context2.lineWidth = "6";
//     context2.strokeStyle = "red";
//     context2.rect(682, 174, 84, 160);
//     context2.stroke();

// }

// drawHats();
// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Jump Imminent!"
    trackButton.disabled = false
});
