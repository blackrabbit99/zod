import { ZodParser, ParseParams } from '../parser';
import { ZodErrorArrayCustomItem } from '../ZodError';

export enum ZodTypes {
  string = 'string',
  number = 'number',
  bigint = 'bigint',
  boolean = 'boolean',
  date = 'date',
  undefined = 'undefined',
  null = 'null',
  array = 'array',
  object = 'object',
  // interface = 'interface',
  union = 'union',
  intersection = 'intersection',
  tuple = 'tuple',
  record = 'record',
  function = 'function',
  lazy = 'lazy',
  lazyobject = 'lazyobject',
  literal = 'literal',
  enum = 'enum',
  promise = 'promise',
  any = 'any',
  unknown = 'unknown',
}

export type ZodTypeAny = ZodType<any>;
export type ZodRawShape = { [k: string]: ZodTypeAny };

// const asdf = { asdf: ZodString.create() };
// type tset1 = typeof asdf extends ZodRawShape ? true :false

type Check<T> = { message?: string; check: (arg: T) => boolean };
export interface ZodTypeDef {
  t: ZodTypes;
  checks?: Check<any>[];
  customError?: Partial<ZodErrorArrayCustomItem>;
}

export type TypeOf<T extends { _type: any }> = T['_type'];
export type Infer<T extends { _type: any }> = T['_type'];

//   interface Assertable<T> {
//     is(value: any): value is T;
//     assert(value: any): asserts value is T;
// }

export abstract class ZodType<Type, Def extends ZodTypeDef = ZodTypeDef> {
  readonly _type!: Type;
  readonly _def!: Def;

  // get subclass() {
  //   console.log(this.constructor);
  //   return this.constructor;
  // }

  parse: (x: Type | unknown, params?: ParseParams) => Type;

  is(u: Type): u is Type {
    try {
      this.parse(u as any);
      return true;
    } catch (err) {
      return false;
    }
  }

  check(u: Type | unknown): u is Type {
    try {
      this.parse(u as any);
      return true;
    } catch (err) {
      return false;
    }
  }

  refine = <Val extends (arg: this['_type']) => boolean>(check: Val, message: string) => {
    this._def.checks = this._def.checks || [];
    this._def.checks.push({ check, message });
    return this;
  };

  error(customError: Partial<ZodErrorArrayCustomItem> | string) {
      if(typeof customError === 'string') {
        this._def.customError = {message: customError}
      } else {
        this._def.customError = customError;
      }
      return this;
  }

  // mask = <P extends maskUtil.Params<Type>>(_params: P): ZodType<maskUtil.Pick<Type, P>> => {
  //   return Masker(this, _params) as any;
  // };

  // pick = <Params extends maskUtil.Params<Type>>(_params: Params): maskUtil.Mask<Type, Params> => {
  //   return 'asdf' as any;
  // };

  constructor(def: Def) {
    this.parse = ZodParser(def);
    this._def = def;
  }

  abstract toJSON: () => object;
  abstract optional: () => any;
  abstract nullable: () => any;
}
