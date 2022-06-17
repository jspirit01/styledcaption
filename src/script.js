


const levelRangeElement = document.getElementById("levelRange");
 function analyze(e){
    console.log("analyze start");
    if (typeof Meyda === "undefined") {
        console.log("Meyda could not be found! Have you included it?");
    } else {
        const analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ["rms"],
        callback: (features) => {
            console.log(features);
            levelRangeElement.value = features.rms;
        },
        });
        analyzer.start();
    }
}