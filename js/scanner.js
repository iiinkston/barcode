document.addEventListener("DOMContentLoaded", async function () {
    console.log("📌 Barcode Scanner Initialized");

    var sound = new Audio("barcode.wav");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        let videoElement = document.querySelector('#barcodevideo');
        videoElement.srcObject = stream;
        console.log("✅ Camera Access Granted");

        setTimeout(() => {
            console.log("📢 Starting Barcode Scanner...");
            barcode.init(); // 启动 QuaggaJS
        }, 1000);

    } catch (err) {
        console.error("❌ Camera Access Denied:", err);
        alert("Camera access denied! Please allow camera access.");
        return;
    }

    barcode.setHandler(function (barcodeResult) {
        console.log("🎯 Barcode Detected:", barcodeResult);
        let resultElement = document.getElementById("result");

        if (resultElement) {
            resultElement.innerText = "Scanned Code: " + barcodeResult;
            console.log("✅ UI Updated: " + resultElement.innerText);
        } else {
            console.error("❌ Error: #result element not found in the DOM!");
        }

        sound.play();
    });
});
