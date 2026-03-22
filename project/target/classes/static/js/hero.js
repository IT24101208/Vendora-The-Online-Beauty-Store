const video = document.getElementById("heroVideo");
video.addEventListener("ended", function () {

    setTimeout(() => {
        video.currentTime = 0;
        video.play();
    }, 1500);

});