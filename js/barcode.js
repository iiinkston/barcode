var barcode = (function () {
    var handler = null;
    var isScanning = false;
    var isInitialized = false; // 确保 Quagga 只初始化一次

    return {
        setHandler: function (callback) {
            handler = callback;
        },

        init: function () {
            console.log("📌 Initializing Barcode Scanner...");

            if (isInitialized) {
                console.log("✅ Quagga is already initialized. Skipping...");
                return;
            }

            if (typeof Quagga === "undefined") {
                console.error("❌ QuaggaJS is not available!");
                return;
            }

            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#barcodevideo"),
                    constraints: {
                        width: 1280,
                        height: 720,
                        facingMode: "environment"
                    }
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "upc_reader"],
                    multiple: false
                },
                locator: {
                    patchSize: "large",
                    halfSample: false
                },
                numOfWorkers: navigator.hardwareConcurrency || 4,
                locate: true,
                frequency: 5
            }, function (err) {
                if (err) {
                    console.error("❌ QuaggaJS Initialization Error:", err);
                    alert("Error: QuaggaJS failed to start. Check console for details.");
                    return;
                }

                console.log("📢 QuaggaJS Scanner Ready!");
                isInitialized = true;
                barcode.start(); // 只有初始化完成后才启动
            });

            // 监听条码检测
            Quagga.onDetected(function (data) {
                if (isScanning && handler) {
                    console.log("🎯 Real Barcode Detected:", data.codeResult.code);
                    handler(data.codeResult.code);
                    barcode.stop(); // 识别到条码后暂停扫描
                    setTimeout(() => barcode.start(), 3000); // 3 秒后重新启动
                }
            });

            // 监听条码识别过程，优化检测
            Quagga.onProcessed(function (result) {
                if (result && result.boxes && result.boxes.length > 0) {
                    isScanning = true;
                } else {
                    isScanning = false;
                }
            });
        },

        start: function () {
            if (!isInitialized) {
                console.log("⚠️ Quagga is not initialized yet. Initializing now...");
                this.init();
                return;
            }

            if (!isScanning) {
                isScanning = true;
                Quagga.start();
                console.log("✅ Quagga restarted");
            } else {
                console.log("⚠️ Quagga is already running.");
            }
        },

        stop: function () {
            console.log("⏹️ Stopping Barcode Scanner...");
            isScanning = false;
            Quagga.stop();
        }
    };
})();
