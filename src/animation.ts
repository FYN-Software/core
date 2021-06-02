type AnimationOptions = {
    duration?: number,
    easing?: (t: number) => number,
};

export default class Animation
{
    public static linear(t: number): number
    {
        return t;
    }

    public static inQuad(t: number): number
    {
        return Animation.in(t, 2);
    }

    public static outQuad(t: number): number
    {
        return Animation.out(t, 2);
    }

    public static inOutQuad(t: number): number
    {
        return Animation.inOut(t, 2);
    }

    public static inCubic(t: number): number
    {
        return Animation.in(t, 3);
    }

    public static outCubic(t: number): number
    {
        return Animation.out(t, 3);
    }

    public static inOutCubic(t: number): number
    {
        return Animation.inOut(t, 3);
    }

    public static inQuart(t: number): number
    {
        return Animation.in(t, 4);
    }

    public static outQuart(t: number): number
    {
        return Animation.out(t, 4);
    }

    public static inOutQuart(t: number): number
    {
        return Animation.inOut(t, 4);
    }

    public static inQuint(t: number): number
    {
        return Animation.in(t, 5);
    }

    public static outQuint(t: number): number
    {
        return Animation.out(t, 5);
    }

    public static inOutQuint(t: number): number
    {
        return Animation.inOut(t, 5);
    }

    public static in(t: number, d: number = 2): number
    {
        return t**d;
    }

    public static out(t: number, d: number = 2): number
    {
        return 1 - t**d;
    }

    public static inOut(t: number, d: number = 2): number
    {
        return t**d / (t**d + (1 - t)**d);
    }

    public static ease(callback: (value: number) => void, options: AnimationOptions = {})
    {
        const { duration = 300, easing = Animation.inOutCubic }: AnimationOptions = options;

        if(typeof easing !== 'function' && Animation.hasOwnProperty(easing) === false)
        {
            throw new Error(`'${easing}' is not a valid method of 'Easing'`);
        }

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
}

export const ease = Animation.ease;
