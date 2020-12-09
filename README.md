# MathInv-2021: Applying DEs into Computing using Types and integrating a programming language interface
Repo for MathInv /w [Camto](https://github.com/Camto)

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
|  **General second-order**   |                                                          Second-order                                                           |                                     Multiply both sides of equation by 2dy/dx, substitute <img style="transform: translateY(0.25em);" src="svg\mZFGws6tNO.svg"/>, then integrate twice                                      |
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
call
print + 1 1  4

+ 1 1
print ?? 4

map 'inc [1 2 3]
map inc [1 2 3]

+ {x + 1} {x^2}

[key: "value" a: 4]

print "bruh" print 1
```

### Meat: Implementation of a GUI with all previously established features.
- Blah Blah Blah Blah Blah

### Skin and Makeup: Polishing GUI and any remaining features/tweaks.
- Blah Blah Blah Blah Blah Blah

### Raising the child: Updates and upkeep until we don't need this anymore.
- Blah Blah Blah Blah Blah Blah Blah