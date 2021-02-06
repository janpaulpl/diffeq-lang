# Pop

***Temporary semantic domain***
```
t ∈ StackTransform = Stack → Stack
s ∈ Stack = Value ∗ +Error
v ∈ Value = Int + StackTransform
r ∈ Result = Value + Error
a ∈ Answer = Int + Error
1
Error = {error}
i ∈ Int = {. . . , −2, −1, 0, 1, 2, . . .}
b ∈ Bool = {true, false}
```
***Definition***
```
pop : StackTransform = λs.match s
⇒ (Value∗ → Stack (v.v∗))|(Value∗ → Stack v∗)
⇒ else errorStack
```

# Push
***Temporary semantic domain***
```

```
***Definition***
```
push : 
⇒ 
⇒ 
```