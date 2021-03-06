data Variable = Variable {val :: Double, dot :: Double} deriving (Eq, Show)

add variable other = Variable {val = val variable + val other, dot = dot variable + dot other}

forwardDf x dx =
  let
    a = x * x
    da = dx * x + x * dx
    
    b = x * a
    db = dx * a + x * da
    
    c = a + b
    dc = da + db
  in
    (c, dc)