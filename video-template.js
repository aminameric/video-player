const videoElement = document.createElement("video");
videoElement.src = "https://techwave-task.s3.eu-central-1.amazonaws.com/13384444_1920_1080_30fps.mp4";

videoElement.setAttribute("playsinline", "");
videoElement.setAttribute("webkit-playsinline", "");
videoElement.muted = true;
videoElement.controls = true;
videoElement.autoplay = true;

videoElement.style.display = "block";
videoElement.style.width = "100%";
videoElement.style.height = "auto";
videoElement.style.borderRadius = "8px";

const container = document.createElement("div");
container.style.position = "fixed";
container.style.bottom = "20px";
container.style.right = "20px";
container.style.zIndex = "1000";
container.style.width = "520px";
container.style.height = "auto";
container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
container.style.backgroundColor = "#000";
container.style.overflow = "hidden";

const closeButton = document.createElement("span");
closeButton.innerHTML = "&times;";
closeButton.style.position = "absolute";
closeButton.style.top = "-15px";
closeButton.style.right = "10px";
closeButton.style.color = "#fff";
closeButton.style.fontSize = "30px";
closeButton.style.cursor = "pointer";
closeButton.style.zIndex = "1001";
closeButton.style.background = "rgba(0, 0, 0, 0.6)";
closeButton.style.borderRadius = "50%";
closeButton.style.padding = "5px";

closeButton.onclick = () => {
  container.remove();
};

document.body.appendChild(container);
container.appendChild(videoElement);
container.appendChild(closeButton);

const imaScript = document.createElement("script");
imaScript.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
imaScript.onload = () => {
    console.log("IMA SDK loaded successfully!");
    setupIMA();
};
document.head.appendChild(imaScript);

let adsLoader;
let adsManager;
let adDisplayContainer;
let adsInitialized = false;

function setupIMA() {
    const adContainer = document.createElement("div");
    adContainer.id = "ad-container";
    adContainer.style.position = "absolute";
    adContainer.style.top = "0";
    adContainer.style.left = "0";
    adContainer.style.width = "100%";
    adContainer.style.height = "100%";
    adContainer.style.zIndex = "1002";
    adContainer.style.pointerEvents = "none"; 
    container.appendChild(adContainer); 

    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded
    );
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError
    );

    videoElement.addEventListener('ended', () => {
        adsLoader.contentComplete();
    });

    requestAds();
}

function requestAds() {
    const adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&output=vast";

    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    console.log("Sending ad request...");
    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(event) {
    console.log('Ads Manager Loaded');
    adsManager = event.getAdsManager(videoElement);

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
        videoElement.pause();
        adContainer.style.pointerEvents = "auto";
    });
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
        videoElement.play();
        adContainer.style.pointerEvents = "none";
    });

    try {
        adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (e) {
        console.warn("AdsManager could not be started:", e);
        videoElement.play();
    }
}

function onAdError(error) {
    console.warn("Ad Error:", error.getError());
    if (adsManager) adsManager.destroy();
    videoElement.play();
}

videoElement.addEventListener('play', function initAdsOnce() {
    if (adsInitialized) return;
    adsInitialized = true;

    adDisplayContainer.initialize();
    setupIMA();

    videoElement.removeEventListener('play', initAdsOnce);
}, { once: true });

window.addEventListener('resize', () => {
    if (adsManager) {
        adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
    }
});
