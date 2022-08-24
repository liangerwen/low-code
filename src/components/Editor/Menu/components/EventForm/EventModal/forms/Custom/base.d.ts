type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type Primitive = undefined | null | boolean | string | number | Function;
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
interface DeepReadonlyMap<K, V>
  extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}
type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : DeepReadonlyObject<T>;
