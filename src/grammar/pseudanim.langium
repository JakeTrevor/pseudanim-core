grammar Pseudanim

entry Module:
    (statements+=Statement)*
;

Block:
    '{' (statements+=Statement)* '}'
;

Statement:
    Assignment | For | While | If | Expression
;

If:
    'if' condition=Expression code=Block
;

While:
    'while' condition=Expression code=Block
;

For:
    'for' var=Variable 'in' arr=Expression code=Block
;

Assignment:
    var=Variable path=Access? '=' val=(Expression)
;

Variable:
    name=ID
;

Expression:
    left=SimpleExpression right=Operation?
;

Operation:
    operand=("<"|">"|"<="|">="|"!=="|"=="|"+"|"-"|"*"|"/"|"^"|"%"|"["|"and"|"or") right=Expression
    | access=Access left=Operation?
;

SimpleExpression:
    (value=BOOLEAN | STRING | INT | ArrayLiteral |('(' Expression ')')) 
    | ref=ID
;

ArrayLiteral:
    '[' contents+=(RangeExpression | Expression)? (',' contents+=(RangeExpression | Expression))*']'
;

RangeExpression:
    start=Expression 'to' end=Expression
;

Access:
    Indexing
    | PropertyAccess
;

Indexing:
    ('[' path+=Expression ']')+
;

PropertyAccess:
    ('.' path+=ID)+
;

hidden terminal WS: /\s+/;

terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal BOOLEAN: /(true)|(false)/;
terminal INT returns number: /[0-9]+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;