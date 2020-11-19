# MathInv-2021: Applying DEs into Computing using Types and integrating a programming language interface
Repo for MathInv /w [Camto](https://github.com/Camto)

## Workflow

### Skeleton: We love math; Declaration of differential equations and how we will use/integrate them.

> *Disclaimer*: Those marked with a *?* are too sketch to be done (aka partial differentiation too complex to complete).
>
> *Disclaimer*: There is an entire thing called "The guessing method" which consists of making the code guess the solution, and that would be way too complicated and would probably require an AI, so this method will not be taken into consideration.

#### Ordinary Differential Equations:

|           *Type*            |                                                     *Differential Equation*                                                     |                                                                                                                                                                  *Solution Method*                                                                                                                                                                  |
| :-------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Separable (First-order)** |        Separable in x <br> Separable in x and y; general case <br> Autonomous; separable in y <br> Separable in x and y         |                                                                                                         Direct integration <br> Separation of variables; divide by P2Q1 <br> Separation of variables; divide by F <br> Integrate throughout                                                                                                         |
|   **General first-order**   |                      Homogeneous <br> Separable <br> Exact differential *?* <br> Inexact differential *?*                       | Set y = ux; then solve by separation of variables in u and x <br> Separation of variables; divide by xy <br> Integrate throughout <br> Integration factor μ(x, y), satisfying <!-- ${{\frac {\partial (\mu M)}{\partial x}}={\frac {\partial (\mu N)}{\partial y}}\,\!}$ --> <img style="transform: translateY(0.25em);" src="svg\lYJMJJoFaU.svg"/> |
|  **General second-order**   |                                                          Second-order                                                           |                                     Multiply both sides of equation by 2dy/dx, substitute <!-- $\displaystyle 2{\frac {dy}{dx}}{\frac {d^{2}y}{dx^{2}}}={\frac {d}{dx}}\left({\frac {dy}{dx}}\right)^{2}\,\!$ --> <img style="transform: translateY(0.25em);" src="svg\mZFGws6tNO.svg"/>, then integrate twice                                      |
| **Linear to the nth order** | Second-order; linear; inhomogeneous; constant coefficients *?* <br> nth-order; linear; inhomogeneous; constant coefficients *?* |                             Complementary function y_c: assume y_c = e^αx, substitute and solve polynomial in α, to find the linearly independent functions <!-- ${\displaystyle e^{\alpha _{j}x}}e^{\alpha _{j}x}$ --> <img style="transform: translateY(0.25em);" src="svg\oIEmtTQuDH.svg"/>. <br> Same as previous.                              |

#### What we'll do with each of these "DE Types"

* Do this
* Then do this
* Oh my god we are doing this

### Arteries and Veins: Syntax, features, and semantics.
* Blah Blah Blah Blah

### Meat: Implementation of a GUI with all previously established features.
* Blah Blah Blah Blah Blah

### Skin and Makeup: Polishing GUI and any remaining features/tweaks.
* Blah Blah Blah Blah Blah Blah

### Raising the child: Updates and upkeep until we don't need this anymore.
* Blah Blah Blah Blah Blah Blah Blah