# MathInv-2021: Domain Specific Language for differential equations with Scott-Strachey semantics
Repo for MathInv /w [Camto](https://github.com/Camto)

## The Language

Diffeq uses Polish notation, so every operator and function call is simply placed in front of its arguments:

```
 print + 1 2;
 print - 4 1;
 
 print "Hello, world!";
```

As you can see in the example above, semicolons separate statements. But the last semicolon in a series of statements is optional:

```
 print cos pi
```

Use the "Get" button next to the result after running the previous program to reuse it. It will insert a `??n` with some number representing the result as a value.

### Comments

Comments are made with `#( comment )`

```
 #(Add 1 to the first result in the console, assuming it's a number)
 + ??0 1
```

### Variables

Variables can be declared locally with `:=`, and modified/declared globally with `=`

```
 a = 5
```

```
 print a
```

Those will share `a`

### Control Structures

The normal control structures can be used, such as `if`/`elif`/`else`, `for`, and `while`:

```
 #(Here's also an example of booleans!)
 if false:
     print 1
 elif true:
     print 2
 else
     print 3
 end
```

```
 #(Use the "Get all" button after this code runs to get all its results as a list.)
 
 #(And here's an example of list syntax.)
 for n [1 2 3]:
     print + n 1
 end
```

```
 #(Since i is local here, it would cease to exist after running this.)
 i := 5;
 while > i 0:
     i = - i 1;
     print i
 end
```

(Be careful pasting code with newlines into the console, newlines are always stripped out. That's is why these samples have a space before each line.)

Much like semicolons, `end`s are optional, it just means the block goes until the end:

```
 for n [1 2 3]:
     print + n 1
```

With all of this shown off, here is FizzBuzz, using the result from the `if`/`elif`/`else` as a value:

```
 for n range 1 101:
     print
         if %% n 15: "FizzBuzz"
         elif %% n 3: "Fizz"
         elif %% n 5: "Buzz"
         else n
```

`range` simply generates a list as a range starting at and including the first number, and ending at but *excluding* the second number:

```
 #(Notice where each list starts and stops.)
 print range 0 5;
 print range 5 0
```

`%%` is similar to the `%` that you may have seen, it returns whether or not the first number is a multiple of the second one.

```
 print %% 4 2; #(true)
 print %% 5 3 #(false)
```


### Defining Functions

Functions are made with the `fun` keyword, and return implicitly:

```
 fun add a b:
     + a b
```

```
 add 3 4
```

Here's the classic fibonacci function defined recursively:

```
 fun fib n:
     if <= n 1:
         n
     else
         +  fib - n 1  fib - n 2
```

```
 for n range 0 11:
     print fib n
```

### Data Types

The language has
- Numbers, with no distinction between integers and real numbers, as in JavaScript
  - `1`
  - `4.5`
- Booleans
  - `true`
  - `false`
- Strings
  - `"Hello"`
  - `"Weeee 123 +-*/"`
- Lists, with no commas needed to separate items
  - `["a" "b" "c"]`
- Dictionaries, similar to lists, which can havee values fetched like `.key #[:key "value"]`
  - `#[:key "value"  :other_key "other value"]`
- Mathematical expressions, using the expression sublanguage
  - `{x^2 - 1}`
  - `{ln(x)}`
- Functions
  - `` `increment``
  - `anon x: + x 1 end`

### Operators

#### Comparison

- `== a b` checks for equality between any two types but expressions.
- `!= a b` checks for inequality in the same way.
- `<= n m` checks if a number is less than or equal to another.
- `>= n m` checks if a number is more than or equal to another.
- `< n m` checks if a number is less than another.
- `> n m` checks if a number is more than another.

#### Arithmetic

- `+ n m` adds two numbers or strings.
- `~ n` negates a number.
- `- n m` subtracts a number from another.
- `* n m` multiplies two numbers.
- `/ n m` divides a number by another.

#### Extra math

- `^ n m` exponentiates a number by another.
- `%% n m` checks if a number can be divided by another.
- `% n m` returns the modulo of a number being divided by another.

#### Calculus

- `' expr` derives a mathematical expression.

#### List/dictionary indexing

- `@= list idx val` takes 3 arguments, the list/dictionary, the index/key, and the new value. It then updates the list/dictionary at that index/key putting the value.
- `@ list idx` takes 2 arguments, the list/dictionary and the index/key. It then returns the value at that index/key.

#### Boolean

- `& n m` ands two booleans.
- `| n m` ors two booleans.
- `! n` nots a boolean.

#### Special interaction

- `?` gets the last result from the console.
- `?? idx` gets the result from the console at that index, where the very first result is at the index `0`.

### Built-in functions

#### Basic

- `print thing` simply prints out a result, keeping its type if it's fetched later.
- `call fun a b c...` calls a function with the other arguments.
  - ```
     fun add n m:
         + n m
     end;
     print add 3 4;
     print call `add 3 4
    ```

#### Lists

- `len list` gets the length of a list.
- `map fun list` makes a new list by calling a function on all of a list's items.
  - ```
     fun increment x:
         + x 1
     end;
     map `increment [3 5 7]
    ```
- `filter fun list` makes a new list by calling a function on all of a list's items and keeping only the ones that give `true`
  - ```
     filter anon n: %% n 2 end range 0 10
    ```
- `reduce fun accumulator list` calls the function on the accumulator and the first item in the list and stores the result back in the accumulator. It repeats this for each item in the list.
  - ```
     fun add accumulator current_value:
         + accumulator current_value
     end;
     reduce `add 0 range 1 4
    ```
- `times n` makes a list of `0`s with that many items.
  - ```
     for _ times 5:
         print "Hello!"
    ```
- `range start stop` generates a list as a range starting at and including the first number, and ending at but *excluding* the second number.
  - `range 0 10`
- `srange start stop step` generates a list the same way as `range` except that instead of the numbers being 1 apart, they are `step` apart.
  - ```
     srange 0 10 2;
     srange 10 0 ~2
    ```
- `enum list` gives the list of indexes for that list.

#### Mathematics

- `pi` returns the constant pi.
- `tau` returns the constant tau.
- `e` returns the constant e.
- `sin n` calculates the sine of a number.
- `cos n` calculates the cosine of a number.
- `tan n` calculates the tangent of a number.
- `cot n` calculates the cotangent of a number.
- `sec n` calculates the secant of a number.
- `csc n` calculates the cosecant of a number.

#### Mathematical Expressions

- `show_expr expr` shows the string version of a mathematical expression value.
- `eval expr x` evaluates a mathematical expression at a given value for `x`.
- `num_diff expr x` evaluates the numeric differential of a mathematical expression at a given value for `x`.

#### Settings

- `set_size width height` sets the size of the expression grapher to the given width and height.
- `set_zoom zoom` sets the zoom of the expression grapher to a number.

### Everything Allowed in the Mathematical Expressions

- Numbers, including `pi`/`π`, `tau`/`τ`, and `e`
- The operators `+` `-` `*` `/` `^` all in infix form (so `1 + 2` instead of `+ 1 2` like the rest of the language)
- The variable `x`
- Parentheses
- Calling certain functions with parenthesis (so `cos(pi)` instead of `cos pi`, again unlike the rest of the language)
  - `abs(x)` absolute value
  - `sqrt(x)` square root
  - `cbrt(x)` cube root
  - `ln(x)` natural logarithm
  - `sin(x)` sine
  - `cos(x)` cosine
  - `tan(x)` tangent
  - `cot(x)` cotangent
  - `sec(x)` secant
  - `csc(x)` cosecant
  - `root(n, x)` the `n`th root of `x`
  - `log(b, x)` log base `b` of `x`

Not everything can be symbolically derived yet, though.

## About
Fancy website lets you go wooooo with differentials.

## Workflow

### Skeleton: We love math; Declaration of differential equations and how we will use/integrate them.

> *Disclaimer*: Those marked with a *?* are too sketch to be done (aka partial differentiation too complex to complete).
>
> *Disclaimer*: There is an entire thing called "The guessing method" which consists of making the code guess the solution, and that would be way too complicated and would probably require an AI, so this method will not be taken into consideration.

#### Ordinary Differential Equations:

|           *Type*            |                                                     *Differential Equation*                                                     |                                                                                                                                                                  *Solution Method*                                                                                                                                                                  |
| :-------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Separable (First-order)** |        Separable in x <br> Separable in x and y; general case <br> Autonomous; separable in y <br> Separable in x and y         |                                                                                                         Direct integration <br> Separation of variables; divide by P2Q1 <br> Separation of variables; divide by F <br> Integrate throughout                                                                                                         |
|   **General first-order**   |                      Homogeneous <br> Separable <br> Exact differential *?* <br> Inexact differential *?*                       | Set y = ux; then solve by separation of variables in u and x <br> Separation of variables; divide by xy <br> Integrate throughout <br> Integration factor μ(x, y), satisfying <img style="transform: translateY(0.25em);" src="svg\lYJMJJoFaU.svg"/> |
|  **General second-order**   |                                                          Second-order *?*                                                           |                                     Multiply both sides of equation by 2dy/dx, substitute <img style="transform: translateY(0.25em);" src="svg\mZFGws6tNO.svg"/>, then integrate twice                                      |
| **Linear to the nth order** | Second-order; linear; inhomogeneous; constant coefficients *?* <br> nth-order; linear; inhomogeneous; constant coefficients *?* |                             Complementary function y_c: assume y_c = e^αx, substitute and solve polynomial in α, to find the linearly independent functions <img style="transform: translateY(0.25em);" src="svg\oIEmtTQuDH.svg"/>. <br> Same as previous.                              |

### Arteries and Veins: Syntax, features, and semantics.

- Have a convenient syntax to input
  - That means deciding what subset of maths is allowed
- Be able to auto-derive/integrate
- Graph and display them
  - Possibly make the graph interactive, a la Mathematica

#### Syntax

Polish Notation

```
if == x y:
	print "same";
	+ 2 3
else
	print "diff";
	+ 1 2
end;

if a:
	1
elif b:
	2
else
	3
end;

if a:
	1
elif b:
	2
end;

+ 1 2;

for x [2 3]: print x end;

x = 3;
y'' = [2 3 4];

fun fib n a b: if == n 0: a else fib  - n 1  b  + a b end end;

call;
print + 1 1  4;

+ 1 1;
print ?? 4;

map `inc [1 2 3];
map anon n: + n 1 end [1 2 3];

+ "x \"+ 1" "x^2";

#[:key "val\n\[ue" :a 4];

print "bruh" print 1;
```