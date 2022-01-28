export const linear = (t) => t;
export const easeInQuad = (t) => inExponent(t, 2);
export const easeOutQuad = (t) => outExponent(t, 2);
export const easeInOutQuad = (t) => inOutExponent(t, 2);
export const easeInCubic = (t) => inExponent(t, 3);
export const easeOutCubic = (t) => outExponent(t, 3);
export const easeInOutCubic = (t) => inOutExponent(t, 3);
export const easeInQuart = (t) => inExponent(t, 4);
export const easeOutQuart = (t) => outExponent(t, 4);
export const easeInOutQuart = (t) => inOutExponent(t, 4);
export const easeInQuint = (t) => inExponent(t, 5);
export const easeOutQuint = (t) => outExponent(t, 5);
export const easeInOutQuint = (t) => inOutExponent(t, 5);
export const easeIn = (t, d = 2) => t ** d;
export const easeOut = (t, d = 2) => 1 - t ** d;
export const easeInOut = (t, d = 2) => t ** d / (t ** d + (1 - t) ** d);
export function ease(callback, options = {}) {
    const { duration = 300, easing = inOutCubic } = options;
    let start;
    let elapsed;
    let animation = (time = 0) => {
        if (!start) {
            start = time;
        }
        elapsed = duration === 1
            ? duration
            : time - start;
        callback(easing(elapsed / duration));
        if (elapsed < duration) {
            requestAnimationFrame(time => animation(time));
        }
    };
    animation();
}
//# sourceMappingURL=animation.js.map