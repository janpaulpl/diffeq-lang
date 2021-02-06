**Example of syntax for an imperative language**
```
<program> ::= main { <declarations> ; <statement> }
<declarations> ::= epsilon
| guard <boolexpression> => <statement> ; <declarations>
<statement> ::= <identifier> = <expression>
| <statement> ; <statement>
| if <boolexpression> then <statement> else <statement>
| repeat <statement> until <boolexpression>
<boolexpression> ::= <expression> < <expression>
| <expression> == <expression>
| not <boolexpression>
| <boolexpression> or <boolexpression>
<expression> ::= <number>
| <identifier>
| <expression> * <expression>
```
