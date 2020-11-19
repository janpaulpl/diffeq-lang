# Workflow

##### Those marked with a *?* are too sketch to be done (aka partial differentiation too complex to complete).

## Skeleton: We love math; Declaration of differential equations and how many data types we need.
* ### Ordinary Differential Equations:

| *Type*      | *Differential Equation* | *Solution Method* |
|    :----:   |    :----:   |    :----:     |
| **Separable**      | First-order (separable in x and y (general case, see below for special cases))       | Here's this   |
| **General first-order**   | Text        | And more      |
| **General second-order**   | Text        | And more      |
| **Linear to the nth order**   | Text        | And more      |

  * **Separable**: [A] First-order (separable in x and y (general case, see below for special cases)), 
                   [B] First-order (separable in x), 
                   [C] First-order, autonomous, separable in y, 
                   [D] First-order, separable in x and y.

  * **Solution Method**: [A] Separation of variables (divide by P2Q1),
                         [B] Direct integration,
                         [C] Separation of variables (divide by F),
                         [D] Integrate throughout.

  * **General first-order**: [E] First-order (homogeneous),
                             [F] First-order (separable),
                             [G] Exact differential (first-order) *?*,
                             [H] Inexact differential (first-order) *?*.

  * **Solution Method**: [E] Set y = ux, then solve by separation of variables in u and x,
                         [F] Separation of variables (divide by xy),
                         [G] Integrate throughout,
                         [H] Integration factor μ(x, y) satisfying.

  * **General second-order**: [I] Second-order (autonomous).

  * **Solution Method**: [I] Multiply both sides of equation by 2dy/dx, substitute {\displaystyle 2{\frac {dy}{dx}}{\frac {d^{2}y}{dx^{2}}}={\frac {d}{dx}}\left({\frac {dy}{dx}}\right)^{2}\,\!}2{\frac {dy}{dx}}{\frac {d^{2}y}{dx^{2}}}={\frac {d}{dx}}\left({\frac {dy}{dx}}\right)^{2}\,\!, then integrate twice.

  * **Linear to nth order**: [J] Second-order (linear) (inhomogeneous) (constant coefficients) 
                           [K] nth-order (linear) (inhomogeneous) (constant coefficients)

  * **Solution Method**: [J] Complementary function yc: assume yc = eαx, substitute and solve polynomial in α, to find the linearly independent functions {\displaystyle e^{\alpha _{j}x}}e^{\alpha _{j}x}.
Particular integral yp: in general the method of variation of parameters, though for very simple r(x) inspection may work.
                       [K] Complementary function yc: assume yc = eαx, substitute and solve polynomial in α, to find the linearly independent functions {\displaystyle e^{\alpha _{j}x}}e^{\alpha _{j}x}.
Particular integral yp: in general the method of variation of parameters, though for very simple r(x) inspection may work.

#### *Disclaimer*: There is an entire thing called "The guessing method" which consists of making the code guess the solution, and that would be way too complicated and would probably require an AI, so this method will not be taken into consideration.

## Arteries and Veins: Syntax, features, and semantics.
* Blah Blah Blah Blah

## Meat: Implementation of a GUI with all previously established features.
* Blah Blah Blah Blah Blah

## Skin and Makeup: Polishing GUI and any remaining features/tweaks.
* Blah Blah Blah Blah Blah Blah

## Raising the child: Updates and upkeep until we don't need this anymore.
* Blah Blah Blah Blah Blah Blah Blah