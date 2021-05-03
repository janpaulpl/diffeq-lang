## Algorithm for differentiating with Dual Numbers: Mathematical

```
function prod_rule(a, b) for f(x)=g(x)h(x):
f(a+bϵ)g(a+bϵ)h(a+bϵ)
:= (g(a)+g′(a)bϵ)(h(a)+h′(a)bϵ)
:= g(a)h(a)+(g′(a)h(a)+g(a)h′(a))bϵ
return f′(a)=g′(a)h(a)+g(a)h′(a)
function chain_rule(a,b) for f(x)=g(h(x)):
f(a+bϵ)
:= g(h(a+bϵ))
:= g(h(a)+h′(a)bϵ)
:= g(h(a))+g′(h(a))h′(a)bϵ
return f′(a)=g′(h(a))h′(a)
```

