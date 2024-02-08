## ESLint Rule: `require-return-types-for-object-literals`

Requires return types on lambdas that return object literals.

### Installation

```bash
npm install --save-dev eslint-plugin-return-types-object-literals
```

**.eslintrc.yaml:**

```yaml
root: true
parser: "@typescript-eslint/parser"
parserOptions:
  project: "./tsconfig.json"
plugins:
  - "@typescript-eslint"
  - "return-types-object-literals" # ← Add this
rules:
  # ↓ And this:
  "return-types-object-literals/require-return-types-for-object-literals": error
```

### Examples

```typescript
// Error: "Return type missing"
const a = () => ({
  propA: true,
  propB: true
});

// Error: "Return type missing"
const b = () => {
  return {
    propA: true,
    propB: true
  };
};

// OK
const a2 = (): Foo => ({
  propA: true,
  propB: true
});

// OK
const b2 = (): Foo => {
  return {
    propA: true,
    propB: true
  };
};

// OK
const c = () => {
  const result = {
    propA: true,
    propB: true
  };

  return result;
};
```

### Benefits

Ensures excess property checking is performed on objects returned by lambdas.

Without return types on lambdas that return object literals, the object literals will not undergo excess property checking. See below:

```typescript
type Foo = { a: boolean }

function foo(callback: () => Foo): void {
  ...
}

foo(() => ({
  a: true,
  b: false // BAD: no excess property error
}))

foo((): Foo => ({
  a: true,
  b: false // GOOD: excess property error
}))
```

#### Why does this occur?

Without a return type, the lambda's return type will be inferred to be a supertype of the type you actually want. This means no excess property checking will occur, as the inferred return type will automatically contain every property you specify. The resulting lambda instance will then be silently assignable to any lambda variable whose return type is a subtype, since [lambda return types are covariant](https://basarat.gitbook.io/typescript/type-system/type-compatibility#return-type).

In the example above, the first lambda instance (line 7) is inferred as type `() => Foo & { b: boolean }`, which is subsequently assigned to the variable `callback: () => Foo` on line 3, which is allowed because `Foo & { b: boolean }` is a supertype of `Foo`. In line 12 we fix this by preventing TypeScript from inferring a supertype.

### Credits

The following resources were very useful when writing this plugin:

- [Writing custom TypeScript ESLint rules: How I learned to love the AST](https://dev.to/alexgomesdev/writing-custom-typescript-eslint-rules-how-i-learned-to-love-the-ast-15pn)
- [AST Explorer](https://astexplorer.net/)
  - Set language 'JavaScript'
  - Set parser to '@typescript-eslint/parser'

### License

[MIT](LICENSE)
