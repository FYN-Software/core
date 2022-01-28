import { on, waitFor, dispatch } from './event.js';

export function enhancedEventTarget<T extends Constructor<EventTarget>, TEvents extends EventDefinition>(base: T): T
{
    return class extends base implements CustomTarget<any, TEvents>
    {
        readonly events!: TEvents

        on(selector: string|EventListenerConfig<PrototypeOf<T>, TEvents>, settings?: EventListenerConfig<PrototypeOf<T>, TEvents>)
        {
            if(settings !== undefined && typeof selector === 'string')
            {
                if(settings.hasOwnProperty('options') === false)
                {
                    settings.options = {};
                }

                settings.options!.selector = selector;
            }

            on(this, settings ?? selector);

            return this;
        }

        emit<K extends (keyof TEvents)&string>(event: K, detail?: TEvents[K], init?: Partial<EventInit>): CustomEvent<TEvents[K]>
        {
            return dispatch(this, event, {
                bubbles: true,
                composed: false,
                ...init,
                detail,
            });
        }

        async await<K extends (keyof TEvents)&string>(event: K): Promise<TEvents[K]>
        {
            return waitFor(this, event);
        }
    }
}