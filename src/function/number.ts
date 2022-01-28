export function clamp(subject: number, lowerBound: number, upperBound: number): number
{
    return Math.min(Math.max(subject, lowerBound), upperBound);
}

export function map(subject: number, lowerBoundIn: number, upperBoundIn: number, lowerBoundOut: number, upperBoundOut: number): number
{
    return (subject - lowerBoundIn) * (upperBoundOut - lowerBoundOut) / (upperBoundIn - lowerBoundIn) + lowerBoundOut;
}

export function mod(subject: number, radix: number): number
{
    return ((subject % radix) + radix) % radix;
}

export function range(start: number, end: number): Array<number>
{
    return Array(end - start).fill(1).map((_, i: number) => start + i);
}