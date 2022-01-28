declare type AnimationOptions = {
    duration?: number;
    easing?: (t: number) => number;
};
export declare const linear: (t: number) => number;
export declare const easeInQuad: (t: number) => number;
export declare const easeOutQuad: (t: number) => number;
export declare const easeInOutQuad: (t: number) => number;
export declare const easeInCubic: (t: number) => number;
export declare const easeOutCubic: (t: number) => number;
export declare const easeInOutCubic: (t: number) => number;
export declare const easeInQuart: (t: number) => number;
export declare const easeOutQuart: (t: number) => number;
export declare const easeInOutQuart: (t: number) => number;
export declare const easeInQuint: (t: number) => number;
export declare const easeOutQuint: (t: number) => number;
export declare const easeInOutQuint: (t: number) => number;
export declare const easeIn: (t: number, d?: number) => number;
export declare const easeOut: (t: number, d?: number) => number;
export declare const easeInOut: (t: number, d?: number) => number;
export declare function ease(callback: (value: number) => void, options?: AnimationOptions): void;
export {};
//# sourceMappingURL=animation.d.ts.map