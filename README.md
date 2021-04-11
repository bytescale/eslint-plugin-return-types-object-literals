# ESLint Rule: `return-types-object-literals/require-return-types-for-object-literals`

Requires return types on lambdas that return object literals:

```typescript
const a = () => ({ // Error: "Return type missing"
  propA: true,
  propB: true
})

const b = () => { // Error: "Return type missing"
  return {
    propA: true,
    propB: true
  }
}

const c = () => { // OK
  const result = {
    propA: true,
    propB: true
  }

  return result
}

const a2 = (): Foo => ({ // OK
  propA: true,
  propB: true
})

const b2 = (): Foo => { // OK
  return {
    propA: true,
    propB: true
  }
}
```

## Benefits

Ensures excess property checking is performed on objects returned by lambdas.

## Credits

The following article was very useful when writing this plugin:

[Writing custom TypeScript ESLint rules: How I learned to love the AST
](https://dev.to/alexgomesdev/writing-custom-typescript-eslint-rules-how-i-learned-to-love-the-ast-15pn)

## License

[MIT](LICENSE)
