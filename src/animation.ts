type AnimationOptions = {
    duration?: number,
    easing?: (t: number) => number,
};

export const linear = (t: number): number => t;

export const easeInQuad = (t: number): number => inExponent(t, 2);
export const easeOutQuad = (t: number): number => outExponent(t, 2);
export const easeInOutQuad = (t: number): number => inOutExponent(t, 2);

export const easeInCubic = (t: number): number => inExponent(t, 3);
export const easeOutCubic = (t: number): number => outExponent(t, 3);
export const easeInOutCubic = (t: number): number => inOutExponent(t, 3);

export const easeInQuart = (t: number): number => inExponent(t, 4);
export const easeOutQuart = (t: number): number => outExponent(t, 4);
export const easeInOutQuart = (t: number): number => inOutExponent(t, 4);

export const easeInQuint = (t: number): number => inExponent(t, 5);
export const easeOutQuint = (t: number): number => outExponent(t, 5);
export const easeInOutQuint = (t: number): number => inOutExponent(t, 5);

export const easeIn = (t: number, d: number = 2): number => t**d;
export const easeOut = (t: number, d: number = 2): number => 1 - t**d;
export const easeInOut = (t: number, d: number = 2): number => t**d / (t**d + (1 - t)**d);

export function ease(callback: (value: number) => void, options: AnimationOptions = {})
{
    const { duration = 300, easing = inOutCubic }: AnimationOptions = options;

    let start: number;
    let elapsed: number;

    let animation = (time: number = 0) => {
        if(!start)
        {
            start = time;
        }

        elapsed = duration === 1
            ? duration
            : time - start;

        callback(easing(elapsed / duration));

        if(elapsed < duration)
        {
            requestAnimationFrame(time => animation(time));
        }
    };

    animation();
}
