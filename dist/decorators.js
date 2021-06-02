import Base from './base.js';
export function property(name) {
    return (target, key) => {
        Base.RegisterProperty(target);
    };
}
//# sourceMappingURL=decorators.js.map