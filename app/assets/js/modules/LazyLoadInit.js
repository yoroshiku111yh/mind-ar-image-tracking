import LazyLoad from "vanilla-lazyload";

export default class LazyLoadInit {
    constructor() {
        this.init();
        this.testPromise();
    }
    init() {
        const lazy = new LazyLoad();
        lazy.update();
    }
    async testPromise() {
        const dummy = await this.resolveAfter2Seconds();
        console.log(dummy);
    }
    resolveAfter2Seconds() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(1 + 1);
            }, 2000);
        });
    }
}