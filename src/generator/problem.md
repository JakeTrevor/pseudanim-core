problem:

in order to show how data moves in a visual way (with data actually moving) you need to know where it starts and where it ends

where it ends is relatively easy - it is simply the representation of the stateframe

where it starts is much harder; you need to compute a 'from' value - that is to say, a reference from which the value is generated

this seems trivial in a simple case such as:

```
a = 12
b = a
```

but the difficulty becomes apparent as soon as you introduce a more complex case:

```
a = 12
b = 14
c = a + b
```

In this case, it isn't clear that there is a single 'from' value to be computed - rather, there are two distinct sources. The proper visual intuition for smehing like this might be hacing the data move from two locations and then combine in some sense.

The work I am doing at the minute however does not require such finesse; consider the following example:

```
a = [1, 2, 3]
b = 0
c = a[b]
```

in this case, the data held in `c` comes from `a[0]` - at least, in my view that is the most sensible way to understand this.

However, how should the compiler/interpreter extract this information?

is it always the case, for example, that `array[x]` should always be understood as coming from mem-object "arr-item-x"? or can we devise a rule that otherwise defines it?

the way to proceed is as follows:
if there is a general rule, and it is possible to infer the information, then we should attempt to do so; this has much greater usability.

However, this solution is also much harder. a better way to approach the problem might be to require the user to explicitly annotate the source for new data changes.

indeed, such a system is likey to be quite useful as a way to override the inference in cases where the default behaviour is incorrect.

therefore the first thing I will focus on is adding the syntax for 'from' annotations, to indicate where a new value comes from.

the disadvantage here is that checking such a system becomes even more complex; fortunately, I have decided to ignore checking for now as it is too complex to implement.
