declare type AnimationOptions = {
    duration?: number;
    easing?: (t: number) => number;
};
export default class Animation {
    static linear(t: number): number;
    static inQuad(t: number): number;
    static outQuad(t: number): number;
    static inOutQuad(t: number): number;
    static inCubic(t: number): number;
    static outCubic(t: number): number;
    static inOutCubic(t: number): number;
    static inQuart(t: number): number;
    static outQuart(t: number): number;
    static inOutQuart(t: number): number;
    static inQuint(t: number): number;
    static outQuint(t: number): number;
    static inOutQuint(t: number): number;
    static in(t: number, d?: number): number;
    static out(t: number, d?: number): number;
    static inOut(t: number, d?: number): number;
    static ease(callback: (value: number) => void, options?: AnimationOptions): void;
}
export declare const ease: typeof Animation.ease;
export {};
