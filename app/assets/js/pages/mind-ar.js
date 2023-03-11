

export default class MindAr {
    constructor() {
        this.isMobile = navigator.userAgent.mobile;
        this.init();
    }
    init() {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'environment',
                width: {
                    min: 1280
                },
                height: {
                    min: 960
                }
            }
        })
        const sceneEl = document.querySelector('a-scene');

        this.testglsl();

        sceneEl.addEventListener("arReady", (event) => {
            const video = document.querySelector("video");
            const aScene = document.querySelector("a-scene");
            //ideo.style.opacity = 0;
            if (!this.isMobile) {
                video.style.transform = "scaleX(-1)";
                aScene.style.transform = "scaleX(-1)";
                //video.style.opacity = 1;
            }
        });
    }
    testglsl() {
        // shader-grid-glitch.js
        const scriptVertex = document.querySelector('#test-vertex').innerHTML;
        const scriptFragment = document.querySelector('#test-fragment').innerHTML;
        AFRAME.registerShader('grid-glitch', {
            schema: {
                //colorBg: { type: 'color', is: 'uniform' },
                timeMsec: { type: 'time', is: 'uniform' },
                timeHold : {type : 'float', is : 'uniform'},
                bg1 : { type : 'map', is: 'uniform' },
                bg2 : { type : 'map', is: 'uniform' }
            },
            vertexShader: scriptVertex,
            fragmentShader: scriptFragment
        });
    }

}