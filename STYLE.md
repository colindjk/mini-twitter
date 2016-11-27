# Style Guidelines

The following style guidelines should be followed to ensure readabilty and reduce the probability of bugs.

## Use === and !== instead of == and !=
> It is considered good practice to use the type-safe equality operators `===` and `!==` instead of their regular counterparts `==` and `!=`.
>
> The reason for this is that `==` and `!=` do type coercion which follows the rather obscure [Abstract Equality Comparison Algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3). For instance, the following statements are all considered true:
  ```javascript
  [] == false
  [] == ![]
  3 == "03"
  ```

http://eslint.org/docs/rules/eqeqeq

## Two space indentation

Google, Facebook, Node.js and more use 2 spaces, no tabs, as the recommended best practice for indenting code blocks.

```javascript
// Good
if(a === b) {
  return true;
}

// Bad
if(a === b) {
return true;
}

// Also Bad
if(a === b) {
    return true;
}
```

http://eslint.org/docs/rules/indent

## Always use curly braces for block statements

> JavaScript allows the omission of curly braces when a block contains only one statement. However, it is considered by many to be best practice to never omit curly braces around blocks, even when they are optional, because it can lead to bugs and reduces code clarity. So the following:
  ```javascript
  if (foo) foo++;
  ```
> Can be rewritten as:
  ```javascript
  if (foo) {
    foo++;
  }
  ```

http://eslint.org/docs/rules/curly

## Limit Cyclomatic Complexity

> Cyclomatic complexity measures the number of linearly independent paths through a program's source code.

For this assignemnt, we will use a cyclomatic complexity of 15 as the limit. This means more than 15 code paths through a single function will result in a style violation

http://eslint.org/docs/rules/complexity


