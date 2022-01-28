export function indexOf(element: Element|undefined): number|undefined
{
    return element && element.parentNode
        ? Array.from(element.parentNode.children).indexOf(element)
        : undefined;
}

export function toggleAttribute(element: Element, key: string): void
{
    if(Array.from<Attr>(element.attributes).some(i => i.name === key))
    {
        element.attributes.removeNamedItem(key);
    }
    else
    {
        let attr = document.createAttribute(key);
        attr.value = '';
        element.attributes.setNamedItem(attr);
    }
}

export function setAttributeOnAssert(element: Element, condition: boolean, name: string, value: any = ''): void
{
    if(Array.isArray(name))
    {
        for(let n of name)
        {
            setAttributeOnAssert(element, condition, n, value);
        }
    }
    else if(condition === true)
    {
        let attr = document.createAttribute(name);
        attr.value = value;

        element.attributes.setNamedItem(attr);
    }
    else if(condition === false && element.attributes.getNamedItem(name) !== null)
    {
        element.attributes.removeNamedItem(name);
    }
}

export function setClassOnAssert(element: Element, condition: boolean, name: string, ...alt: Array<string>): void
{
    if(condition)
    {
        element.classList.add(name);
        element.classList.remove(...alt);
    }
    else
    {
        element.classList.remove(name);
        element.classList.add(...alt);
    }
}