export default class Animation
{
    static linear(t)
    {
        return t;
    }

    static inQuad(t)
    {
        return Animation.in(t, 2);
    }

    static outQuad(t)
    {
        return Animation.out(t, 2);
    }

    static inOutQuad(t)
    {
        return Animation.inOut(t, 2);
    }

    static inCubic(t)
    {
        return Animation.in(t, 3);
    }

    static outCubic(t)
    {
        return Animation.out(t, 3);
    }

    static inOutCubic(t)
    {
        return Animation.inOut(t, 3);
    }

    static inQuart(t)
    {
        return Animation.in(t, 4);
    }

    static outQuart(t)
    {
        return Animation.out(t, 4);
    }

    static inOutQuart(t)
    {
        return Animation.inOut(t, 4);
    }

    static inQuint(t)
    {
        return Animation.in(t, 5);
    }

    static outQuint(t)
    {
        return Animation.out(t, 5);
    }

    static inOutQuint(t)
    {
        return Animation.inOut(t, 5);
    }

    static in(t, d = 2)
    {
        return t**d;
    }

    static out(t, d = 2)
    {
        return 1 - t**d;
    }

    static inOut(t, d = 2)
    {
        return t**d / (t**d + (1 - t)**d);
    }

    static ease(callback, options = {})
    {
        let { duration, easing } = Object.assign({
            duration: 300,
            easing: Animation.inOutCubic,
        }, options);

        if(typeof easing !== 'function' && Animation.hasOwnProperty(easing) === false)
        {
            throw new Error(`'${easing}' is not a valid method of 'Easing'`);
        }

        let start;
        let elapsed;

        let animation = (time = 0) => {
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
