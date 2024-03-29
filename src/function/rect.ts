export function contains(rect: DOMRect, x: number, y: number): boolean
{
    return (x > rect.left && x < rect.right) && (y > rect.top && y < rect.bottom);
}
