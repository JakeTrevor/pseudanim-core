# Pseudanim: A tool to animate arbitrary algorithms

---

## Background - why bother?

---

# How does Animation provides value

Do Theories of learning predict AV success?:
- Epistemic Fidelity (better animations = better learning) 
    - not really
- Individiual difference (different people need different resources)
    - yes.
- Cognitive constructivism (doing is better than seeing)
    - Yes!

---
# Design
---

# Animation is interpertation

- we are building an 'implicit animator'
    - animation is not explicitly constructed
    - motions are implied by the code

---

```
a = [1, 2, 3]
b = a[0]
c = 12
a[2] = c
```

---
## Animation is interpertation

- we are building an 'implicit animator'
    - animation is not explicitly constructed
    - motions are implied by the code

Only way to create the required motions is to execute code

- a tool that read code an executes it immediately is an interpreter

---
# Surprise! It's a PL talk!

---

## Construction of Interpreters

- most serious PL implementations use a 2-part architecture
- frontend transfoms source into tractable intermediary representation (IR)
- backend ingests IR and produces output
    - in classic compiler/interpreter executable
    - in our case, an animation!

---
## Intermediary Representation

What form should our IR take?

- we want to animate algorithms...
- algorithms modify memory...
- therefore we want to observe changes in memory...
- therefore our IR needs to represent these changes

NB this is not the traditional role of an IR.

Our IR provides a **strong architecutral boundary** between frontend and backend.


---
## Frontend - an interpreter in microcosm

- parse the language
- execute the language
- produce 'state frames'

---

# Backend

- take in a state frame
- represent it visually
- animate changes between state frames

---
## How did we implement it?

- JavaScript
- Langium for frontend 
    - very nice parser generator + AST
- React for backend (yes very confusing)
- GSAP for animation

---
## Key idea:
Lazy generation

- if we want to run any program...
- then we need to handle those that do not halt...
- JIT execution is the ideal way to do this...
- gives rise to the idea of a 'frame generator'...

---
# Quick demo

---
# Reflection

- learned a lot
- did not finish everything
- `from` is very hard
    - or really, we just didn't see it coming

- JS surprisingly good
    - Langium is excellent (when the docs are up to date)
- may want to re-evaluate the exact mechanism we use to create animations
    - SVGs look promising

---
# Any Questions?

---

# Thank you!
