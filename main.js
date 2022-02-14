objects = [];
status = "";

function preload() {
    alertSound = loadSound("alert.wav");
}

function setup() {
    canvas = createCanvas(500, 400);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(500, 400);
    video.hide();
    object_detector = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML = "Status - Detecting Objects...";
}

function modelLoaded() {
    console.log("model has loaded");
    status = true;
}

function gotResults(error, results) {
    if (error) {
        console.error(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(video, 0, 0, 500, 400);
    if (status != "") {
        object_detector.detect(video, gotResults);
        for (i = 0;i < objects.length;i++) {
            document.getElementById("status").innerHTML = "Status - Object Detected"
            document.getElementById("objects").innerHTML = "No. of objects - "+objects.length;
            fill("#ff0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + " " + "%",objects[i].x, objects[i].y);
            noFill();
            stroke("#ff0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == "person") {
                document.getElementById("objects").innerHTML = "Baby Found";
                console.log("stop");
                alertSound.stop();
            } else {
                document.getElementById("objects").innerHTML = "Baby Not Found";
                console.log("start");
                alertSound.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("objects").innerHTML = "Baby Not Found";
            console.log("start");
            alertSound.play();
        }
    }
}