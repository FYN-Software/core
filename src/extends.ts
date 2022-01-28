import {
    waitFor as eventWaitFor,
    on as eventOn,
    dispatch,
} from './event.js';
import {
    range as numberRange,
} from './function/number.js';

Object.defineProperties(EventTarget.prototype, {
    on: {
        value<T extends Element = Element, TEvents extends object = {}>(
            this: T,
            selector: string|EventListenerConfig<T, TEvents>,
            settings?: EventListenerConfig<T, TEvents>
        ): EventTarget
        {
            if(settings !== undefined && typeof selector === 'string')
            {
                if(settings.hasOwnProperty('options') === false)
                {
                    settings.options = {};
                }

                settings.options!.selector = selector;
            }

            eventOn(this, settings ?? (selector as EventListenerConfig<T, TEvents>));

            return this;
        }
    },
    emit: {
        value<T = any>(this: EventTarget, name: string, detail?: T, options: Partial<EventInit> = {}): CustomEvent<T>
        {
            return dispatch(this, name, {
                bubbles: true,
                composed: false,
                ...options,
                detail,
            });
        }
    },
    await: {
        async value(event: string): Promise<any>
        {
            return eventWaitFor(this, event);
        },
    },
});

if(typeof DocumentFragment !== 'undefined')
{
    Object.defineProperties(DocumentFragment.prototype, {
        innerHTML: {
            get()
            {
                console.warn('deprecated, `DocumentFragment.innerHTML` will be removed');

                const div = document.createElement('div');
                div.appendChild(this.cloneNode(true));

                return div.innerHTML;
            }
        },
    });
}

if(typeof HTMLTemplateElement !== 'undefined')
{
    Object.defineProperties(HTMLTemplateElement.prototype, {
        innerHTML: {
            get()
            {
                console.warn('deprecated, `HTMLTemplateElement.innerHTML` will be removed');

                const div = document.createElement('div');
                div.appendChild(this.content.cloneNode(true));

                return div.innerHTML;
            }
        },
    });
}

if(typeof window !== 'undefined')
{
    Object.defineProperties(window, {
        range: { value: numberRange },
    });
}