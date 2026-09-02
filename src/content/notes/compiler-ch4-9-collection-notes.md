---
title: "编译原理章节笔记合集（4-9章：语法分析/语义/优化）"
date: "2025-06"
type: "learning"
tags: [编译原理, 语法分析, LL, LR, 语义分析, 代码优化]
summary: "编译原理第4-9章详细章节笔记合集，覆盖语法分析（LL/LR）、语法制导翻译、语义分析、代码优化（共28篇章节笔记合并）"
---

# 编译原理章节笔记合集（4-9章：语法分析/语义/优化）


---

## 章节：视频3.5.1 词法分析器的自动生成笔记

# 视频3.5.1 词法分析器的自动生成笔记

## 一、词法分析器自动生成工具概述
### 1.1 常用工具
- **Lex/Flex**：Unix/Linux系统下的经典词法分析器生成工具
- **JLex/JFlex**：Java语言的词法分析器生成工具
- **ANTLR**：支持多种语言的词法和语法分析器生成工具

### 1.2 Lex的基本思想
1. 用户提供正则表达式描述词法规则
2. Lex将正则表达式转换为NFA
3. 将NFA确定化为DFA
4. 化简DFA
5. 生成C语言代码的词法分析器

## 二、Lex程序结构
### 2.1 三部分结构
```lex
%{
/* C语言声明部分 */
#include <stdio.h>
%}

/* 正则定义部分 */
digit   [0-9]
letter  [a-zA-Z]
id      {letter}({letter}|{digit})*

%%
/* 规则部分：模式 + 动作 */
{id}    { printf("标识符: %s\n", yytext); }
{digit}+ { printf("整数: %s\n", yytext); }
"if"    { printf("关键字: if\n"); }
[ \t\n] ; /* 忽略空白字符 */
.       { printf("未知字符: %c\n", yytext[0]); }
%%

/* C语言辅助函数部分 */
int main() {
    yylex();
    return 0;
}
```

### 2.2 各部分说明
1. **声明部分（%{ ... %}）**：
   - 包含C语言头文件
   - 定义全局变量
   - 声明函数

2. **正则定义部分**：
   - 定义正则表达式的缩写
   - 格式：名字 正则表达式
   - 使用时用{名字}引用

3. **规则部分（%% ... %%）**：
   - 每条规则：模式 + 动作
   - 模式：正则表达式
   - 动作：C语言代码，用{ }包围
   - 最长匹配原则：优先匹配最长的词素
   - 优先匹配原则：如果多个模式匹配，优先选择前面的规则

4. **辅助函数部分**：
   - 包含main函数
   - 包含yywrap函数（如果需要）

## 三、Lex内部变量和函数
### 3.1 重要变量
- **yytext**：字符指针，指向当前匹配的词素
- **yyleng**：整数，当前匹配词素的长度
- **yyin**：FILE*，输入文件指针，默认为stdin
- **yyout**：FILE*，输出文件指针，默认为stdout

### 3.2 重要函数
- **yylex()**：词法分析主函数，返回下一个记号
- **yymore()**：将下一个匹配追加到yytext
- **yyless(n)**：将yytext的前n个字符保留，其余退回输入
- **unput(c)**：将字符c退回输入流
- **input()**：从输入流读取一个字符
- **yywrap()**：当yyin到达文件结束时调用，返回1表示结束，0表示继续处理另一个文件

## 四、正则表达式语法
### 4.1 基本元字符
- **.（点）**：匹配任意字符（除了换行符）
- ***（星号）**：匹配0次或多次
- **+（加号）**：匹配1次或多次
- **?（问号）**：匹配0次或1次
- **|（竖线）**：选择（或）
- **()（括号）**：分组
- **[]（方括号）**：字符类
- **^（脱字符）**：在方括号内表示补集，在行首表示行首
- **$（美元符号）**：表示行尾
- **{n,m}**：重复n到m次
- **\（反斜杠）**：转义字符

### 4.2 常用字符类
- **[0-9]**或**\d**：数字
- **[a-z]**：小写字母
- **[A-Z]**：大写字母
- **[a-zA-Z]**或**\w**：字母
- **[ \t\n\r]**或**\s**：空白字符
- **[^0-9]**或**\D**：非数字

### 4.3 示例
```lex
/* 标识符：字母开头，后跟字母或数字 */
id      [a-zA-Z][a-zA-Z0-9]*

/* 整数 */
integer [0-9]+

/* 浮点数 */
float   [0-9]+\.[0-9]+([eE][+-]?[0-9]+)?

/* 字符串（双引号） */
string  \"[^"]*\"

/* 注释（// 到行尾） */
comment \/\/.*$
```

## 五、Lex工作原理
### 5.1 处理流程
1. **读取Lex源文件**
2. **编译正则表达式**：
   - 将每个正则表达式转换为NFA
   - 使用ε-转移将所有NFA连接起来
   - 确定化为DFA
   - 化简DFA
3. **生成词法分析器**：
   - 生成状态转移表
   - 生成驱动程序
   - 生成yylex()函数

### 5.2 状态表示
Lex生成的DFA通常用转移表表示：
```c
typedef int State;
State transition[State][Char];
```

## 六、Lex与Yacc的配合
### 6.1 基本使用
- Lex负责词法分析，生成记号流
- Yacc负责语法分析，处理记号流
- Lex返回记号给Yacc

### 6.2 示例
**Lex文件（calc.l）**：
```lex
%{
#include "y.tab.h"
%}

digit   [0-9]
number  {digit}+

%%
{number} { yylval = atoi(yytext); return NUMBER; }
"+"      { return PLUS; }
"-"      { return MINUS; }
"*"      { return TIMES; }
"/"      { return DIVIDE; }
"("      { return LPAREN; }
")"      { return RPAREN; }
"\n"     { return NEWLINE; }
[ \t]    ; /* 忽略空白 */
.        { printf("未知字符\n"); }
%%

int yywrap() {
    return 1;
}
```

**Yacc文件（calc.y）**：
```yacc
%{
#include <stdio.h>
%}

%token NUMBER PLUS MINUS TIMES DIVIDE LPAREN RPAREN NEWLINE

%%
lines   : lines line
        | line
        ;

line    : expr NEWLINE { printf("= %d\n", $1); }
        | NEWLINE
        ;

expr    : expr PLUS term   { $$ = $1 + $3; }
        | expr MINUS term  { $$ = $1 - $3; }
        | term             { $$ = $1; }
        ;

term    : term TIMES factor { $$ = $1 * $3; }
        | term DIVIDE factor { $$ = $1 / $3; }
        | factor            { $$ = $1; }
        ;

factor  : LPAREN expr RPAREN { $$ = $2; }
        | NUMBER             { $$ = $1; }
        ;
%%

int main() {
    yyparse();
    return 0;
}

int yyerror(char *s) {
    printf("错误: %s\n", s);
}
```

**编译命令**：
```bash
yacc -d calc.y    # 生成y.tab.c和y.tab.h
lex calc.l         # 生成lex.yy.c
gcc y.tab.c lex.yy.c -o calc -ly -ll
```

## 七、实际应用
1. **编译器前端**：生成词法分析器
2. **文本处理工具**：grep、sed等的实现
3. **配置文件解析**：解析各种配置文件格式
4. **日志分析**：分析日志文件中的特定模式
5. **编程语言实现**：实现简单的脚本语言

## 八、常见问题
1. **最长匹配问题**：Lex总是选择最长的匹配
2. **优先级问题**：前面的规则优先级更高
3. **回溯**：Lex不使用回溯，保证线性时间复杂度
4. **EOF处理**：通过yywrap函数处理文件结束

---

## 章节：视频3.5.2 词法分析程序实现实例笔记

# 视频3.5.2 词法分析程序实现实例笔记

## 一、词法分析器的手工实现
### 1.1 实现策略
1. **用高级语言直接编写**：使用C、Java等语言编写状态机
2. **状态转移表驱动**：用表格表示状态转移
3. **递归下降**：用递归函数实现状态机

### 1.2 手工实现的优缺点
**优点**：
- 完全控制，灵活度高
- 可以针对特定情况优化
- 学习和理解词法分析原理

**缺点**：
- 开发效率低
- 容易出错
- 维护困难

## 二、简单词法分析器的手工实现（C语言）
### 2.1 需求分析
识别以下记号：
- 关键字：if, else, while, do, int
- 标识符：字母开头，后跟字母或数字
- 整数：数字序列
- 运算符：+, -, *, /, =, ==, !=, <, <=, >, >=
- 界符：(, ), {, }, ;, ,

### 2.2 记号定义
```c
typedef enum {
    TOK_EOF,        // 文件结束
    TOK_IF,         // if
    TOK_ELSE,       // else
    TOK_WHILE,      // while
    TOK_DO,         // do
    TOK_INT,        // int
    TOK_ID,         // 标识符
    TOK_NUM,        // 整数
    TOK_PLUS,       // +
    TOK_MINUS,      // -
    TOK_STAR,       // *
    TOK_DIV,        // /
    TOK_ASSIGN,     // =
    TOK_EQ,         // ==
    TOK_NE,         // !=
    TOK_LT,         // <
    TOK_LE,         // <=
    TOK_GT,         // >
    TOK_GE,         // >=
    TOK_LPAREN,     // (
    TOK_RPAREN,     // )
    TOK_LBRACE,     // {
    TOK_RBRACE,     // }
    TOK_SEMI,       // ;
    TOK_COMMA       // ,
} TokenType;

typedef struct {
    TokenType type;
    union {
        char *str;  // 标识符或关键字的字符串
        int num;    // 整数值
    } val;
} Token;
```

### 2.3 全局变量和辅助函数
```c
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>

#define MAX_ID_LEN 100

FILE *fp;
char lookahead;
Token current_token;

// 读取下一个字符
void next_char() {
    lookahead = fgetc(fp);
}

// 跳过空白字符
void skip_whitespace() {
    while (isspace(lookahead)) {
        next_char();
    }
}

// 读取标识符或关键字
Token read_id_or_keyword() {
    char buf[MAX_ID_LEN];
    int i = 0;
    
    while (isalnum(lookahead) || lookahead == '_') {
        if (i < MAX_ID_LEN - 1) {
            buf[i++] = lookahead;
        }
        next_char();
    }
    buf[i] = '\0';
    
    // 检查是否是关键字
    if (strcmp(buf, "if") == 0) {
        return (Token){TOK_IF, {.str = NULL}};
    } else if (strcmp(buf, "else") == 0) {
        return (Token){TOK_ELSE, {.str = NULL}};
    } else if (strcmp(buf, "while") == 0) {
        return (Token){TOK_WHILE, {.str = NULL}};
    } else if (strcmp(buf, "do") == 0) {
        return (Token){TOK_DO, {.str = NULL}};
    } else if (strcmp(buf, "int") == 0) {
        return (Token){TOK_INT, {.str = NULL}};
    }
    
    // 标识符
    return (Token){TOK_ID, {.str = strdup(buf)}};
}

// 读取整数
Token read_number() {
    int num = 0;
    while (isdigit(lookahead)) {
        num = num * 10 + (lookahead - '0');
        next_char();
    }
    return (Token){TOK_NUM, {.num = num}};
}
```

### 2.4 词法分析主函数
```c
Token next_token() {
    skip_whitespace();
    
    if (lookahead == EOF) {
        return (Token){TOK_EOF, {.str = NULL}};
    }
    
    if (isalpha(lookahead) || lookahead == '_') {
        return read_id_or_keyword();
    }
    
    if (isdigit(lookahead)) {
        return read_number();
    }
    
    // 处理运算符和界符
    char c = lookahead;
    next_char();
    
    switch (c) {
        case '+':
            return (Token){TOK_PLUS, {.str = NULL}};
        case '-':
            return (Token){TOK_MINUS, {.str = NULL}};
        case '*':
            return (Token){TOK_STAR, {.str = NULL}};
        case '/':
            return (Token){TOK_DIV, {.str = NULL}};
        case '=':
            if (lookahead == '=') {
                next_char();
                return (Token){TOK_EQ, {.str = NULL}};
            }
            return (Token){TOK_ASSIGN, {.str = NULL}};
        case '!':
            if (lookahead == '=') {
                next_char();
                return (Token){TOK_NE, {.str = NULL}};
            }
            break;
        case '<':
            if (lookahead == '=') {
                next_char();
                return (Token){TOK_LE, {.str = NULL}};
            }
            return (Token){TOK_LT, {.str = NULL}};
        case '>':
            if (lookahead == '=') {
                next_char();
                return (Token){TOK_GE, {.str = NULL}};
            }
            return (Token){TOK_GT, {.str = NULL}};
        case '(':
            return (Token){TOK_LPAREN, {.str = NULL}};
        case ')':
            return (Token){TOK_RPAREN, {.str = NULL}};
        case '{':
            return (Token){TOK_LBRACE, {.str = NULL}};
        case '}':
            return (Token){TOK_RBRACE, {.str = NULL}};
        case ';':
            return (Token){TOK_SEMI, {.str = NULL}};
        case ',':
            return (Token){TOK_COMMA, {.str = NULL}};
    }
    
    printf("未知字符: %c\n", c);
    return next_token();
}
```

### 2.5 测试程序
```c
const char *token_name(TokenType type) {
    switch (type) {
        case TOK_EOF: return "EOF";
        case TOK_IF: return "if";
        case TOK_ELSE: return "else";
        case TOK_WHILE: return "while";
        case TOK_DO: return "do";
        case TOK_INT: return "int";
        case TOK_ID: return "id";
        case TOK_NUM: return "num";
        case TOK_PLUS: return "+";
        case TOK_MINUS: return "-";
        case TOK_STAR: return "*";
        case TOK_DIV: return "/";
        case TOK_ASSIGN: return "=";
        case TOK_EQ: return "==";
        case TOK_NE: return "!=";
        case TOK_LT: return "<";
        case TOK_LE: return "<=";
        case TOK_GT: return ">";
        case TOK_GE: return ">=";
        case TOK_LPAREN: return "(";
        case TOK_RPAREN: return ")";
        case TOK_LBRACE: return "{";
        case TOK_RBRACE: return "}";
        case TOK_SEMI: return ";";
        case TOK_COMMA: return ",";
        default: return "unknown";
    }
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "用法: %s <输入文件>\n", argv[0]);
        return 1;
    }
    
    fp = fopen(argv[1], "r");
    if (!fp) {
        perror("无法打开文件");
        return 1;
    }
    
    next_char();
    
    Token token;
    do {
        token = next_token();
        printf("Token: %s", token_name(token.type));
        if (token.type == TOK_ID) {
            printf(" (%s)", token.val.str);
            free(token.val.str);
        } else if (token.type == TOK_NUM) {
            printf(" (%d)", token.val.num);
        }
        printf("\n");
    } while (token.type != TOK_EOF);
    
    fclose(fp);
    return 0;
}
```

## 三、用状态转移表实现
### 3.1 状态定义
```c
typedef enum {
    START,
    IN_ID,
    IN_NUM,
    IN_EQ,    // 刚刚看到'='
    IN_NE,    // 刚刚看到'!'
    IN_LT,    // 刚刚看到'<'
    IN_GT     // 刚刚看到'>'
} State;
```

### 3.2 状态转移表
```c
State transition[7][256];

void init_transition() {
    // 初始化所有状态为错误
    for (int i = 0; i < 7; i++) {
        for (int j = 0; j < 256; j++) {
            transition[i][j] = -1;
        }
    }
    
    // START状态
    for (int c = 0; c < 256; c++) {
        if (isalpha(c) || c == '_') {
            transition[START][c] = IN_ID;
        } else if (isdigit(c)) {
            transition[START][c] = IN_NUM;
        } else if (c == '=') {
            transition[START][c] = IN_EQ;
        } else if (c == '!') {
            transition[START][c] = IN_NE;
        } else if (c == '<') {
            transition[START][c] = IN_LT;
        } else if (c == '>') {
            transition[START][c] = IN_GT;
        }
    }
    
    // IN_ID状态
    for (int c = 0; c < 256; c++) {
        if (isalnum(c) || c == '_') {
            transition[IN_ID][c] = IN_ID;
        }
    }
    
    // IN_NUM状态
    for (int c = 0; c < 256; c++) {
        if (isdigit(c)) {
            transition[IN_NUM][c] = IN_NUM;
        }
    }
}
```

## 四、Java实现示例
### 4.1 简单词法分析器
```java
import java.io.*;
import java.util.*;

public class Lexer {
    private Reader reader;
    private int lookahead;
    
    public Lexer(Reader reader) throws IOException {
        this.reader = reader;
        this.lookahead = reader.read();
    }
    
    private void nextChar() throws IOException {
        lookahead = reader.read();
    }
    
    private void skipWhitespace() throws IOException {
        while (Character.isWhitespace(lookahead)) {
            nextChar();
        }
    }
    
    public Token nextToken() throws IOException {
        skipWhitespace();
        
        if (lookahead == -1) {
            return new Token(TokenType.EOF);
        }
        
        if (Character.isLetter(lookahead) || lookahead == '_') {
            StringBuilder sb = new StringBuilder();
            while (Character.isLetterOrDigit(lookahead) || lookahead == '_') {
                sb.append((char)lookahead);
                nextChar();
            }
            String id = sb.toString();
            if (isKeyword(id)) {
                return new Token(TokenType.valueOf(id.toUpperCase()));
            }
            return new Token(TokenType.ID, id);
        }
        
        if (Character.isDigit(lookahead)) {
            int num = 0;
            while (Character.isDigit(lookahead)) {
                num = num * 10 + (lookahead - '0');
                nextChar();
            }
            return new Token(TokenType.NUM, num);
        }
        
        char c = (char)lookahead;
        nextChar();
        
        switch (c) {
            case '+': return new Token(TokenType.PLUS);
            case '-': return new Token(TokenType.MINUS);
            case '*': return new Token(TokenType.STAR);
            case '/': return new Token(TokenType.DIV);
            case '=':
                if (lookahead == '=') {
                    nextChar();
                    return new Token(TokenType.EQ);
                }
                return new Token(TokenType.ASSIGN);
            case '!':
                if (lookahead == '=') {
                    nextChar();
                    return new Token(TokenType.NE);
                }
                break;
            case '<':
                if (lookahead == '=') {
                    nextChar();
                    return new Token(TokenType.LE);
                }
                return new Token(TokenType.LT);
            case '>':
                if (lookahead == '=') {
                    nextChar();
                    return new Token(TokenType.GE);
                }
                return new Token(TokenType.GT);
            case '(': return new Token(TokenType.LPAREN);
            case ')': return new Token(TokenType.RPAREN);
            case '{': return new Token(TokenType.LBRACE);
            case '}': return new Token(TokenType.RBRACE);
            case ';': return new Token(TokenType.SEMI);
            case ',': return new Token(TokenType.COMMA);
        }
        
        System.out.println("未知字符: " + c);
        return nextToken();
    }
    
    private boolean isKeyword(String id) {
        Set<String> keywords = new HashSet<>(Arrays.asList(
            "if", "else", "while", "do", "int"
        ));
        return keywords.contains(id);
    }
    
    public static void main(String[] args) throws IOException {
        if (args.length != 1) {
            System.err.println("用法: java Lexer <输入文件>");
            return;
        }
        
        Lexer lexer = new Lexer(new FileReader(args[0]));
        Token token;
        do {
            token = lexer.nextToken();
            System.out.println(token);
        } while (token.type != TokenType.EOF);
    }
}

enum TokenType {
    EOF, IF, ELSE, WHILE, DO, INT, ID, NUM,
    PLUS, MINUS, STAR, DIV, ASSIGN, EQ, NE, LT, LE, GT, GE,
    LPAREN, RPAREN, LBRACE, RBRACE, SEMI, COMMA
}

class Token {
    TokenType type;
    Object value;
    
    Token(TokenType type) {
        this(type, null);
    }
    
    Token(TokenType type, Object value) {
        this.type = type;
        this.value = value;
    }
    
    @Override
    public String toString() {
        if (value != null) {
            return type + "(" + value + ")";
        }
        return type.toString();
    }
}
```

## 五、实现要点
1. **前瞻字符**：总是向前看一个字符
2. **最长匹配**：尽可能匹配最长的词素
3. **关键字识别**：先识别为标识符，再查表判断是否为关键字
4. **错误处理**：遇到未知字符时跳过并继续
5. **缓冲管理**：正确处理字符的读取和回退

---

## 章节：视频4.1 语法分析简介笔记

# 视频4.1 语法分析简介笔记

## 一、语法分析的任务
### 1.1 语法分析器的作用
语法分析器是编译器的第二个阶段，它的主要任务是：
1. **接收词法分析器的输出**：记号（token）流
2. **验证语法正确性**：检查记号序列是否符合语言的语法规则
3. **构建语法树**：生成抽象语法树（AST）或语法分析树
4. **报告语法错误**：发现并报告语法错误
5. **错误恢复**：尽可能从错误中恢复，继续分析

### 1.2 语法分析器在编译器中的位置
```
源程序 → 词法分析器 → 记号流 → 语法分析器 → 语法树 → 语义分析器 → ...
```

## 二、上下文无关文法（CFG）
### 2.1 CFG的定义
上下文无关文法G = (V, T, P, S)，其中：
- **V**：非终结符的有限集合
- **T**：终结符的有限集合（V∩T=∅）
- **P**：产生式的有限集合，每个产生式形如A→α，其中A∈V，α∈(V∪T)*
- **S**：开始符号，S∈V

### 2.2 产生式的书写约定
- 非终结符：大写字母A, B, C, ...
- 终结符：小写字母a, b, c, ...，或运算符，或数字
- 希腊字母α, β, γ, ...：表示(V∪T)*中的串
- 相同左部的产生式可以合并：A→α|β|γ

### 2.3 示例文法
**简单算术表达式文法**：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | num
```
其中：
- 非终结符：E, T, F
- 终结符：+, -, *, /, (, ), id, num
- 开始符号：E

**简单语句文法**：
```
S → if ( E ) S
   | if ( E ) S else S
   | while ( E ) S
   | { L }
   | id = E ;
L → L S | S
E → E + E | E * E | ( E ) | id | num
```

## 三、推导和规约
### 3.1 推导的定义
给定文法G，从串α推导出串β，记作α ⇒ β，如果存在产生式A→γ，使得α = α1Aα2，β = α1γα2。

### 3.2 推导的类型
1. **最左推导**：每一步总是替换最左边的非终结符
2. **最右推导（规范推导）**：每一步总是替换最右边的非终结符

### 3.3 示例
**文法**：
```
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**句子**：id * id + id

**最左推导**：
```
E ⇒ E + T
  ⇒ T + T
  ⇒ T * F + T
  ⇒ F * F + T
  ⇒ id * F + T
  ⇒ id * id + T
  ⇒ id * id + F
  ⇒ id * id + id
```

**最右推导**：
```
E ⇒ E + T
  ⇒ E + F
  ⇒ E + id
  ⇒ T + id
  ⇒ T * F + id
  ⇒ T * id + id
  ⇒ F * id + id
  ⇒ id * id + id
```

### 3.4 规约
规约是推导的逆过程。从句子开始，逐步将串替换为产生式左部的非终结符，直到得到开始符号。

**最左规约（规范规约）**：对应最右推导的逆过程，每一步规约最左边的可规约串（句柄）。

## 四、语法分析树（分析树）
### 4.1 分析树的定义
给定CFG G=(V,T,P,S)，分析树是满足以下条件的树：
1. 根节点标记为S
2. 每个叶子节点标记为T∪{ε}中的符号
3. 每个内部节点标记为V中的符号
4. 如果内部节点A有子节点X1, X2, ..., Xn（从左到右），则存在产生式A→X1X2...Xn

### 4.2 分析树示例
**句子**：id * id + id
**分析树**：
```
        E
       /|\
      E + T
      |  /|\
      T T * F
      | |  |
      F F  id
      | |
      id id
```

### 4.3 分析树的性质
1. **叶子节点的顺序**：从左到右排列的叶子节点构成句子，称为树的产出（yield）
2. **推导与分析树**：每个推导对应一棵分析树，每棵分析树对应至少一个推导
3. **最左/最右推导**：同一棵分析树可能对应多个推导，但最左推导和最右推导是唯一的

## 五、二义性
### 5.1 二义性的定义
如果一个文法存在某个句子对应两棵或多棵不同的分析树，则称这个文法是二义的。

### 5.2 二义性示例
**文法**：
```
E → E + E | E * E | ( E ) | id
```

**句子**：id + id * id

**分析树1（先乘后加）**：
```
    E
   /|\
  E + E
  |  /|\
  id E * E
     |   |
     id  id
```

**分析树2（先加后乘）**：
```
      E
     /|\
    E * E
   /|\  |
  E + E id
  |   |
  id  id
```

### 5.3 消除二义性的方法
1. **重写文法**：引入优先级和结合性
2. **规定优先级**：在语法分析器中规定运算符优先级
3. **使用二义文法但附加规则**：如Yacc/Bison中使用%left、%right、%nonassoc

### 5.4 消除二义性的示例
**重写后的表达式文法**：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | num
```
这个文法规定了：
- *和/的优先级高于+和-
- 所有运算符都是左结合的

## 六、语法分析方法的分类
### 6.1 自顶向下分析
从开始符号出发，逐步推导，试图构造出与输入匹配的句子。
- **预测分析法**（LL分析法）
- **递归下降分析法**

### 6.2 自底向上分析
从输入串出发，逐步规约，试图规约到开始符号。
- **算符优先分析法**
- **LR分析法**（LR(0), SLR(1), LALR(1), LR(1)）

### 6.3 分析方法比较
| 方法 | 优点 | 缺点 | 适用范围 |
|------|------|------|----------|
| 递归下降 | 简单、直观、易实现 | 文法需满足一定条件 | 小型语言 |
| LL(1) | 高效、可自动生成 | 文法限制较多 | 中等规模语言 |
| 算符优先 | 简单、高效 | 能力有限 | 表达式分析 |
| LR | 能力强、适用范围广 | 实现复杂 | 大多数编程语言 |

## 七、语法错误处理
### 7.1 错误处理的目标
1. **清晰准确地报告错误**
2. **快速从错误中恢复**
3. **不显著降低正确程序的分析速度**
4. **不生成过多的级联错误**

### 7.2 常见的错误恢复策略
1. **紧急方式恢复**：跳过一些记号，直到找到同步记号
2. **短语级恢复**：对剩余输入进行局部修正
3. **错误产生式**：在文法中加入错误产生式
4. **全局纠正**：寻找与输入最接近的正确程序

---

## 章节：视频4.1~4.4 语法分析-自顶向下笔记

# 视频4.1~4.4 语法分析-自顶向下笔记

## 一、语法分析简介
### 1.1 语法分析的任务
- **输入**：词法分析器输出的单词符号序列
- **输出**：语法树（抽象语法树）
- **主要任务**：
  1. 根据语法规则分析单词串的语法结构
  2. 检查语法错误
  3. 生成语法树

### 1.2 语法分析方法分类
1. **自顶向下分析法**
   - 从开始符号出发，逐步推导，试图构造出与输入串匹配的推导
   - 代表方法：
     - 递归下降分析法
     - LL(1)分析法

2. **自底向上分析法**
   - 从输入串出发，逐步归约，试图归约到开始符号
   - 代表方法：
     - 算符优先分析法
     - LR分析法

## 二、自顶向下分析简介
### 2.1 自顶向下分析的基本思想
- **从根结点开始**：以开始符号为根，向下构造语法树
- **选择产生式**：根据当前输入符号选择合适的产生式
- **匹配**：匹配输入符号

### 2.2 自顶向下分析的问题
1. **左递归**：文法中存在A→Aα的产生式，会导致无限循环
2. **回溯**：选择产生式时可能出错，需要回溯，效率低
3. **二义性**：文法二义性导致分析不唯一

## 三、消除左递归和回溯
### 3.1 消除左递归
1. **直接左递归**
   - 产生式形式：A→Aα | β
   - 消除后：
     A→βA'
     A'→αA' | ε

2. **间接左递归**
   - 按某种顺序排列非终结符A₁, A₂, ..., Aₙ
   - 对每个i从1到n：
     - 对每个j从1到i-1：
       - 把每个形如Aᵢ→Aⱼγ的规则替换为Aᵢ→δ₁γ | δ₂γ | ... | δₖγ
       - 其中Aⱼ→δ₁ | δ₂ | ... | δₖ是所有Aⱼ的规则
     - 消除Aᵢ的直接左递归

3. **示例**
   - 原文法：
     E→E+T | T
     T→T*F | F
     F→(E) | id
   - 消除左递归后：
     E→TE'
     E'→+TE' | ε
     T→FT'
     T'→*FT' | ε
     F→(E) | id

### 3.2 消除回溯
1. **提取左因子**
   - 产生式形式：A→αβ₁ | αβ₂ | ... | αβₙ | γ
   - 提取后：
     A→αA' | γ
     A'→β₁ | β₂ | ... | βₙ

2. **示例**
   - 原文法：
     S→iCtS | iCtSeS | a
     C→b
   - 提取左因子后：
     S→iCtSS' | a
     S'→eS | ε
     C→b

## 四、FIRST集和FOLLOW集
### 4.1 FIRST集
- **定义**：FIRST(α) = { a | α ⇒* a..., a ∈ Vₜ }
- 如果α ⇒* ε，则ε ∈ FIRST(α)

### 4.2 FOLLOW集
- **定义**：FOLLOW(A) = { a | S ⇒* ...Aa..., a ∈ Vₜ }
- 如果S ⇒* ...A，则# ∈ FOLLOW(A)（#表示输入结束标记）

### 4.3 FIRST集的构造
1. **对终结符a**：FIRST(a) = {a}
2. **对非终结符X**：
   - 若X→aα，则a ∈ FIRST(X)
   - 若X→ε，则ε ∈ FIRST(X)
   - 若X→Y₁Y₂...Yₖ：
     - 把FIRST(Y₁) - {ε}加入FIRST(X)
     - 若Y₁⇒*ε，则把FIRST(Y₂) - {ε}加入FIRST(X)
     - 继续，直到某个Yᵢ不能推出ε或所有Yᵢ都处理完
     - 若所有Yᵢ⇒*ε，则把ε加入FIRST(X)

### 4.4 FOLLOW集的构造
1. **对开始符号S**：把#加入FOLLOW(S)
2. **对产生式A→αBβ**：
   - 把FIRST(β) - {ε}加入FOLLOW(B)
3. **对产生式A→αB或A→αBβ且β⇒*ε**：
   - 把FOLLOW(A)加入FOLLOW(B)
4. **重复**：直到所有FOLLOW集不再增大

## 五、LL(1)分析法的工作过程
### 5.1 LL(1)文法的条件
- **第一个L**：从左到右扫描输入串
- **第二个L**：最左推导
- **1**：向前看1个符号

- **LL(1)文法的条件**：
  1. 文法不含左递归
  2. 对每个非终结符A的任意两个不同产生式A→α | β，满足：
     - FIRST(α) ∩ FIRST(β) = ∅
     - 如果β⇒*ε，则FIRST(α) ∩ FOLLOW(A) = ∅

### 5.2 LL(1)分析表的构造
- **分析表M[A, a]**：A是非终结符，a是终结符或#
- **构造方法**：
  1. 对每个产生式A→α：
     a. 对每个a ∈ FIRST(α)，把A→α加入M[A, a]
     b. 如果ε ∈ FIRST(α)，则对每个b ∈ FOLLOW(A)，把A→α加入M[A, b]
  2. 把所有无定义的M[A, a]标上"出错"

### 5.3 LL(1)分析算法
1. **初始化**：
   - 分析栈：#S（#是栈底，S是开始符号）
   - 输入指针：指向第一个输入符号
   - 分析表：M

2. **分析过程**：
   - 令X是栈顶符号，a是当前输入符号
   - 若X = a = #，则分析成功
   - 若X = a ≠ #，则弹出X，输入指针后移
   - 若X是非终结符：
     - 若M[X, a] = X→Y₁Y₂...Yₖ：
       - 弹出X
       - 把Yₖ,...,Y₂,Y₁依次压入栈（Y₁在栈顶）
     - 否则，出错

## 六、递归子程序的原理
### 6.1 递归下降分析法的基本思想
- **每个非终结符对应一个递归过程**
- **过程根据当前输入符号选择产生式**
- **匹配终结符，调用非终结符过程**

### 6.2 递归下降分析程序构造
- **示例文法**：
  E→TE'
  E'→+TE' | ε
  T→FT'
  T'→*FT' | ε
  F→(E) | id

- **递归下降程序**：
  ```c
  void E() { T(); Eprime(); }
  void Eprime() {
      if (lookahead == '+') {
          match('+');
          T();
          Eprime();
      }
  }
  void T() { F(); Tprime(); }
  void Tprime() {
      if (lookahead == '*') {
          match('*');
          F();
          Tprime();
      }
  }
  void F() {
      if (lookahead == '(') {
          match('(');
          E();
          match(')');
      } else if (lookahead == id) {
          match(id);
      } else {
          error();
      }
  }
  void match(int t) {
      if (lookahead == t) {
          lookahead = nextToken();
      } else {
          error();
      }
  }
  ```

## 七、总结
自顶向下分析法从开始符号出发，通过推导构造语法树。需要消除左递归和回溯才能进行有效的分析。LL(1)分析法通过预测分析表实现，递归下降分析法则为每个非终结符编写一个递归过程。这两种方法都要求文法是LL(1)文法。

---

## 章节：视频4.2 自顶向下分析简介笔记

# 视频4.2 自顶向下分析简介笔记

## 一、自顶向下分析的基本思想
### 1.1 核心概念
自顶向下分析从语法树的根节点（开始符号）开始，尝试为输入串构造一棵语法树。通过选择合适的产生式，逐步向下扩展，直到叶子节点与输入串匹配。

### 1.2 分析过程
1. 从开始符号S出发
2. 对当前的非终结符，选择一个产生式进行替换
3. 将产生式的右部符号展开
4. 匹配终结符，如匹配成功则继续分析下一个输入符号
5. 如果所有输入符号都匹配成功，则分析成功

## 二、回溯的自顶向下分析
### 2.1 基本方法
- 当有多个产生式可选时，先尝试一个
- 如果失败，回溯到上一个选择点，尝试另一个产生式
- 重复直到成功或所有可能都尝试过

### 2.2 示例
**文法**：
```
S → aAB
A → a | ε
B → b | ε
```

**输入**：ab

**分析过程**：
```
S ⇒ aAB ⇒ aaB ⇒ aab  （匹配失败，输入只有ab）
    回溯
S ⇒ aAB ⇒ aεB ⇒ aB ⇒ ab  （匹配成功）
```

### 2.3 回溯的问题
1. **效率低**：最坏情况下时间复杂度是指数级的
2. **语义动作问题**：回溯时难以撤销语义动作
3. **错误定位困难**：难以确定真正的错误位置
4. **左递归问题**：直接或间接左递归会导致无限循环

## 三、左递归问题
### 3.1 直接左递归
**定义**：存在产生式A → Aα

**示例**：
```
E → E + T | T
```

**问题**：自顶向下分析时，会无限选择E→E+T，导致死循环。

### 3.2 间接左递归
**定义**：存在推导A ⇒+ Aα

**示例**：
```
S → Aa
A → Sb | b
```

**推导**：S ⇒ Aa ⇒ Sba ⇒ ...

### 3.3 消除直接左递归
**一般形式**：
```
A → Aα1 | Aα2 | ... | Aαm | β1 | β2 | ... | βn
```
其中β不以A开头。

**转换为**：
```
A → β1A' | β2A' | ... | βnA'
A' → α1A' | α2A' | ... | αmA' | ε
```

**示例**：
```
E → E + T | T
```
转换为：
```
E → TE'
E' → + TE' | ε
```

**完整示例**：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | num
```
消除左递归后：
```
E → TE'
E' → + TE' | - TE' | ε
T → FT'
T' → * FT' | / FT' | ε
F → ( E ) | id | num
```

### 3.4 消除间接左递归
**算法**：
1. 按某种顺序排列非终结符：A1, A2, ..., An
2. for i = 1 to n do
     for j = 1 to i-1 do
       用Aj的产生式替换所有形如Ai → Ajγ的产生式
     end for
     消除Ai的直接左递归
   end for
3. 化简文法，删除无用产生式

**示例**：
```
S → Aa | b
A → Ac | Sd | ε
```

步骤1：排列非终结符：S, A
步骤2：处理i=1（S）：
   j从1到0，不执行循环
   S无直接左递归
步骤3：处理i=2（A）：
   j=1：将A→Sd替换为S的产生式
     A → (Aa | b)d | Ac | ε
     即 A → Aad | bd | Ac | ε
   消除A的直接左递归：
     A → bdA' | A'
     A' → adA' | cA' | ε

最终文法：
```
S → Aa | b
A → bdA' | A'
A' → adA' | cA' | ε
```

## 四、回溯的消除——提取左因子
### 4.1 问题描述
当一个非终结符有多个产生式，且它们的右部有公共前缀时，自顶向下分析需要回溯来选择正确的产生式。

**示例**：
```
S → if E then S else S
   | if E then S
```

输入：`if E then S`
分析时需要先尝试第一个产生式，失败后回溯再尝试第二个产生式。

### 4.2 提取左因子算法
**一般形式**：
```
A → αβ1 | αβ2 | ... | αβn | γ
```
其中γ不以α开头。

**转换为**：
```
A → αA' | γ
A' → β1 | β2 | ... | βn
```

**示例1**：
```
S → if E then S else S
   | if E then S
```
提取左因子后：
```
S → if E then S S'
S' → else S | ε
```

**示例2**：
```
A → aAB | aAC | aD | b
```
提取左因子后：
```
A → aA' | b
A' → AB | AC | D
```
可以进一步提取A'的左因子：
```
A' → A A'' | D
A'' → B | C
```

## 五、LL(1)文法
### 5.1 LL(1)的含义
- 第一个L：从左到右扫描输入
- 第二个L：最左推导
- 1：向前看1个输入符号来确定选择哪个产生式

### 5.2 LL(1)文法的条件
文法是LL(1)的，当且仅当对于任意两个产生式A→α和A→β，满足：
1. FIRST(α) ∩ FIRST(β) = ∅
2. 如果β ⇒* ε，则FIRST(α) ∩ FOLLOW(A) = ∅

### 5.3 预测分析法
使用预测分析表（LL(1)分析表）进行分析，无需回溯。
- 分析表是一个二维表M[A, a]，其中A是非终结符，a是终结符或$
- M[A, a]存放产生式A→α，表示当面临非终结符A和输入符号a时，选择产生式A→α

## 六、自顶向下分析的局限性
1. **文法限制**：只能处理LL(1)文法
2. **不能处理左递归**：需要先消除左递归
3. **不能处理公共左因子**：需要先提取左因子
4. **错误恢复较困难**

尽管有这些限制，自顶向下分析仍然是一种重要的分析方法，特别是递归下降分析法，因为它简单、直观、易于实现。

---

## 章节：视频4.3.1 消除左递归和回溯笔记

# 视频4.3.1 消除左递归和回溯笔记

## 一、消除左递归
### 1.1 直接左递归的消除
#### 1.1.1 基本形式
直接左递归的产生式形式：
```
A → Aα | β
```
其中：
- A是非终结符
- α和β是任意符号串
- β不以A开头

#### 1.1.2 消除方法
将直接左递归转换为右递归：
```
A → βA'
A' → αA' | ε
```

#### 1.1.3 示例
**示例1**：算术表达式左递归
```
E → E + T | T
```
消除后：
```
E → TE'
E' → + TE' | ε
```

**示例2**：多个左递归选择
```
E → E + T | E - T | T
```
消除后：
```
E → TE'
E' → + TE' | - TE' | ε
```

**示例3**：完整的表达式文法
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | num
```
消除后：
```
E → TE'
E' → + TE' | - TE' | ε
T → FT'
T' → * FT' | / FT' | ε
F → ( E ) | id | num
```

### 1.2 一般形式的直接左递归消除
#### 1.2.1 一般形式
```
A → Aα₁ | Aα₂ | ... | Aαₘ | β₁ | β₂ | ... | βₙ
```
其中：
- 每个αᵢ≠ε
- 每个βⱼ不以A开头

#### 1.2.2 转换方法
```
A → β₁A' | β₂A' | ... | βₙA'
A' → α₁A' | α₂A' | ... | αₘA' | ε
```

### 1.3 间接左递归的消除
#### 1.3.1 算法步骤
1. 将非终结符按某种顺序排列：A₁, A₂, ..., Aₙ
2. for i = 1 to n do
     for j = 1 to i-1 do
       把每个形如 Aᵢ → Aⱼγ 的产生式替换为
         Aᵢ → δ₁γ | δ₂γ | ... | δₖγ
       其中 Aⱼ → δ₁ | δ₂ | ... | δₖ 是 Aⱼ 的所有产生式
     end for
     消除 Aᵢ 的直接左递归
   end for
3. 化简文法，删除不可达产生式

#### 1.3.2 示例
**文法**：
```
S → Aa | b
A → Ac | Sd | ε
```

**步骤**：
1. 排列：S, A
2. 处理 i=1 (S)：
   - j从1到0，不执行循环
   - S无直接左递归
3. 处理 i=2 (A)：
   - j=1：将 A→Sd 替换为 S 的产生式
     A → (Aa | b)d | Ac | ε
     即 A → Aad | bd | Ac | ε
   - 消除 A 的直接左递归：
     A → bdA' | A'
     A' → adA' | cA' | ε

**最终文法**：
```
S → Aa | b
A → bdA' | A'
A' → adA' | cA' | ε
```

#### 1.3.3 另一个示例
**文法**：
```
A₁ → A₂A₃
A₂ → A₃A₁ | b
A₃ → A₁A₂ | a
```

**步骤**：
1. 排列：A₁, A₂, A₃
2. 处理 i=1 (A₁)：
   - A₁ → A₂A₃（无直接左递归）
3. 处理 i=2 (A₂)：
   - j=1：A₂的产生式中没有A₁开头的，无需替换
   - A₂无直接左递归
4. 处理 i=3 (A₃)：
   - j=1：将 A₃→A₁A₂ 替换为 A₁的产生式
     A₃ → A₂A₃A₂ | a
   - j=2：将 A₃→A₂A₃A₂ 替换为 A₂的产生式
     A₃ → (A₃A₁ | b)A₃A₂ | a
     即 A₃ → A₃A₁A₃A₂ | bA₃A₂ | a
   - 消除 A₃ 的直接左递归：
     A₃ → bA₃A₂A₃' | aA₃'
     A₃' → A₁A₃A₂A₃' | ε

## 二、提取左因子（消除回溯）
### 2.1 问题描述
当一个非终结符有多个产生式，且它们的右部有公共前缀时，自顶向下分析无法确定选择哪个产生式，需要回溯。

**示例**：
```
S → if E then S else S
   | if E then S
```

### 2.2 提取左因子的基本方法
#### 2.2.1 一般形式
```
A → αβ₁ | αβ₂ | ... | αβₙ | γ
```
其中：
- α是公共前缀
- γ不以α开头

#### 2.2.2 转换方法
```
A → αA' | γ
A' → β₁ | β₂ | ... | βₙ
```

### 2.3 示例
#### 2.3.1 示例1：if语句
```
S → if E then S else S
   | if E then S
```
提取左因子后：
```
S → if E then S S'
S' → else S | ε
```

#### 2.3.2 示例2：多个公共前缀
```
A → aAB | aAC | aD | b
```
提取左因子后：
```
A → aA' | b
A' → AB | AC | D
```
可以进一步提取A'的左因子：
```
A' → AA'' | D
A'' → B | C
```

#### 2.3.3 示例3：嵌套的公共前缀
```
expr → term + expr | term - expr | term
term → factor * term | factor / term | factor
factor → ( expr ) | number | identifier
```
这个文法已经是提取左因子后的形式了。

### 2.4 多次提取左因子
有些文法需要多次提取左因子才能完全消除回溯。

**示例**：
```
A → aaab | aac | aad | b
```
第一次提取：
```
A → aA' | b
A' → aab | ac | ad
```
第二次提取：
```
A → aA' | b
A' → aA''
A'' → ab | c | d
```

## 三、消除左递归和回溯后的文法示例
### 3.1 完整的表达式文法处理
**原文法**（有左递归）：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id
```

**消除左递归后**：
```
E → TE'
E' → + TE' | - TE' | ε
T → FT'
T' → * FT' | / FT' | ε
F → ( E ) | id
```

### 3.2 包含if语句的语句文法
**原文法**（有回溯）：
```
S → if E then S else S
   | if E then S
   | while E do S
   | begin L end
   | id := E
L → L ; S | S
```

**提取左因子并消除左递归后**：
```
S → if E then S S'
   | while E do S
   | begin L end
   | id := E
S' → else S | ε
L → SL'
L' → ; SL' | ε
```

## 四、重要注意事项
1. **消除顺序**：通常先消除左递归，再提取左因子
2. **引入的非终结符**：消除左递归和提取左因子会引入新的非终结符（如A'）
3. **ε产生式**：转换过程中可能会引入ε产生式
4. **等价性**：转换前后的文法是等价的，接受相同的语言
5. **LL(1)条件**：消除左递归和提取左因子后，文法不一定是LL(1)的，还需要检查LL(1)条件

---

## 章节：视频4.3.2 LL(1)分析法的工作过程笔记

# 视频4.3.2 LL(1)分析法的工作过程笔记

## 一、LL(1)分析法概述
### 1.1 LL(1)的含义
- **第一个L**：从左到右（Left to right）扫描输入串
- **第二个L**：最左（Leftmost）推导
- **1**：向前看1个输入符号来决定分析动作

### 1.2 预测分析器的组成
1. **输入缓冲区**：存放待分析的输入串，以$结束
2. **分析栈**：存放文法符号，栈底是$
3. **预测分析表**：二维表M[A, a]，A是非终结符，a是终结符或$
4. **总控程序**：根据栈顶符号和当前输入符号执行分析动作

### 1.3 分析过程示意图
```
分析栈：$ [开始符号] ← 栈顶
        ↑
        总控程序
        ↑
输入：[输入串]$ ← 当前符号
        ↑
预测分析表：M[A, a]
```

## 二、预测分析器的工作过程
### 2.1 初始化
1. 将$压入栈
2. 将开始符号S压入栈
3. 输入指针指向第一个输入符号
4. 栈顶符号X = 栈顶元素
5. 当前输入符号a = 当前输入符号

### 2.2 分析步骤
重复以下步骤直到栈为空或出错：

1. **情况1：X = a = $**
   - 分析成功，结束

2. **情况2：X = a ≠ $**
   - 弹出栈顶X
   - 输入指针前移，指向下一个输入符号

3. **情况3：X是非终结符**
   - 查预测分析表M[X, a]
   - 如果M[X, a] = X → Y₁Y₂...Yₖ：
     * 弹出栈顶X
     * 将Yₖ, Yₖ₋₁, ..., Y₁依次压入栈（Y₁在栈顶）
   - 如果M[X, a]为空：
     * 报错，调用错误恢复程序

### 2.3 分析算法的形式化描述
```
初始化：
  栈.push($)
  栈.push(S)
  ip = 0
  a = 输入[ip]
  X = 栈.top()

while X ≠ $:
  if X == a:
    栈.pop()
    ip = ip + 1
    a = 输入[ip]
  else if X是终结符:
    error()
  else if M[X, a] == X → Y₁Y₂...Yₖ:
    输出产生式 X → Y₁Y₂...Yₖ
    栈.pop()
    for i = k downto 1:
      if Yᵢ ≠ ε:
        栈.push(Yᵢ)
  else:
    error()
  X = 栈.top()
```

## 三、示例分析
### 3.1 示例文法
```
E → TE'
E' → + TE' | ε
T → FT'
T' → * FT' | ε
F → ( E ) | id
```

### 3.2 预测分析表
|   | id | + | * | ( | ) | $ |
|---|----|---|---|---|---|---|
| E | E→TE' |   |   | E→TE' |   |   |
| E'|    | E'→+TE' |   |   | E'→ε | E'→ε |
| T | T→FT' |   |   | T→FT' |   |   |
| T'|    | T'→ε | T'→*FT' |   | T'→ε | T'→ε |
| F | F→id |   |   | F→(E) |   |   |

### 3.3 输入串：id * id + id $
### 3.4 分析过程

| 步骤 | 分析栈 | 输入 | 动作 |
|------|--------|------|------|
| 1 | $E | id * id + id $ | 弹出E，压入E'T |
| 2 | $E'T | id * id + id $ | 弹出T，压入T'F |
| 3 | $E'T'F | id * id + id $ | 弹出F，压入id |
| 4 | $E'T'id | id * id + id $ | 匹配id，弹出，输入前移 |
| 5 | $E'T' | * id + id $ | T'→*FT'，弹出T'，压入T'F* |
| 6 | $E'T'F* | * id + id $ | 匹配*，弹出，输入前移 |
| 7 | $E'T'F | id + id $ | F→id，弹出F，压入id |
| 8 | $E'T'id | id + id $ | 匹配id，弹出，输入前移 |
| 9 | $E'T' | + id $ | T'→ε，弹出T' |
| 10 | $E' | + id $ | E'→+TE'，弹出E'，压入E'T+ |
| 11 | $E'T+ | + id $ | 匹配+，弹出，输入前移 |
| 12 | $E'T | id $ | T→FT'，弹出T，压入T'F |
| 13 | $E'T'F | id $ | F→id，弹出F，压入id |
| 14 | $E'T'id | id $ | 匹配id，弹出，输入前移 |
| 15 | $E'T' | $ | T'→ε，弹出T' |
| 16 | $E' | $ | E'→ε，弹出E' |
| 17 | $ | $ | 分析成功！ |

### 3.5 最左推导序列
```
E ⇒ TE'
  ⇒ FT'E'
  ⇒ idT'E'
  ⇒ id*FT'E'
  ⇒ id*idT'E'
  ⇒ id*idE'
  ⇒ id*id+TE'
  ⇒ id*id+FT'E'
  ⇒ id*id+idT'E'
  ⇒ id*id+idE'
  ⇒ id*id+id
```

## 四、预测分析表的构造
### 4.1 构造步骤
1. 计算每个非终结符的FIRST集
2. 计算每个非终结符的FOLLOW集
3. 对每个产生式A→α：
   a. 对每个终结符a∈FIRST(α)，将A→α放入M[A, a]
   b. 如果ε∈FIRST(α)，则对每个b∈FOLLOW(A)，将A→α放入M[A, b]
   c. 如果ε∈FIRST(α)且$∈FOLLOW(A)，则将A→α放入M[A, $]
4. 将所有未定义的M[A, a]标记为错误

### 4.2 FIRST集的定义
FIRST(α)是从α推导出的串的首终结符的集合。
- 如果α ⇒* ε，则ε∈FIRST(α)

### 4.3 FOLLOW集的定义
FOLLOW(A)是在某个句型中紧跟在A后面的终结符的集合。
- 对于开始符号S，$∈FOLLOW(S)

## 五、LL(1)文法的条件
文法是LL(1)的，当且仅当对于任意两个产生式A→α和A→β，有：
1. FIRST(α) ∩ FIRST(β) = ∅
2. 如果β ⇒* ε，则FIRST(α) ∩ FOLLOW(A) = ∅

## 六、错误处理
### 6.1 错误检测
当发生以下情况时检测到错误：
1. 栈顶是终结符，但与输入符号不匹配
2. 栈顶是非终结符，但预测分析表中对应项为空

### 6.2 错误恢复策略
1. **紧急方式恢复**：
   - 跳过输入符号，直到找到同步符号（通常是FOLLOW集中的符号）
   - 弹出栈顶符号，直到栈顶符号与某个输入符号匹配

2. **短语级恢复**：
   - 对输入进行局部修改，使其符合语法
   - 插入或删除一些符号

3. **错误产生式**：
   - 在文法中加入识别常见错误的产生式

---

## 章节：视频4.3.3 FIRST集和FOLLOW集的构造笔记

# 视频4.3.3 FIRST集和FOLLOW集的构造笔记

## 一、FIRST集的构造
### 1.1 FIRST集的定义
FIRST(α)是从符号串α可以推导出的所有串的首终结符的集合。
- 如果α ⇒* ε，则ε也在FIRST(α)中。

形式化定义：
```
FIRST(α) = { a | α ⇒* a..., a ∈ T } ∪ { ε | α ⇒* ε }
```

### 1.2 单个符号X的FIRST集计算规则
1. **如果X是终结符**：FIRST(X) = {X}

2. **如果X是非终结符**：
   a. 如果有产生式X→ε，则ε∈FIRST(X)
   b. 如果有产生式X→Y₁Y₂...Yₖ，则：
      i. FIRST(Y₁) - {ε} ⊆ FIRST(X)
      ii. 如果ε∈FIRST(Y₁)，则FIRST(Y₂) - {ε} ⊆ FIRST(X)
      iii. 依此类推，如果ε∈FIRST(Y₁), ..., FIRST(Yᵢ₋₁)，则FIRST(Yᵢ) - {ε} ⊆ FIRST(X)
      iv. 如果ε∈FIRST(Y₁), ..., FIRST(Yₖ)，则ε∈FIRST(X)

### 1.3 符号串α的FIRST集计算规则
设α = X₁X₂...Xₙ

1. FIRST(X₁) - {ε} ⊆ FIRST(α)
2. 如果ε∈FIRST(X₁)，则FIRST(X₂) - {ε} ⊆ FIRST(α)
3. 依此类推，如果ε∈FIRST(X₁), ..., FIRST(Xᵢ₋₁)，则FIRST(Xᵢ) - {ε} ⊆ FIRST(α)
4. 如果ε∈FIRST(X₁), ..., FIRST(Xₙ)，则ε∈FIRST(α)

### 1.4 迭代算法计算所有非终结符的FIRST集
```
for 每个非终结符X:
  FIRST(X) = ∅

repeat:
  对每个产生式X→α:
    计算FIRST(α)
    将FIRST(α)加入到FIRST(X)
until 没有新的终结符或ε可以加入到任何FIRST集中
```

### 1.5 示例1：简单表达式文法
**文法**：
```
E → TE'
E' → + TE' | ε
T → FT'
T' → * FT' | ε
F → ( E ) | id
```

**计算过程**：

**第一轮**：
- FIRST(F) = {(, id} （从F→(E)和F→id）
- FIRST(T') = {*, ε} （从T'→*FT'和T'→ε）
- FIRST(T) = FIRST(F) = {(, id} （因为FIRST(F)不含ε）
- FIRST(E') = {+, ε} （从E'→+TE'和E'→ε）
- FIRST(E) = FIRST(T) = {(, id}

**最终结果**：
- FIRST(E) = {(, id}
- FIRST(E') = {+, ε}
- FIRST(T) = {(, id}
- FIRST(T') = {*, ε}
- FIRST(F) = {(, id}

### 1.6 示例2：包含ε的文法
**文法**：
```
S → ABC
A → a | ε
B → b | ε
C → c
```

**计算FIRST**：
- FIRST(A) = {a, ε}
- FIRST(B) = {b, ε}
- FIRST(C) = {c}
- FIRST(S) = FIRST(ABC) = {a, b, c}
  因为：
  - A ⇒* a... 或 ε
  - 如果A⇒*ε，则B⇒*b... 或 ε
  - 如果A⇒*ε且B⇒*ε，则C⇒*c...

## 二、FOLLOW集的构造
### 2.1 FOLLOW集的定义
FOLLOW(A)是在某个句型中紧跟在非终结符A后面的终结符的集合。
- 对于开始符号S，$∈FOLLOW(S)（$是输入结束标记）

形式化定义：
```
FOLLOW(A) = { a | S ⇒* ...Aa..., a ∈ T } ∪ { $ | S ⇒* ...A }
```

### 2.2 FOLLOW集的计算规则
1. **对于开始符号S**：将$加入FOLLOW(S)

2. **对于产生式A→αBβ**：
   - 将FIRST(β) - {ε}加入FOLLOW(B)

3. **对于产生式A→αB或A→αBβ且ε∈FIRST(β)**：
   - 将FOLLOW(A)加入FOLLOW(B)

### 2.3 迭代算法计算所有非终结符的FOLLOW集
```
for 每个非终结符A:
  FOLLOW(A) = ∅

FOLLOW(S) = {$}  // S是开始符号

repeat:
  对每个产生式A→X₁X₂...Xₙ:
    for i = 1 to n:
      if Xᵢ是非终结符:
        // 规则2：将FIRST(Xᵢ₊₁...Xₙ) - {ε}加入FOLLOW(Xᵢ)
        将FIRST(Xᵢ₊₁...Xₙ) - {ε}加入FOLLOW(Xᵢ)
        
        // 规则3：如果ε∈FIRST(Xᵢ₊₁...Xₙ)，将FOLLOW(A)加入FOLLOW(Xᵢ)
        if ε∈FIRST(Xᵢ₊₁...Xₙ) 或 i == n:
          将FOLLOW(A)加入FOLLOW(Xᵢ)
until 没有新的终结符可以加入到任何FOLLOW集中
```

### 2.4 示例1：简单表达式文法（续）
**文法**：
```
E → TE'
E' → + TE' | ε
T → FT'
T' → * FT' | ε
F → ( E ) | id
```

**FIRST集（已计算）**：
- FIRST(E) = {(, id}
- FIRST(E') = {+, ε}
- FIRST(T) = {(, id}
- FIRST(T') = {*, ε}
- FIRST(F) = {(, id}

**计算FOLLOW**：

**初始化**：
- FOLLOW(E) = {$}
- FOLLOW(E') = ∅
- FOLLOW(T) = ∅
- FOLLOW(T') = ∅
- FOLLOW(F) = ∅

**第一轮**：
- 处理E→TE'：
  * X₁=T是非终结符
  * FIRST(E') - {ε} = {+} 加入FOLLOW(T)
  * ε∈FIRST(E')，所以FOLLOW(E)加入FOLLOW(T)
  * FOLLOW(T) = {+, $}
  * X₂=E'是非终结符，i==n，所以FOLLOW(E)加入FOLLOW(E')
  * FOLLOW(E') = {$}

- 处理E'→+TE'：
  * X₂=T是非终结符
  * FIRST(E') - {ε} = {+} 加入FOLLOW(T) → FOLLOW(T)仍为{+, $}
  * ε∈FIRST(E')，所以FOLLOW(E')加入FOLLOW(T) → FOLLOW(T)仍为{+, $}
  * X₃=E'是非终结符，i==n，所以FOLLOW(E')加入FOLLOW(E') → 无变化

- 处理E'→ε：无操作

- 处理T→FT'：
  * X₁=F是非终结符
  * FIRST(T') - {ε} = {*} 加入FOLLOW(F)
  * ε∈FIRST(T')，所以FOLLOW(T)加入FOLLOW(F)
  * FOLLOW(F) = {*, +, $}
  * X₂=T'是非终结符，i==n，所以FOLLOW(T)加入FOLLOW(T')
  * FOLLOW(T') = {+, $}

- 处理T'→*FT'：
  * X₂=F是非终结符
  * FIRST(T') - {ε} = {*} 加入FOLLOW(F) → 无变化
  * ε∈FIRST(T')，所以FOLLOW(T')加入FOLLOW(F) → 无变化
  * X₃=T'是非终结符，i==n，所以FOLLOW(T')加入FOLLOW(T') → 无变化

- 处理T'→ε：无操作

- 处理F→(E)：
  * X₂=E是非终结符
  * FIRST() = {)} 加入FOLLOW(E)
  * FOLLOW(E) = {$, )}
  * i==2≠n，所以不处理FOLLOW(F)

- 处理F→id：无操作

**第二轮**：检查是否有变化，发现FOLLOW(E)更新为{$, )}，需要重新处理相关产生式。

- 重新处理E→TE'：FOLLOW(E)现在是{$, )}，所以FOLLOW(T)和FOLLOW(E')需要更新
  * FOLLOW(T) = {+, $, )}
  * FOLLOW(E') = {$, )}

- 重新处理T→FT'：FOLLOW(T)现在是{+, $, )}，所以FOLLOW(F)和FOLLOW(T')需要更新
  * FOLLOW(F) = {*, +, $, )}
  * FOLLOW(T') = {+, $, )}

- 重新处理E'→+TE'：FOLLOW(E')现在是{$, )}，所以FOLLOW(T)需要更新 → 无变化

- 重新处理T'→*FT'：FOLLOW(T')现在是{+, $, )}，所以FOLLOW(F)需要更新 → 无变化

**第三轮**：检查是否有变化，发现FOLLOW(T)、FOLLOW(E')、FOLLOW(F)、FOLLOW(T')都有更新，需要继续处理。

- 重新处理所有产生式，发现不再有新的终结符加入。

**最终FOLLOW集**：
- FOLLOW(E) = {$, )}
- FOLLOW(E') = {$, )}
- FOLLOW(T) = {+, $, )}
- FOLLOW(T') = {+, $, )}
- FOLLOW(F) = {*, +, $, )}

### 2.5 示例2：包含嵌套结构的文法
**文法**：
```
S → aAB | bBA
A → cS | ε
B → dA | e
```

**计算FIRST**：
- FIRST(S) = {a, b}
- FIRST(A) = {c, ε}
- FIRST(B) = {d, e}

**计算FOLLOW**：
- FOLLOW(S) = {$}
- FOLLOW(A) = FIRST(B) ∪ FOLLOW(S) = {d, e, $}
- FOLLOW(B) = FOLLOW(S) = {$}

## 三、FIRST和FOLLOW的应用
### 3.1 构造预测分析表
使用FIRST和FOLLOW集构造LL(1)预测分析表。

### 3.2 判断LL(1)文法
文法是LL(1)的，当且仅当对于任意两个产生式A→α和A→β：
1. FIRST(α) ∩ FIRST(β) = ∅
2. 如果β ⇒* ε，则FIRST(α) ∩ FOLLOW(A) = ∅

### 3.3 错误恢复
在预测分析中，FOLLOW集可以用来选择同步符号进行错误恢复。

---

## 章节：视频4.3.4 LL(1)分析表的构造笔记

# 视频4.3.4 LL(1)分析表的构造笔记

## 一、LL(1)分析表概述
### 1.1 分析表的结构
LL(1)分析表M是一个二维表：
- **行**：非终结符A
- **列**：终结符a或输入结束标记$
- **表项M[A, a]**：存放产生式A→α，表示当面临非终结符A和输入符号a时，选择产生式A→α进行推导

### 1.2 分析表的示例
|   | id | + | * | ( | ) | $ |
|---|----|---|---|---|---|---|
| E | E→TE' |   |   | E→TE' |   |   |
| E'|    | E'→+TE' |   |   | E'→ε | E'→ε |
| T | T→FT' |   |   | T→FT' |   |   |
| T'|    | T'→ε | T'→*FT' |   | T'→ε | T'→ε |
| F | F→id |   |   | F→(E) |   |   |

## 二、构造LL(1)分析表的算法
### 2.1 算法输入
- 上下文无关文法G=(V, T, P, S)
- 所有非终结符的FIRST集
- 所有非终结符的FOLLOW集

### 2.2 算法步骤
对每个产生式A→α，执行：

1. **步骤1**：对每个终结符a∈FIRST(α)，将A→α放入M[A, a]

2. **步骤2**：如果ε∈FIRST(α)，则对每个终结符b∈FOLLOW(A)，将A→α放入M[A, b]

3. **步骤3**：如果ε∈FIRST(α)且$∈FOLLOW(A)，则将A→α放入M[A, $]

4. **步骤4**：将所有未定义的M[A, a]标记为"错误"

### 2.3 算法的形式化描述
```
构造预测分析表M：

for 每个产生式 A → α:
  for 每个终结符 a ∈ FIRST(α):
    把 A → α 加入 M[A, a]
  
  if ε ∈ FIRST(α):
    for 每个终结符 b ∈ FOLLOW(A):
      把 A → α 加入 M[A, b]
    if $ ∈ FOLLOW(A):
      把 A → α 加入 M[A, $]

for 所有未定义的表项 M[A, a]:
  标记为 "error"
```

## 三、构造示例
### 3.1 示例1：简单表达式文法
**文法**：
```
E → TE'
E' → + TE' | ε
T → FT'
T' → * FT' | ε
F → ( E ) | id
```

**FIRST集**：
- FIRST(E) = {(, id}
- FIRST(E') = {+, ε}
- FIRST(T) = {(, id}
- FIRST(T') = {*, ε}
- FIRST(F) = {(, id}

**FOLLOW集**：
- FOLLOW(E) = {$, )}
- FOLLOW(E') = {$, )}
- FOLLOW(T) = {+, $, )}
- FOLLOW(T') = {+, $, )}
- FOLLOW(F) = {*, +, $, )}

**构造分析表**：

**处理E→TE'**：
- FIRST(TE') = FIRST(T) = {(, id}
  * M[E, (] = E→TE'
  * M[E, id] = E→TE'
- ε∉FIRST(TE')，不处理FOLLOW(E)

**处理E'→+TE'**：
- FIRST(+TE') = {+}
  * M[E', +] = E'→+TE'
- ε∉FIRST(+TE')，不处理FOLLOW(E')

**处理E'→ε**：
- FIRST(ε) = {ε}
- FOLLOW(E') = {$, )}
  * M[E', $] = E'→ε
  * M[E', )] = E'→ε

**处理T→FT'**：
- FIRST(FT') = FIRST(F) = {(, id}
  * M[T, (] = T→FT'
  * M[T, id] = T→FT'
- ε∉FIRST(FT')，不处理FOLLOW(T)

**处理T'→*FT'**：
- FIRST(*FT') = {*}
  * M[T', *] = T'→*FT'
- ε∉FIRST(*FT')，不处理FOLLOW(T')

**处理T'→ε**：
- FIRST(ε) = {ε}
- FOLLOW(T') = {+, $, )}
  * M[T', +] = T'→ε
  * M[T', $] = T'→ε
  * M[T', )] = T'→ε

**处理F→(E)**：
- FIRST((E)) = {(}
  * M[F, (] = F→(E)
- ε∉FIRST((E))，不处理FOLLOW(F)

**处理F→id**：
- FIRST(id) = {id}
  * M[F, id] = F→id
- ε∉FIRST(id)，不处理FOLLOW(F)

**最终分析表**：
|   | id | + | * | ( | ) | $ |
|---|----|---|---|---|---|---|
| E | E→TE' |   |   | E→TE' |   |   |
| E'|    | E'→+TE' |   |   | E'→ε | E'→ε |
| T | T→FT' |   |   | T→FT' |   |   |
| T'|    | T'→ε | T'→*FT' |   | T'→ε | T'→ε |
| F | F→id |   |   | F→(E) |   |   |

### 3.2 示例2：if语句文法
**文法**：
```
S → if E then S S'
S' → else S | ε
E → id
```

**FIRST集**：
- FIRST(S) = {if}
- FIRST(S') = {else, ε}
- FIRST(E) = {id}

**FOLLOW集**：
- FOLLOW(S) = {$, else}
- FOLLOW(S') = {$, else}
- FOLLOW(E) = {then}

**构造分析表**：

**处理S→if E then S S'**：
- FIRST(if E then S S') = {if}
  * M[S, if] = S→if E then S S'

**处理S'→else S**：
- FIRST(else S) = {else}
  * M[S', else] = S'→else S

**处理S'→ε**：
- FIRST(ε) = {ε}
- FOLLOW(S') = {$, else}
  * M[S', $] = S'→ε
  * M[S', else] = S'→ε（注意：这里产生冲突！）

**冲突处理**：
M[S', else]有两个产生式：S'→else S和S'→ε
这表明文法不是LL(1)的！

## 四、LL(1)文法的判定
### 4.1 LL(1)文法的条件
文法是LL(1)的，当且仅当对于任意两个不同的产生式A→α和A→β，满足：

1. **条件1**：FIRST(α) ∩ FIRST(β) = ∅
   - 两个产生式的首终结符集不相交

2. **条件2**：如果β ⇒* ε，则FIRST(α) ∩ FOLLOW(A) = ∅
   - 如果一个产生式能推出空串，那么另一个产生式的首终结符集不能与FOLLOW集相交

### 4.2 分析表中的冲突
如果分析表中某个表项M[A, a]包含多个产生式，则说明存在冲突，文法不是LL(1)的。

**冲突类型**：
1. **FIRST-FIRST冲突**：两个产生式的FIRST集有交集
2. **FIRST-FOLLOW冲突**：一个产生式能推出ε，另一个的FIRST集与FOLLOW集有交集

### 4.3 示例：非LL(1)文法
**文法**：
```
S → iEtS | iEtSeS | a
E → b
```

**FIRST集**：
- FIRST(iEtS) = {i}
- FIRST(iEtSeS) = {i}
- FIRST(a) = {a}
- FIRST(E) = {b}

**FOLLOW集**：
- FOLLOW(S) = {e, $}

**分析表构造**：
- M[S, i] = S→iEtS, S→iEtSeS（冲突！）

这个文法不是LL(1)的，因为FIRST(iEtS) ∩ FIRST(iEtSeS) = {i} ≠ ∅

## 五、LL(1)分析表的应用
### 5.1 预测分析
使用LL(1)分析表进行自顶向下的预测分析。

### 5.2 语法分析器生成
工具如Yacc/Bison虽然主要用于LR分析，但也可以使用LL(1)方法。

### 5.3 递归下降分析器的手工编写
LL(1)分析表可以指导递归下降分析器的编写。

## 六、LL(1)分析的优缺点
### 6.1 优点
1. **简单**：算法简单，易于理解和实现
2. **高效**：线性时间复杂度
3. **错误定位**：可以较早地发现错误

### 6.2 缺点
1. **文法限制**：只能处理LL(1)文法
2. **需要预处理**：需要消除左递归和提取左因子
3. **错误恢复**：错误恢复相对困难

---

## 章节：视频4.4.1 LL(1)分析过程笔记

# 视频4.4.1 LL(1)分析过程笔记

## 一、LL(1)分析概述
### 1.1 LL(1)的含义
- 第一个L：从左到右扫描输入串
- 第二个L：构造最左推导
- 1：向前看一个符号来确定分析动作

### 1.2 LL(1)分析器的组成
1. **输入缓冲区**：存放输入串，以$结束
2. **分析栈**：存放文法符号
3. **分析表**：LL(1)分析表，由非终结符和终结符索引
4. **总控程序**：控制分析过程

### 1.3 LL(1)分析表
分析表M是一个二维表：
- 行：非终结符A
- 列：终结符a或$
- M[A, a]：产生式A→α，用于分析

## 二、LL(1)分析算法
### 2.1 算法描述
```
输入：输入串w，LL(1)分析表M
输出：如果w是句子，输出最左推导；否则报错

初始化：
  将$压入栈
  将开始符号S压入栈
  ip = 0  // 输入指针
  a = w[ip]  // 当前输入符号

循环：
  X = 栈顶符号
  
  if X是终结符:
    if X == a:
      弹出X
      ip = ip + 1
      a = w[ip]
    else:
      报错（不匹配）
  else:  // X是非终结符
    if M[X, a]有产生式X→Y1Y2...Yk:
      弹出X
      将Yk, ..., Y2, Y1依次压入栈（注意顺序！）
      输出产生式X→Y1Y2...Yk
    else:
      报错（分析表中无条目）
  
  if X == $:
    break

if 栈为空且a == $:
  分析成功
else:
  分析失败
```

### 2.2 算法要点
1. **栈的压入顺序**：产生式右部符号逆序压入栈
   - 例如：A→BCD，压入顺序为D、C、B
   - 这样栈顶是B，先处理B

2. **匹配**：栈顶终结符与输入符号匹配时弹出

3. **输出**：每次使用产生式时输出该产生式

## 三、LL(1)分析示例
### 3.1 示例文法
**文法G**：
```
(1) E → TE'
(2) E' → +TE'
(3) E' → ε
(4) T → FT'
(5) T' → *FT'
(6) T' → ε
(7) F → (E)
(8) F → id
```

### 3.2 FIRST集和FOLLOW集
**FIRST集**：
```
FIRST(E) = {(, id}
FIRST(E') = {+, ε}
FIRST(T) = {(, id}
FIRST(T') = {*, ε}
FIRST(F) = {(, id}
```

**FOLLOW集**：
```
FOLLOW(E) = {$, )}
FOLLOW(E') = {$, )}
FOLLOW(T) = {+, $, )}
FOLLOW(T') = {+, $, )}
FOLLOW(F) = {*, +, $, )}
```

### 3.3 LL(1)分析表
| 非终结符 | id | + | * | ( | ) | $ |
|----------|----|---|---|---|---|---|
| E | (1) |   |   | (1) |   |   |
| E' |   | (2) |   |   | (3) | (3) |
| T | (4) |   |   | (4) |   |   |
| T' |   | (6) | (5) |   | (6) | (6) |
| F | (8) |   |   | (7) |   |   |

### 3.4 输入串
输入：`id * id + id $`

### 3.5 详细分析过程

| 步骤 | 栈 | 输入 | 动作 | 输出产生式 |
|------|-----|------|------|------------|
| 1 | $E | id * id + id $ | 弹出E，压入E'T | (1) E→TE' |
| 2 | $E'T | id * id + id $ | 弹出T，压入T'F | (4) T→FT' |
| 3 | $E'T'F | id * id + id $ | 弹出F，压入id | (8) F→id |
| 4 | $E'T'id | id * id + id $ | 匹配id，弹出 |  |
| 5 | $E'T' | * id + id $ | 弹出T'，压入T'F* | (5) T'→*FT' |
| 6 | $E'T'F* | * id + id $ | 匹配*，弹出 |  |
| 7 | $E'T'F | id + id $ | 弹出F，压入id | (8) F→id |
| 8 | $E'T'id | id + id $ | 匹配id，弹出 |  |
| 9 | $E'T' | + id $ | 弹出T'（ε） | (6) T'→ε |
| 10 | $E' | + id $ | 弹出E'，压入E'T+ | (2) E'→+TE' |
| 11 | $E'T+ | + id $ | 匹配+，弹出 |  |
| 12 | $E'T | id $ | 弹出T，压入T'F | (4) T→FT' |
| 13 | $E'T'F | id $ | 弹出F，压入id | (8) F→id |
| 14 | $E'T'id | id $ | 匹配id，弹出 |  |
| 15 | $E'T' | $ | 弹出T'（ε） | (6) T'→ε |
| 16 | $E' | $ | 弹出E'（ε） | (3) E'→ε |
| 17 | $ | $ | 匹配$，分析成功 |  |

### 3.6 分析过程详解

**步骤1：初始化**
```
栈：$E
输入：id * id + id $
```

**步骤2：分析E**
```
栈顶是E（非终结符）
当前输入是id
查分析表M[E, id] = (1) E→TE'
弹出E，逆序压入E'和T
栈变为：$E'T
输出：E→TE'
```

**步骤3：分析T**
```
栈顶是T（非终结符）
当前输入是id
查分析表M[T, id] = (4) T→FT'
弹出T，逆序压入T'和F
栈变为：$E'T'F
输出：T→FT'
```

**步骤4：分析F**
```
栈顶是F（非终结符）
当前输入是id
查分析表M[F, id] = (8) F→id
弹出F，压入id
栈变为：$E'T'id
输出：F→id
```

**步骤5：匹配id**
```
栈顶是id（终结符）
当前输入是id
匹配成功
弹出id
栈变为：$E'T'
输入指针前移，当前输入是*
```

**步骤6：分析T'**
```
栈顶是T'（非终结符）
当前输入是*
查分析表M[T', *] = (5) T'→*FT'
弹出T'，逆序压入T'、F、*
栈变为：$E'T'F*
输出：T'→*FT'
```

**步骤7：匹配***
```
栈顶是*（终结符）
当前输入是*
匹配成功
弹出*
栈变为：$E'T'F
输入指针前移，当前输入是id
```

**继续这个过程直到分析完成...**

### 3.7 最左推导
根据输出的产生式序列，得到最左推导：
```
E ⇒ TE'
  ⇒ FT'E'
  ⇒ idT'E'
  ⇒ id*FT'E'
  ⇒ id*idT'E'
  ⇒ id*idE'
  ⇒ id*id+TE'
  ⇒ id*id+FT'E'
  ⇒ id*id+idT'E'
  ⇒ id*id+idE'
  ⇒ id*id+id
```

## 四、LL(1)分析的错误检测
### 4.1 错误情况
1. **栈顶终结符与输入符号不匹配**
2. **分析表中没有相应的产生式**

### 4.2 错误恢复
1. **恐慌模式（Panic Mode）**
   - 跳过输入符号，直到找到同步记号
   - 同步记号通常是FOLLOW集中的符号

2. **短语级恢复**
   - 对输入进行局部修正
   - 插入、删除或替换符号

## 五、LL(1)分析的优缺点
### 5.1 优点
1. **实现简单**：容易理解和实现
2. **高效**：线性时间复杂度
3. **错误检测早**：能尽早发现语法错误

### 5.2 缺点
1. **文法限制**：要求文法是LL(1)的
2. **左递归消除**：需要消除左递归
3. **提取左公因子**：需要提取左公因子

## 六、LL(1)分析的实现
### 6.1 数据结构
```c
// 分析表
char *parse_table[MAX_NONTERMINAL][MAX_TERMINAL];

// 栈
#define STACK_SIZE 100
char stack[STACK_SIZE];
int top = 0;

// 压栈
void push(char c) {
    stack[top++] = c;
}

// 弹栈
char pop() {
    return stack[--top];
}

// 取栈顶
char top() {
    return stack[top - 1];
}
```

### 6.2 分析程序
```c
void parse(char *input) {
    int ip = 0;
    char a = input[ip];
    
    push('$');
    push('S');  // 开始符号
    
    while (1) {
        char X = top();
        
        if (X == '$') {
            if (a == '$') {
                printf("分析成功！\n");
                return;
            } else {
                printf("分析失败！\n");
                return;
            }
        }
        
        if (is_terminal(X)) {
            if (X == a) {
                pop();
                ip++;
                a = input[ip];
            } else {
                printf("错误：期望%c，遇到%c\n", X, a);
                return;
            }
        } else {
            char *prod = parse_table[X - 'A'][a - 'a'];
            if (prod != NULL) {
                pop();
                // 逆序压入产生式右部
                for (int i = strlen(prod) - 1; i >= 0; i--) {
                    if (prod[i] != 'ε') {
                        push(prod[i]);
                    }
                }
                printf("%c→%s\n", X, prod);
            } else {
                printf("错误：无产生式%c→?，输入%c\n", X, a);
                return;
            }
        }
    }
}
```

---

## 章节：视频4.4.1 递归子程序的原理笔记

# 视频4.4.1 递归子程序的原理笔记

## 一、递归下降分析法概述
### 1.1 基本思想
递归下降分析法是一种自顶向下的语法分析方法，它为每个非终结符编写一个递归过程（函数），用来识别该非终结符所对应的语法成分。

### 1.2 递归下降分析器的组成
- 一个递归过程对应一个非终结符
- 过程根据当前输入符号选择合适的产生式
- 遇到终结符时匹配输入符号
- 遇到非终结符时调用对应的递归过程

### 1.3 特点
- **直观**：与文法结构直接对应
- **简单**：易于实现和维护
- **高效**：对于适合的文法，分析效率高
- **灵活**：可以方便地添加语义动作

## 二、递归下降分析器的设计
### 2.1 设计要求
1. **文法必须是LL(1)的**：
   - 无左递归
   - 无公共左因子
   - 满足LL(1)条件

2. **向前看一个符号**：
   - 只需要向前看一个输入符号就能确定选择哪个产生式

### 2.2 基本结构
```
全局变量：
  lookahead: 当前输入符号

主程序：
  初始化lookahead为第一个输入符号
  调用开始符号对应的过程
  检查是否到达输入结束

每个非终结符A对应的过程：
  根据lookahead选择产生式A→α
  对于α中的每个符号X：
    如果X是终结符：
      匹配lookahead（检查是否等于X）
      读取下一个输入符号
    如果X是非终结符：
      调用X对应的过程
```

## 三、递归下降分析器的构造示例
### 3.1 示例1：简单表达式文法
**文法**（已消除左递归）：
```
E → TE'
E' → + TE' | ε
T → FT'
T' → * FT' | ε
F → ( E ) | id
```

### 3.2 递归下降分析器的伪代码
```
// 全局变量
lookahead: Token

// 主程序
procedure main():
  lookahead = nextToken()
  E()
  if lookahead != EOF:
    error("Unexpected token")

// 过程E：对应非终结符E
procedure E():
  T()
  E'()

// 过程E'：对应非终结符E'
procedure E'():
  if lookahead == '+':
    match('+')
    T()
    E'()
  // else: do nothing (对应E'→ε)

// 过程T：对应非终结符T
procedure T():
  F()
  T'()

// 过程T'：对应非终结符T'
procedure T'():
  if lookahead == '*':
    match('*')
    F()
    T'()
  // else: do nothing (对应T'→ε)

// 过程F：对应非终结符F
procedure F():
  if lookahead == '(':
    match('(')
    E()
    match(')')
  else if lookahead == 'id':
    match('id')
  else:
    error("Expected '(' or 'id'")

// 匹配终结符
procedure match(expected):
  if lookahead == expected:
    lookahead = nextToken()
  else:
    error("Expected " + expected + ", found " + lookahead)
```

### 3.3 分析过程示例
**输入**：id * id + id

**分析过程**：
```
main()
  lookahead = id
  E()
    T()
      F()
        match(id)  // lookahead = *
      T'()
        match(*)   // lookahead = id
        F()
          match(id)  // lookahead = +
        T'()
          // do nothing
    E'()
      match(+)   // lookahead = id
      T()
        F()
          match(id)  // lookahead = EOF
        T'()
          // do nothing
      E'()
        // do nothing
  // lookahead == EOF，成功
```

## 四、递归下降分析器的实现（C语言）
### 4.1 记号定义
```c
typedef enum {
    TOK_EOF, TOK_PLUS, TOK_STAR,
    TOK_LPAREN, TOK_RPAREN, TOK_ID
} TokenType;

TokenType lookahead;
```

### 4.2 递归下降分析器实现
```c
#include <stdio.h>
#include <stdlib.h>

// 假设nextToken()函数从词法分析器获取下一个记号
extern TokenType nextToken();

void error(const char *msg) {
    fprintf(stderr, "错误: %s\n", msg);
    exit(1);
}

void match(TokenType expected) {
    if (lookahead == expected) {
        lookahead = nextToken();
    } else {
        error("意外的记号");
    }
}

void F();
void T_prime();
void T();
void E_prime();
void E();

void F() {
    if (lookahead == TOK_LPAREN) {
        match(TOK_LPAREN);
        E();
        match(TOK_RPAREN);
    } else if (lookahead == TOK_ID) {
        match(TOK_ID);
    } else {
        error("期望'('或标识符");
    }
}

void T_prime() {
    if (lookahead == TOK_STAR) {
        match(TOK_STAR);
        F();
        T_prime();
    }
    // else: do nothing (ε产生式)
}

void T() {
    F();
    T_prime();
}

void E_prime() {
    if (lookahead == TOK_PLUS) {
        match(TOK_PLUS);
        T();
        E_prime();
    }
    // else: do nothing (ε产生式)
}

void E() {
    T();
    E_prime();
}

int main() {
    lookahead = nextToken();
    E();
    if (lookahead != TOK_EOF) {
        error("文件未结束");
    }
    printf("分析成功！\n");
    return 0;
}
```

## 五、递归下降分析器的实现（Java）
### 5.1 Java实现
```java
public class RecursiveDescentParser {
    private Lexer lexer;
    private Token lookahead;
    
    public RecursiveDescentParser(Lexer lexer) {
        this.lexer = lexer;
        this.lookahead = lexer.nextToken();
    }
    
    private void match(TokenType expected) {
        if (lookahead.type == expected) {
            lookahead = lexer.nextToken();
        } else {
            throw new ParseException("Expected " + expected + ", found " + lookahead);
        }
    }
    
    private void F() {
        switch (lookahead.type) {
            case LPAREN:
                match(LPAREN);
                E();
                match(RPAREN);
                break;
            case ID:
                match(ID);
                break;
            default:
                throw new ParseException("Expected '(' or id");
        }
    }
    
    private void TPrime() {
        if (lookahead.type == STAR) {
            match(STAR);
            F();
            TPrime();
        }
    }
    
    private void T() {
        F();
        TPrime();
    }
    
    private void EPrime() {
        if (lookahead.type == PLUS) {
            match(PLUS);
            T();
            EPrime();
        }
    }
    
    private void E() {
        T();
        EPrime();
    }
    
    public void parse() {
        E();
        if (lookahead.type != EOF) {
            throw new ParseException("Unexpected end of file");
        }
    }
}
```

## 六、带语义动作的递归下降分析器
### 6.1 示例：表达式求值
```python
class Parser:
    def __init__(self, lexer):
        self.lexer = lexer
        self.lookahead = lexer.next_token()
    
    def match(self, expected):
        if self.lookahead.type == expected:
            self.lookahead = lexer.next_token()
        else:
            raise Exception(f"Expected {expected}")
    
    def F(self):
        if self.lookahead.type == 'LPAREN':
            self.match('LPAREN')
            val = self.E()
            self.match('RPAREN')
            return val
        elif self.lookahead.type == 'NUM':
            val = self.lookahead.value
            self.match('NUM')
            return val
        else:
            raise Exception("Expected '(' or number")
    
    def T_prime(self, inherited):
        if self.lookahead.type == 'STAR':
            self.match('STAR')
            val = self.F()
            return self.T_prime(inherited * val)
        elif self.lookahead.type == 'DIV':
            self.match('DIV')
            val = self.F()
            return self.T_prime(inherited / val)
        else:
            return inherited
    
    def T(self):
        val = self.F()
        return self.T_prime(val)
    
    def E_prime(self, inherited):
        if self.lookahead.type == 'PLUS':
            self.match('PLUS')
            val = self.T()
            return self.E_prime(inherited + val)
        elif self.lookahead.type == 'MINUS':
            self.match('MINUS')
            val = self.T()
            return self.E_prime(inherited - val)
        else:
            return inherited
    
    def E(self):
        val = self.T()
        return self.E_prime(val)
    
    def parse(self):
        return self.E()
```

## 七、递归下降分析的优缺点
### 7.1 优点
1. **简单直观**：代码结构与文法结构直接对应
2. **易于实现**：不需要构造分析表
3. **易于调试**：可以方便地添加调试信息
4. **灵活**：可以方便地添加语义动作
5. **高效**：对于适合的文法，分析效率高

### 7.2 缺点
1. **文法限制**：只能处理LL(1)文法
2. **递归深度**：对于深度嵌套的结构，可能导致栈溢出
3. **左递归**：需要先消除左递归
4. **回溯**：不能处理需要回溯的文法

## 八、递归下降分析的应用
1. **编译器前端**：如GCC早期版本
2. **脚本语言解释器**：如Python、Ruby
3. **配置文件解析器**：如XML、JSON解析器
4. **领域特定语言**：各种DSL的实现

---

## 章节：视频4.4.2 递归下降分析程序构造笔记

# 视频4.4.2 递归下降分析程序构造笔记

## 一、递归下降分析器的设计步骤
### 1.1 设计步骤
1. **检查文法**：确保文法是LL(1)的
2. **消除左递归**：如果存在左递归，先消除它
3. **提取左因子**：如果存在公共左因子，先提取它
4. **计算FIRST和FOLLOW集**：用于确定每个过程的选择
5. **为每个非终结符编写一个递归过程**
6. **编写匹配终结符的函数**
7. **编写主程序**
8. **测试和调试**

### 1.2 文法准备
递归下降分析要求文法是LL(1)的，即：
- 无左递归
- 无公共左因子
- 满足LL(1)条件

## 二、递归下降分析器的详细构造
### 2.1 示例：完整的表达式文法
**原文法**：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | num
```

**消除左递归后**：
```
E → TE'
E' → + TE' | - TE' | ε
T → FT'
T' → * FT' | / FT' | ε
F → ( E ) | id | num
```

**FIRST集**：
- FIRST(E) = {(, id, num}
- FIRST(E') = {+, -, ε}
- FIRST(T) = {(, id, num}
- FIRST(T') = {*, /, ε}
- FIRST(F) = {(, id, num}

**FOLLOW集**：
- FOLLOW(E) = {$, )}
- FOLLOW(E') = {$, )}
- FOLLOW(T) = {+, -, $, )}
- FOLLOW(T') = {+, -, $, )}
- FOLLOW(F) = {*, /, +, -, $, )}

### 2.2 递归下降分析器（C语言实现）
```c
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

// 记号类型
typedef enum {
    TOK_EOF,
    TOK_PLUS,
    TOK_MINUS,
    TOK_STAR,
    TOK_DIV,
    TOK_LPAREN,
    TOK_RPAREN,
    TOK_ID,
    TOK_NUM
} TokenType;

// 记号结构
typedef struct {
    TokenType type;
    union {
        char *id;
        int num;
    } val;
} Token;

// 全局变量
Token lookahead;
char *input;
int pos;

// 词法分析器
Token nextToken() {
    Token t;
    
    // 跳过空白
    while (isspace(input[pos])) {
        pos++;
    }
    
    // 文件结束
    if (input[pos] == '\0') {
        t.type = TOK_EOF;
        return t;
    }
    
    // 标识符
    if (isalpha(input[pos]) || input[pos] == '_') {
        int start = pos;
        while (isalnum(input[pos]) || input[pos] == '_') {
            pos++;
        }
        t.type = TOK_ID;
        t.val.id = (char*)malloc(pos - start + 1);
        strncpy(t.val.id, input + start, pos - start);
        t.val.id[pos - start] = '\0';
        return t;
    }
    
    // 数字
    if (isdigit(input[pos])) {
        int num = 0;
        while (isdigit(input[pos])) {
            num = num * 10 + (input[pos] - '0');
            pos++;
        }
        t.type = TOK_NUM;
        t.val.num = num;
        return t;
    }
    
    // 运算符和界符
    switch (input[pos]) {
        case '+': pos++; t.type = TOK_PLUS; return t;
        case '-': pos++; t.type = TOK_MINUS; return t;
        case '*': pos++; t.type = TOK_STAR; return t;
        case '/': pos++; t.type = TOK_DIV; return t;
        case '(': pos++; t.type = TOK_LPAREN; return t;
        case ')': pos++; t.type = TOK_RPAREN; return t;
        default:
            fprintf(stderr, "未知字符: %c\n", input[pos]);
            exit(1);
    }
}

// 错误处理
void error(const char *msg) {
    fprintf(stderr, "语法错误: %s\n", msg);
    exit(1);
}

// 匹配终结符
void match(TokenType expected) {
    if (lookahead.type == expected) {
        lookahead = nextToken();
    } else {
        char buf[100];
        sprintf(buf, "期望记号类型%d，得到%d", expected, lookahead.type);
        error(buf);
    }
}

// 前向声明
void F();
void T_prime();
void T();
void E_prime();
void E();

// F → ( E ) | id | num
void F() {
    switch (lookahead.type) {
        case TOK_LPAREN:
            match(TOK_LPAREN);
            E();
            match(TOK_RPAREN);
            break;
        case TOK_ID:
            printf("标识符: %s\n", lookahead.val.id);
            free(lookahead.val.id);
            match(TOK_ID);
            break;
        case TOK_NUM:
            printf("数字: %d\n", lookahead.val.num);
            match(TOK_NUM);
            break;
        default:
            error("期望'('、标识符或数字");
    }
}

// T' → * F T' | / F T' | ε
void T_prime() {
    switch (lookahead.type) {
        case TOK_STAR:
            printf("运算符: *\n");
            match(TOK_STAR);
            F();
            T_prime();
            break;
        case TOK_DIV:
            printf("运算符: /\n");
            match(TOK_DIV);
            F();
            T_prime();
            break;
        default:
            // ε产生式，什么都不做
            break;
    }
}

// T → F T'
void T() {
    F();
    T_prime();
}

// E' → + T E' | - T E' | ε
void E_prime() {
    switch (lookahead.type) {
        case TOK_PLUS:
            printf("运算符: +\n");
            match(TOK_PLUS);
            T();
            E_prime();
            break;
        case TOK_MINUS:
            printf("运算符: -\n");
            match(TOK_MINUS);
            T();
            E_prime();
            break;
        default:
            // ε产生式，什么都不做
            break;
    }
}

// E → T E'
void E() {
    T();
    E_prime();
}

// 主程序
int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "用法: %s \"表达式\"\n", argv[0]);
        return 1;
    }
    
    input = argv[1];
    pos = 0;
    lookahead = nextToken();
    
    printf("开始分析表达式: %s\n", input);
    E();
    
    if (lookahead.type != TOK_EOF) {
        error("输入未完全分析");
    }
    
    printf("分析成功！\n");
    return 0;
}
```

### 2.3 测试程序
编译并运行：
```bash
gcc parser.c -o parser
./parser "3 + 4 * 5"
```

输出：
```
开始分析表达式: 3 + 4 * 5
数字: 3
运算符: +
数字: 4
运算符: *
数字: 5
分析成功！
```

## 三、带属性计算的递归下降分析器
### 3.1 表达式求值
```c
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

typedef enum {
    TOK_EOF, TOK_PLUS, TOK_MINUS, TOK_STAR, TOK_DIV,
    TOK_LPAREN, TOK_RPAREN, TOK_NUM
} TokenType;

TokenType lookahead;
int num_val;
char *input;
int pos;

TokenType nextToken() {
    while (isspace(input[pos])) pos++;
    if (input[pos] == '\0') return TOK_EOF;
    if (isdigit(input[pos])) {
        num_val = 0;
        while (isdigit(input[pos])) {
            num_val = num_val * 10 + (input[pos] - '0');
            pos++;
        }
        return TOK_NUM;
    }
    switch (input[pos]) {
        case '+': pos++; return TOK_PLUS;
        case '-': pos++; return TOK_MINUS;
        case '*': pos++; return TOK_STAR;
        case '/': pos++; return TOK_DIV;
        case '(': pos++; return TOK_LPAREN;
        case ')': pos++; return TOK_RPAREN;
        default: exit(1);
    }
}

void match(TokenType expected) {
    if (lookahead == expected) lookahead = nextToken();
    else exit(1);
}

int F();
int T_prime(int inherited);
int T();
int E_prime(int inherited);
int E();

int F() {
    int val;
    if (lookahead == TOK_LPAREN) {
        match(TOK_LPAREN);
        val = E();
        match(TOK_RPAREN);
    } else if (lookahead == TOK_NUM) {
        val = num_val;
        match(TOK_NUM);
    } else {
        exit(1);
    }
    return val;
}

int T_prime(int inherited) {
    if (lookahead == TOK_STAR) {
        match(TOK_STAR);
        int val = F();
        return T_prime(inherited * val);
    } else if (lookahead == TOK_DIV) {
        match(TOK_DIV);
        int val = F();
        return T_prime(inherited / val);
    } else {
        return inherited;
    }
}

int T() {
    int val = F();
    return T_prime(val);
}

int E_prime(int inherited) {
    if (lookahead == TOK_PLUS) {
        match(TOK_PLUS);
        int val = T();
        return E_prime(inherited + val);
    } else if (lookahead == TOK_MINUS) {
        match(TOK_MINUS);
        int val = T();
        return E_prime(inherited - val);
    } else {
        return inherited;
    }
}

int E() {
    int val = T();
    return E_prime(val);
}

int main(int argc, char *argv[]) {
    input = argv[1];
    pos = 0;
    lookahead = nextToken();
    int result = E();
    printf("结果: %d\n", result);
    return 0;
}
```

## 四、错误恢复
### 4.1 错误恢复策略
1. **恐慌模式**：跳过输入符号，直到找到同步记号（FOLLOW集中的符号）
2. **短语级恢复**：对输入进行局部修改
3. **错误产生式**：加入错误产生式

### 4.2 恐慌模式恢复示例
```c
void E() {
    T();
    E_prime();
}

void E_prime() {
    while (1) {
        switch (lookahead.type) {
            case TOK_PLUS:
                match(TOK_PLUS);
                T();
                break;
            case TOK_MINUS:
                match(TOK_MINUS);
                T();
                break;
            default:
                // 检查是否是FOLLOW(E')中的符号
                if (lookahead.type == TOK_RPAREN || lookahead.type == TOK_EOF) {
                    return;
                }
                // 否则，跳过当前符号
                fprintf(stderr, "跳过错误符号\n");
                lookahead = nextToken();
        }
    }
}
```

## 五、递归下降分析器的最佳实践
1. **使用switch-case**：比多个if-else更清晰
2. **合理的错误消息**：提供有意义的错误信息
3. **适当的错误恢复**：实现简单的错误恢复机制
4. **模块化设计**：将词法分析和语法分析分离
5. **充分测试**：测试各种边界情况

---

## 章节：视频5.1.1 自下而上分析方法的基本思想笔记

# 视频5.1.1 自下而上分析方法的基本思想笔记

## 一、自下而上分析概述
### 1.1 基本思想
自下而上分析（Bottom-up Parsing）从输入串开始，逐步进行规约（Reduce），直到规约到文法的开始符号。

### 1.2 分析过程
1. 从输入串的最左开始
2. 寻找可规约的子串（句柄）
3. 将句柄规约为相应的非终结符
4. 重复步骤2-3，直到规约到开始符号或发现错误

### 1.3 规约与推导的关系
- **规约**：推导的逆过程
- **最左规约（规范规约）**：对应最右推导（规范推导）的逆过程
- **句柄**：最左规约中每次规约的子串，对应最右推导中最后一步使用的产生式的右部

## 二、自下而上分析的关键概念
### 2.1 短语、直接短语、句柄
设αβδ是文法G的一个句型，如果有：
1. S ⇒* αAδ
2. A ⇒+ β

则称β是句型αβδ相对于非终结符A的**短语**。

如果有：
1. S ⇒* αAδ
2. A ⇒ β

则称β是句型αβδ相对于产生式A→β的**直接短语**（简单短语）。

一个句型的**最左直接短语**称为该句型的**句柄**（Handle）。

### 2.2 示例
**文法**：
```
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**句型**：E + T * id

**分析**：
1. E ⇒ E + T ⇒ E + T * F ⇒ E + T * id
2. 短语：E + T * id, T * id, id
3. 直接短语：id
4. 句柄：id（最左直接短语）

**规约过程**：
```
E + T * id
  ⇑ 规约F→id
E + T * F
  ⇑ 规约T→T*F
E + T
  ⇑ 规约E→E+T
E
```

### 2.3 另一个示例
**句型**：id1 + id2 * id3

**短语**：
- id1 + id2 * id3（相对于E）
- id1（相对于E）
- id2 * id3（相对于T）
- id2（相对于F）
- id3（相对于F）

**直接短语**：id1, id2, id3

**句柄**：id1（最左直接短语）

## 三、移进-规约分析
### 3.1 基本方法
移进-规约分析使用一个栈来保存文法符号，分析器的动作有四种：
1. **移进（Shift）**：将下一个输入符号移进栈
2. **规约（Reduce）**：将栈顶的句柄规约为相应的非终结符
3. **接受（Accept）**：分析成功
4. **报错（Error）**：发现语法错误

### 3.2 分析器结构
```
输入缓冲区：a1 a2 a3 ... an $
              ↑
              输入指针
栈：$ X1 X2 ... Xm
          ↑
          栈顶
分析表：ACTION表和GOTO表
```

### 3.3 示例分析
**文法**：
```
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**输入**：id * id + id $

**分析过程**：

| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | $ | id * id + id $ | 移进 |
| 2 | $id | * id + id $ | 规约(6) F→id |
| 3 | $F | * id + id $ | 规约(4) T→F |
| 4 | $T | * id + id $ | 移进 |
| 5 | $T* | id + id $ | 移进 |
| 6 | $T*id | + id $ | 规约(6) F→id |
| 7 | $T*F | + id $ | 规约(3) T→T*F |
| 8 | $T | + id $ | 规约(2) E→T |
| 9 | $E | + id $ | 移进 |
| 10 | $E+ | id $ | 移进 |
| 11 | $E+id | $ | 规约(6) F→id |
| 12 | $E+F | $ | 规约(4) T→F |
| 13 | $E+T | $ | 规约(1) E→E+T |
| 14 | $E | $ | 接受 |

## 四、移进-规约分析中的冲突
### 4.1 移进-规约冲突
在某些状态下，既可以移进下一个输入符号，也可以规约栈顶的符号串。

**示例**：悬空else文法
```
S → if E then S
   | if E then S else S
   | other
```

**句型**：if E then if E then S else ...

栈中已有：`if E then if E then S`
输入符号是：`else`

此时有两种选择：
1. **规约**：将`if E then S`规约为S
2. **移进**：将`else`移进栈

这就是移进-规约冲突。

### 4.2 规约-规约冲突
在某些状态下，可以用两个或多个不同的产生式进行规约。

**示例**：
```
A → α
B → α
```

当栈顶是α时，既可以用A→α规约，也可以用B→α规约。

## 五、自下而上分析方法的分类
### 5.1 优先分析法
1. **简单优先分析法**：定义符号之间的优先关系
2. **算符优先分析法**：只考虑算符之间的优先关系

### 5.2 LR分析法
1. **LR(0)**：最简单的LR方法
2. **SLR(1)**：简单的LR方法
3. **LALR(1)**：向前看LR方法
4. **LR(1)**：规范LR方法

## 六、自下而上分析与自顶向下分析的比较
| 特性 | 自顶向下分析 | 自下而上分析 |
|------|-------------|-------------|
| 分析方向 | 从开始符号到输入 | 从输入到开始符号 |
| 核心操作 | 推导 | 规约 |
| 主要方法 | LL(1)、递归下降 | LR、算符优先 |
| 文法限制 | LL(1)文法 | LR文法（更广泛） |
| 错误检测 | 较早 | 较晚 |
| 实现复杂度 | 较简单 | 较复杂 |
| 适用范围 | 中小型语言 | 大多数编程语言 |

## 七、自下而上分析的优缺点
### 7.1 优点
1. **适用范围广**：可以处理大多数编程语言的文法
2. **效率高**：LR分析器是线性时间的
3. **能力强**：可以处理二义文法（通过附加规则）
4. **自动生成**：可以使用工具自动生成分析器

### 7.2 缺点
1. **实现复杂**：手工实现LR分析器比较困难
2. **错误定位**：错误检测较晚，定位相对困难
3. **分析表大**：LR(1)分析表可能很大

---

## 章节：视频5.1.2 分析树与规范规约笔记

# 视频5.1.2 分析树与规范规约笔记

## 一、分析树（Parse Tree）
### 1.1 分析树的定义
分析树是描述句型推导过程的树结构，满足以下条件：
1. 根节点标记为开始符号S
2. 每个叶子节点标记为终结符或ε
3. 每个内部节点标记为非终结符
4. 如果内部节点A有子节点X₁, X₂, ..., Xₙ（从左到右），则存在产生式A→X₁X₂...Xₙ

### 1.2 分析树的示例
**文法**：
```
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**句子**：id + id * id

**分析树**：
```
        E
       /|\
      E + T
      |  /|\
      T T * F
      | |  |
      F F  id
      | |
      id id
```

### 1.3 分析树的性质
1. **叶子节点顺序**：从左到右的叶子节点构成句子，称为树的产出
2. **推导与分析树**：每个推导对应一棵分析树
3. **最左/最右推导**：同一棵分析树可能对应多个推导，但最左推导和最右推导是唯一的

## 二、最右推导（规范推导）
### 2.1 定义
最右推导（Rightmost Derivation）是指在每一步推导中，总是选择最右边的非终结符进行替换。

最右推导也称为**规范推导**（Canonical Derivation）。

### 2.2 示例
**文法**：
```
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**句子**：id + id * id

**最右推导**：
```
E ⇒ E + T
  ⇒ E + T * F
  ⇒ E + T * id
  ⇒ E + F * id
  ⇒ E + id * id
  ⇒ T + id * id
  ⇒ F + id * id
  ⇒ id + id * id
```

### 2.3 最右推导的特点
1. 每一步替换最右边的非终结符
2. 对应最左规约
3. 规范推导产生规范句型

## 三、规范规约（最左规约）
### 3.1 定义
规范规约（Canonical Reduction）是最右推导的逆过程，在每一步规约中，总是选择**最左直接短语（句柄）**进行规约。

规范规约也称为**最左规约**。

### 3.2 规约过程
给定输入串w = a₁a₂...aₙ，规范规约的步骤：
1. 从w开始，它是一个规范句型
2. 重复：
   a. 找到当前句型的句柄
   b. 将句柄规约为相应的非终结符
3. 直到规约到开始符号S

### 3.3 示例
**句子**：id + id * id

**规范规约**：
```
id + id * id
  ⇑ 规约F→id
F + id * id
  ⇑ 规约T→F
T + id * id
  ⇑ 规约E→T
E + id * id
  ⇑ 规约F→id
E + F * id
  ⇑ 规约T→F
E + T * id
  ⇑ 规约F→id
E + T * F
  ⇑ 规约T→T*F
E + T
  ⇑ 规约E→E+T
E
```

## 四、句柄（Handle）
### 4.1 短语、直接短语、句柄的定义
设αβδ是文法G的一个句型，如果有：
1. S ⇒* αAδ
2. A ⇒+ β

则称β是句型αβδ相对于非终结符A的**短语**。

如果有：
1. S ⇒* αAδ
2. A ⇒ β

则称β是句型αβδ相对于产生式A→β的**直接短语**（简单短语）。

一个句型的**最左直接短语**称为该句型的**句柄**。

### 4.2 示例
**句型**：E + T * id

**分析**：
- 短语：E + T * id, T * id, id
- 直接短语：id
- 句柄：id

**句型**：E + T * F

**分析**：
- 短语：E + T * F, T * F, F
- 直接短语：F
- 句柄：F

**句型**：E + T

**分析**：
- 短语：E + T, T
- 直接短语：T
- 句柄：T

### 4.3 句柄的性质
1. **唯一性**：对于规范句型，句柄是唯一的
2. **位置**：句柄总是出现在栈顶（在移进-规约分析中）
3. **与最右推导的关系**：句柄是最右推导中最后一步被替换的符号串

### 4.4 句柄的识别
在移进-规约分析中，句柄识别是关键问题。LR分析法使用有限自动机来识别句柄。

## 五、活前缀（Viable Prefix）
### 5.1 定义
活前缀是规范句型的一个前缀，它不包含该句型的句柄右边的任何符号。

换句话说，活前缀是可以出现在移进-规约分析栈中的符号串。

### 5.2 示例
**规范句型**：E + T * id
**活前缀**：
- ε
- E
- E +
- E + T
- E + T *
- E + T * id（包含句柄id）

**规范句型**：E + T * F
**活前缀**：
- ε
- E
- E +
- E + T
- E + T *
- E + T * F（包含句柄F）

### 5.3 活前缀的性质
1. 规范句型的任何前缀，只要不超过句柄的右端，就是活前缀
2. 活前缀是可以安全地移进栈中的符号串
3. 如果活前缀包含句柄，则可以进行规约

## 六、规范推导与规范规约的关系
### 6.1 对应关系
- 最右推导 ⇨ 规范规约（逆过程）
- 规范推导中的每一步A→γ ⇨ 规范规约中的每一步γ→A
- 规范推导中的句子 ⇨ 规范规约的输入
- 规范推导中的开始符号 ⇨ 规范规约的结果

### 6.2 完整示例
**文法**：
```
E → E + T | T
T → T * F | F
F → id
```

**最右推导**：
```
E ⇒ E + T
  ⇒ E + T * F
  ⇒ E + T * id
  ⇒ E + F * id
  ⇒ E + id * id
  ⇒ T + id * id
  ⇒ F + id * id
  ⇒ id + id * id
```

**规范规约**（逆过程）：
```
id + id * id
  ⇑ 规约F→id
F + id * id
  ⇑ 规约T→F
T + id * id
  ⇑ 规约E→T
E + id * id
  ⇑ 规约F→id
E + F * id
  ⇑ 规约T→F
E + T * id
  ⇑ 规约F→id
E + T * F
  ⇑ 规约T→T*F
E + T
  ⇑ 规约E→E+T
E
```

## 七、LR分析的基本思想
### 7.1 核心思想
LR分析器的核心是识别活前缀的有限自动机。通过这个自动机，可以确定何时移进、何时规约。

### 7.2 LR分析器的组成
1. **输入缓冲区**：存放输入串
2. **分析栈**：存放状态和符号
3. **分析表**：ACTION表和GOTO表
4. **总控程序**：根据栈顶状态和当前输入符号执行动作

### 7.3 LR分析的步骤
1. 将初始状态和$压入栈
2. 根据栈顶状态和当前输入符号查ACTION表
3. 执行相应的动作（移进、规约、接受、报错）
4. 重复步骤2-3，直到接受或报错

## 八、重要概念总结
1. **分析树**：描述推导过程的树结构
2. **最右推导**：每一步替换最右边的非终结符
3. **规范规约**：最右推导的逆过程，每一步规约最左直接短语
4. **句柄**：最左直接短语
5. **活前缀**：规范句型的前缀，不超过句柄右端
6. **短语**：可以规约为非终结符的子串
7. **直接短语**：一步推导得到的短语

---

## 章节：视频5.1.3 符号栈的使用笔记

# 视频5.1.3 符号栈的使用笔记

## 一、移进-规约分析器的结构
### 1.1 基本组成
移进-规约分析器由以下部分组成：
1. **输入缓冲区**：存放输入串，以$结束
2. **分析栈**：存放状态和符号
3. **分析表**：ACTION表和GOTO表
4. **总控程序**：控制分析过程

### 1.2 分析栈
分析栈用于存储文法符号和状态。在LR分析中，栈中的每个元素是一个二元组：
- **状态**：表示当前的分析状态
- **符号**：表示文法符号（终结符或非终结符）

栈的表示：
```
栈底 → s0 X1 s1 X2 s2 ... Xm sm ← 栈顶
```
其中：
- s0, s1, ..., sm是状态
- X1, X2, ..., Xm是文法符号

## 二、符号栈的操作
### 2.1 栈的基本操作
1. **压栈（Push）**：将符号和状态压入栈顶
2. **弹栈（Pop）**：从栈顶弹出符号和状态
3. **查看栈顶**：查看栈顶的符号和状态

### 2.2 移进操作（Shift）
当ACTION表指示移进时：
1. 将当前输入符号a移进栈
2. 将下一个状态s移进栈
3. 输入指针前移

**示例**：
```
栈：$ s0
输入：id * id + id $
动作：移进
结果：
栈：$ s0 id s1
输入：* id + id $
```

### 2.3 规约操作（Reduce）
当ACTION表指示规约时：
1. 从栈顶弹出2×|β|个符号（β是产生式右部的长度）
2. 查看弹出后的栈顶状态s
3. 查GOTO表，得到GOTO[s, A] = t（A是产生式左部）
4. 将A压入栈
5. 将t压入栈

**示例**：
产生式：F → id
```
栈：$ s0 id s1
输入：* id + id $
动作：规约F→id
步骤：
1. 弹出2×1=2个符号：s1, id
2. 栈顶状态：s0
3. 查GOTO[s0, F] = s2
4. 压入F和s2
结果：
栈：$ s0 F s2
输入：* id + id $
```

### 2.4 接受操作（Accept）
当ACTION表指示接受时：
1. 分析成功
2. 结束分析

**示例**：
```
栈：$ s0 E s1
输入：$
动作：接受
分析成功！
```

### 2.5 报错操作（Error）
当ACTION表为空或指示错误时：
1. 发现语法错误
2. 调用错误恢复程序

## 三、LR分析算法
### 3.1 算法描述
```
输入：输入串w，LR分析表
输出：如果w是句子，输出分析过程；否则报错

初始化：
  将初始状态s0压入栈
  输入指针ip指向w的第一个符号
  a = 输入[ip]

循环：
  s = 栈顶状态
  查ACTION[s, a]
  case ACTION[s, a] of:
    shift s':
      将a和s'压入栈
      ip = ip + 1
      a = 输入[ip]
    reduce A→β:
      弹出2×|β|个符号
      s' = 栈顶状态
      将A和GOTO[s', A]压入栈
      输出产生式A→β
    accept:
      分析成功，返回
    error:
      调用错误恢复程序
```

### 3.2 示例分析
**文法**：
```
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**输入**：id * id + id $

**分析表**（简化）：

| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   | acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |   |
| 7 | s5 |   |   | s4 |   |   |   |   |   | 10|
| 8 |    | s6|   |   | s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

**分析过程**：

| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | 0 | id * id + id $ | s5 |
| 2 | 0 id 5 | * id + id $ | r6 (F→id) |
| 3 | 0 F 3 | * id + id $ | r4 (T→F) |
| 4 | 0 T 2 | * id + id $ | s7 |
| 5 | 0 T 2 * 7 | id + id $ | s5 |
| 6 | 0 T 2 * 7 id 5 | + id $ | r6 (F→id) |
| 7 | 0 T 2 * 7 F 10 | + id $ | r3 (T→T*F) |
| 8 | 0 T 2 | + id $ | r2 (E→T) |
| 9 | 0 E 1 | + id $ | s6 |
| 10 | 0 E 1 + 6 | id $ | s5 |
| 11 | 0 E 1 + 6 id 5 | $ | r6 (F→id) |
| 12 | 0 E 1 + 6 F 3 | $ | r4 (T→F) |
| 13 | 0 E 1 + 6 T 9 | $ | r1 (E→E+T) |
| 14 | 0 E 1 | $ | acc |

## 四、栈的变化过程详解
### 4.1 移进操作的栈变化
```
初始状态：
栈：[0]
输入：id * id + id $
a = id

执行s5（移进）：
压入id和5
栈：[0, id, 5]
输入指针前移
a = *
```

### 4.2 规约操作的栈变化
```
当前状态：
栈：[0, id, 5]
输入：* id + id $
a = *

执行r6（规约F→id）：
1. 弹出2×1=2个符号：5, id
   栈变为：[0]
2. 栈顶状态s' = 0
3. 查GOTO[0, F] = 3
4. 压入F和3
   栈变为：[0, F, 3]
```

### 4.3 多符号规约的栈变化
```
当前状态：
栈：[0, T, 2, *, 7, F, 10]
输入：+ id $
a = +

执行r3（规约T→T*F）：
1. 弹出2×3=6个符号：10, F, 7, *, 2, T
   栈变为：[0]
2. 栈顶状态s' = 0
3. 查GOTO[0, T] = 2
4. 压入T和2
   栈变为：[0, T, 2]
```

## 五、错误检测与恢复
### 5.1 错误检测
当发生以下情况时检测到错误：
1. ACTION表中对应项为空
2. ACTION表中对应项为error
3. 移进的符号与期望不符

### 5.2 错误恢复策略
1. **恐慌模式恢复**：
   - 从栈顶弹出状态，直到找到某个状态s，它有对应的GOTO转移
   - 从输入中跳过符号，直到找到某个符号a，使得ACTION[s, a]有定义
   - 将GOTO[s, A]压入栈，继续分析

2. **短语级恢复**：
   - 对剩余输入进行局部修改
   - 插入或删除符号
   - 继续分析

3. **错误产生式**：
   - 加入错误产生式
   - 识别常见错误
   - 给出错误信息

## 六、LR分析栈的特点
1. **符号和状态成对出现**：每个符号后面跟着一个状态
2. **状态决定动作**：栈顶状态决定下一步动作
3. **GOTO表决定状态转移**：规约后通过GOTO表确定新状态
4. **线性分析**：LR分析是线性时间的
5. **无需回溯**：LR分析不需要回溯

## 七、与其他分析方法的栈比较
| 分析方法 | 栈的内容 | 栈的作用 |
|----------|----------|----------|
| LL(1)分析 | 文法符号 | 预测推导 |
| 递归下降 | 调用栈（隐式） | 控制递归 |
| 算符优先 | 算符和操作数 | 确定规约时机 |
| LR分析 | 符号和状态 | 识别句柄 |

---

## 章节：视频5.1~5.3 语法分析-自底向上笔记

# 视频5.1~5.3 语法分析-自底向上笔记

## 一、自下而上分析方法的基本思想
### 1.1 自底向上分析的概念
- **从叶子结点开始**：从输入串开始，逐步向上归约
- **归约**：将可归约串替换为非终结符
- **目标**：归约到开始符号

### 1.2 自底向上分析的关键问题
1. **如何找出可归约串**
2. **用哪个产生式进行归约**

### 1.3 自底向上分析方法分类
1. **算符优先分析法**
   - 简单直观
   - 适合表达式分析

2. **LR分析法**
   - LR(0)
   - SLR(1)
   - LALR(1)
   - LR(1)
   - 功能强大，适用范围广

## 二、分析树与规范规约
### 2.1 规范推导和规范归约
- **最右推导（规范推导）**：每一步都替换最右非终结符
- **最左归约（规范归约）**：每一步都归约最左直接短语（句柄）
- **规范归约是规范推导的逆过程**

### 2.2 短语、直接短语、句柄
- **短语**：子树的叶子结点从左到右组成的符号串
- **直接短语**：子树只有父子两代的短语
- **句柄**：最左直接短语

### 2.3 示例
- **文法**：S→aAcBe，A→b，A→Ab，B→d
- **输入串**：abbcde
- **规范归约过程**：
  1. abbcde
  2. aAbcde （归约A→b）
  3. aAcde  （归约A→Ab）
  4. aAcBe  （归约B→d）
  5. S     （归约S→aAcBe）

## 三、符号栈的使用
### 3.1 移进-归约分析器
- **栈**：存放文法符号
- **输入缓冲区**：存放输入串
- **分析表**：指导分析动作
- **输出**：产生式序列

### 3.2 分析动作
1. **移进**：把下一个输入符号移进栈
2. **归约**：把栈顶的句柄归约为非终结符
3. **接受**：分析成功
4. **报错**：发现语法错误

### 3.3 分析过程
1. **初始化**：栈为#，输入指针指向第一个符号
2. **分析**：根据栈顶符号和当前输入符号决定动作
3. **结束**：栈为#S，输入为#，接受

## 四、算符优先文法
### 4.1 算符文法
- **算符文法（OG）**：任何产生式的右部都不含两个相邻的非终结符

### 4.2 算符优先关系
- **a ≖ b**：a和b优先级相等
- **a ≺ b**：a的优先级低于b
- **a ≻ b**：a的优先级高于b

### 4.3 算符优先文法的定义
- **算符优先文法（OPG）**：
  1. 是算符文法
  2. 任意两个终结符之间至多有≖、≺、≻中的一种关系

### 4.4 最左素短语
- **素短语**：至少含一个终结符，且除自身外不含更小的素短语
- **最左素短语**：最左边的素短语
- **算符优先分析中，归约的是最左素短语，不是句柄**

## 五、优先表构造
### 5.1 FIRSTVT集和LASTVT集
1. **FIRSTVT(P)**：P的所有句型中，出现在最左的终结符
   - 若有产生式P→a...或P→Qa...，则a ∈ FIRSTVT(P)
   - 若有产生式P→Q...，且a ∈ FIRSTVT(Q)，则a ∈ FIRSTVT(P)

2. **LASTVT(P)**：P的所有句型中，出现在最右的终结符
   - 若有产生式P→...a或P→...aQ，则a ∈ LASTVT(P)
   - 若有产生式P→...Q，且a ∈ LASTVT(Q)，则a ∈ LASTVT(P)

### 5.2 优先关系的构造
1. **对产生式P→...aQb...**：a ≖ b
2. **对产生式P→...aQ...**：对任何b ∈ FIRSTVT(Q)，a ≺ b
3. **对产生式P→...Qb...**：对任何a ∈ LASTVT(Q)，a ≻ b
4. **对#**：
   - # ≺ a，其中a ∈ FIRSTVT(S)
   - a ≻ #，其中a ∈ LASTVT(S)
   - # ≖ #

## 六、算符优先分析算法
### 6.1 算符优先分析器的结构
- **栈**：存放文法符号
- **优先关系表**：存放终结符之间的优先关系
- **输入缓冲区**：存放输入串

### 6.2 分析算法
1. **初始化**：k=1，S[1]=#
2. **重复**：
   - 令j=k，向下找栈中最接近栈顶的终结符
   - 当S[j] ≺ a 或 S[j] ≖ a 时，j--
   - 若S[j+1]...S[k]是素短语，则归约
   - 否则移进a，k++
3. **直到**：k=2且S[2]=S（开始符号）

## 七、优先函数
### 7.1 优先函数的概念
- **优先函数**：用两个函数f和g表示优先关系
  - 若a ≺ b，则f(a) < g(b)
  - 若a ≖ b，则f(a) = g(b)
  - 若a ≻ b，则f(a) > g(b)

### 7.2 优先函数的构造
1. **Floyd方法**：
   - 对每个终结符a，创建两个结点fₐ和gₐ
   - 若a ≺ b，画一条从gᵦ到fₐ的有向边
   - 若a ≻ b，画一条从fₐ到gᵦ的有向边
   - 若a ≖ b，画一条从fₐ到gᵦ和从gᵦ到fₐ的有向边
   - 若有环，则不存在优先函数
   - 否则，f(a) = 从fₐ出发的最长路径 + 1
   - g(a) = 从gₐ出发的最长路径 + 1

### 7.3 优先函数的优点
- 节省存储空间
- 比较速度快

## 八、LR分析器
### 8.1 LR分析器的结构
- **输入缓冲区**：存放输入串
- **分析栈**：存放状态和文法符号
- **分析表**：ACTION表和GOTO表
  - ACTION[s, a]：在状态s，输入a时的动作
  - GOTO[s, A]：在状态s，归约后非终结符A的状态

### 8.2 LR分析表的动作
1. **移进（s）**：移进输入符号，转到新状态
2. **归约（r）**：用产生式归约
3. **接受（acc）**：分析成功
4. **报错**：发现错误

### 8.3 LR分析过程
1. **初始化**：栈为[0, #]
2. **分析**：
   - 令s是栈顶状态，a是当前输入符号
   - 若ACTION[s, a] = sⱼ：
     - 移进a和状态j
     - 输入指针后移
   - 若ACTION[s, a] = rᵢ（用第i个产生式A→β归约）：
     - 弹出|β|个符号
     - 令s'是新的栈顶状态
     - 压入A和GOTO[s', A]
   - 若ACTION[s, a] = acc：分析成功
   - 否则：报错
3. **重复**：直到接受或报错

## 九、构造识别活前缀的DFA
### 9.1 活前缀
- **活前缀**：规范句型的前缀，它不包括句柄右边的任何符号
- **LR分析的过程**：就是识别活前缀的过程

### 9.2 LR(0)项目
- **LR(0)项目**：在产生式右部的某个位置加一个点
  - A→·α
  - A→α·β
  - A→α·
- **项目的分类**：
  - 移进项目：A→α·aβ
  - 待约项目：A→α·Bβ
  - 归约项目：A→α·
  - 接受项目：S'→S·

### 9.3 项目集规范族的构造
1. **拓广文法**：增加产生式S'→S
2. **闭包（Closure）**：
   - I的所有项目都在Closure(I)中
   - 若A→α·Bβ在Closure(I)中，则所有B→·γ也在Closure(I)中
   - 重复直到不再增加
3. **GO函数**：GO(I, X) = Closure({A→αX·β | A→α·Xβ ∈ I})
4. **构造项目集规范族**：
   - C = {Closure({S'→·S})}
   - 对每个I ∈ C，对每个文法符号X，若GO(I, X)非空且不在C中，则加入C
   - 重复直到不再增加

## 十、LR(0)分析表的构造
### 10.1 LR(0)分析表构造
1. **若项目A→α·aβ在Iᵢ中，且GO(Iᵢ, a)=Iⱼ**：则ACTION[i, a] = sⱼ
2. **若项目A→α·在Iᵢ中**：则对任何a ∈ Vₜ ∪ {#}，ACTION[i, a] = rⱼ（j是A→α的编号）
3. **若项目S'→S·在Iᵢ中**：则ACTION[i, #] = acc
4. **若GO(Iᵢ, A)=Iⱼ**：则GOTO[i, A] = j
5. **其他**：标出错

### 10.2 LR(0)文法
- **LR(0)文法**：构造的LR(0)分析表没有多重定义
- **冲突**：移进-归约冲突、归约-归约冲突

## 十一、SLR(1)分析法的思想
### 11.1 SLR(1)的基本思想
- **解决LR(0)的冲突**：利用FOLLOW集
- **当出现归约项目A→α·时**：只对a ∈ FOLLOW(A)进行归约

## 十二、SLR(1)分析表的构造
### 12.1 SLR(1)分析表构造
1. **若项目A→α·aβ在Iᵢ中，且GO(Iᵢ, a)=Iⱼ**：则ACTION[i, a] = sⱼ
2. **若项目A→α·在Iᵢ中**：则对任何a ∈ FOLLOW(A)，ACTION[i, a] = rⱼ（j是A→α的编号）
3. **若项目S'→S·在Iᵢ中**：则ACTION[i, #] = acc
4. **若GO(Iᵢ, A)=Iⱼ**：则GOTO[i, A] = j
5. **其他**：标出错

### 12.2 SLR(1)文法
- **SLR(1)文法**：构造的SLR(1)分析表没有多重定义
- **比LR(0)文法的范围更广**

## 十三、二义文法的使用
### 13.1 二义文法在LR分析中的应用
- **二义文法本身不是LR文法**
- **但可以通过规定优先级和结合性来消除冲突**
- **二义文法的分析表更小，分析速度更快**

### 13.2 示例
- **二义表达式文法**：E→E+E | E*E | (E) | id
- **规定**：*优先于+，都左结合
- **可以构造出无冲突的分析表**

## 十四、总结
自底向上分析法从输入串开始，通过归约构造语法树。算符优先分析法适合表达式分析，LR分析法功能强大，适用范围广。LR(0)是基础，SLR(1)利用FOLLOW集解决冲突，二义文法通过规定优先级和结合性也可以用于LR分析。

---

## 章节：视频5.2.1 算符优先文法笔记

# 视频5.2.1 算符优先文法笔记

## 一、算符优先分析法概述
### 1.1 算符优先分析法的特点
算符优先分析法（Operator Precedence Parsing）是一种自底向上的语法分析方法，特别适合于表达式的分析。

**特点**：
1. 简单直观，易于手工实现
2. 只考虑算符之间的优先关系
3. 适合表达式分析
4. 不是形式化的方法（不基于CFG）
5. 不处理非终结符之间的关系

### 1.2 适用范围
- 算术表达式
- 逻辑表达式
- 各种带运算符的表达式语言

## 二、算符文法
### 2.1 算符文法的定义
如果一个文法G中没有形如A→...BC...的产生式（B、C都是非终结符），则称G为算符文法（Operator Grammar）。

换句话说，算符文法中任何产生式的右部都不会出现两个非终结符相邻的情况。

### 2.2 算符文法的示例
**示例1：表达式文法**
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id
```
这是一个算符文法，没有两个非终结符相邻。

**示例2：非算符文法**
```
S → AaB
A → b | ε
B → c
```
这个文法不是算符文法，因为S→AaB中有A和B两个非终结符相邻。

### 2.3 算符文法的性质
1. 任何句型都不会有两个非终结符相邻
2. 任何短语中不会有两个非终结符相邻
3. 句柄中不会有两个非终结符相邻

## 三、算符优先关系
### 3.1 算符优先关系的定义
在算符文法中，终结符之间可能有三种优先关系：
1. **a <· b**：a的优先级低于b
2. **a =· b**：a的优先级等于b
3. **a >· b**：a的优先级高于b

注意：这些优先关系不是对称的，a <· b并不意味着b >· a。

### 3.2 优先关系的直观含义
对于表达式a op1 b op2 c：
- 如果op1 <· op2，则先计算b op2 c
- 如果op1 >· op2，则先计算a op1 b
- 如果op1 =· op2，则op1和op2优先级相同，按结合性处理

## 四、算符优先关系的计算
### 4.1 FIRSTVT集和LASTVT集
为了计算算符优先关系，需要定义两个集合：

**FIRSTVT(P)**：非终结符P的所有可能的第一个终结符的集合
```
FIRSTVT(P) = { a | P ⇒+ a... 或 P ⇒+ Qa..., a∈T, Q∈V }
```

**LASTVT(P)**：非终结符P的所有可能的最后一个终结符的集合
```
LASTVT(P) = { a | P ⇒+ ...a 或 P ⇒+ ...aQ, a∈T, Q∈V }
```

### 4.2 计算FIRSTVT集的算法
```
初始化：
  对每个非终结符P，FIRSTVT(P) = ∅

1. 对每个产生式 P → a... 或 P → Qa...
   将a加入FIRSTVT(P)

2. 对每个产生式 P → Q...
   将FIRSTVT(Q)加入FIRSTVT(P)

3. 重复步骤2，直到没有新的终结符可以加入
```

### 4.3 计算LASTVT集的算法
```
初始化：
  对每个非终结符P，LASTVT(P) = ∅

1. 对每个产生式 P → ...a 或 P → ...aQ
   将a加入LASTVT(P)

2. 对每个产生式 P → ...Q
   将LASTVT(Q)加入LASTVT(P)

3. 重复步骤2，直到没有新的终结符可以加入
```

### 4.4 算符优先关系的构造
根据产生式构造算符优先关系：

1. **对于产生式 P → ...ab... 或 P → ...aQb...**
   a =· b

2. **对于产生式 P → ...aQ...**
   对所有b∈FIRSTVT(Q)
   a <· b

3. **对于产生式 P → ...Qb...**
   对所有a∈LASTVT(Q)
   a >· b

### 4.5 示例计算
**文法**：
```
E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id
```

**计算FIRSTVT**：
- FIRSTVT(F) = {(, id}
- FIRSTVT(T) = {*, /} ∪ FIRSTVT(F) = {*, /, (, id}
- FIRSTVT(E) = {+, -} ∪ FIRSTVT(T) = {+, -, *, /, (, id}

**计算LASTVT**：
- LASTVT(F) = {), id}
- LASTVT(T) = {*, /} ∪ LASTVT(F) = {*, /, ), id}
- LASTVT(E) = {+, -} ∪ LASTVT(T) = {+, -, *, /, ), id}

**构造优先关系**：
1. 从E→E+T：
   - LASTVT(E) >· +
   - + <· FIRSTVT(T)

2. 从E→E-T：
   - LASTVT(E) >· -
   - - <· FIRSTVT(T)

3. 从T→T*F：
   - LASTVT(T) >· *
   - * <· FIRSTVT(F)

4. 从T→T/F：
   - LASTVT(T) >· /
   - / <· FIRSTVT(F)

5. 从F→(E)：
   - ( =· )
   - ( <· FIRSTVT(E)
   - LASTVT(E) >· )

**优先关系表**：

|   | + | - | * | / | ( | ) | id | $ |
|---|---|---|---|---|---|---|----|---|
| + | >·| >·| <·| <·| <·| >·| <·| >·|
| - | >·| >·| <·| <·| <·| >·| <·| >·|
| * | >·| >·| >·| >·| <·| >·| <·| >·|
| / | >·| >·| >·| >·| <·| >·| <·| >·|
| ( | <·| <·| <·| <·| <·| =·| <·|   |
| ) | >·| >·| >·| >·|   | >·|   | >·|
| id| >·| >·| >·| >·|   | >·|   | >·|
| $ | <·| <·| <·| <·| <·|   | <·|   |

## 五、算符优先分析算法
### 5.1 算法描述
```
输入：输入串w，算符优先关系表
输出：如果w是句子，分析成功；否则失败

初始化：
  栈.push($)
  k = 1
  输入指针ip指向w的第一个符号
  a = 输入[ip]

循环：
  将栈顶的终结符记为a_j（从栈顶向下找第一个终结符）
  if a_j <· a or a_j =· a:
    栈.push(a)
    ip = ip + 1
    a = 输入[ip]
  else:
    // 规约
    重复：
      从栈顶弹出符号，直到找到a_i <· a_j
    将最左素短语规约为某个非终结符N
    栈.push(N)
  until a == $ and 栈顶是$

if 栈 == [$N$]：
  分析成功
else：
  分析失败
```

### 5.2 素短语
素短语是一个短语，它至少包含一个终结符，且除自身外不再包含其他素短语。

算符优先分析中，每次规约的是最左素短语。

### 5.3 示例分析
**输入**：id + id * id $

**分析过程**：

| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | $ | id + id * id $ | $ <· id，移进 |
| 2 | $id | + id * id $ | id >· +，规约id→F |
| 3 | $F | + id * id $ | F不是终结符，继续看$ |
| 4 | $F | + id * id $ | $ <· +，移进 |
| 5 | $F+ | id * id $ | + <· id，移进 |
| 6 | $F+id | * id $ | id >· *，规约id→F |
| 7 | $F+F | * id $ | F不是终结符，继续看+ |
| 8 | $F+F | * id $ | + <· *，移进 |
| 9 | $F+F* | id $ | * <· id，移进 |
| 10 | $F+F*id | $ | id >· $，规约id→F |
| 11 | $F+F*F | $ | F不是终结符，继续看* |
| 12 | $F+F*F | $ | * >· $，规约F*F→T |
| 13 | $F+T | $ | T不是终结符，继续看+ |
| 14 | $F+T | $ | + >· $，规约F+T→E |
| 15 | $E | $ | 分析成功！ |

## 六、算符优先分析法的优缺点
### 6.1 优点
1. **简单**：算法简单，易于理解和实现
2. **高效**：分析速度快
3. **适合表达式**：特别适合表达式分析
4. **手工实现**：可以手工实现

### 6.2 缺点
1. **能力有限**：只能分析算符文法
2. **不处理非终结符**：不考虑非终结符之间的关系
3. **可能接受错误句子**：可能接受一些不是文法句子的串
4. **不是形式化方法**：不基于严格的CFG

## 七、算符优先分析法的应用
1. **表达式求值**：计算器程序
2. **编译器表达式分析**：编译器中表达式的语法分析
3. **公式处理**：数学公式、逻辑公式的处理
4. **简单语言实现**：小型脚本语言的表达式部分

---

## 章节：视频5.2.2 优先表构造笔记

# 视频5.2.2 优先表构造笔记

## 一、FIRSTVT集和LASTVT集
### 1.1 FIRSTVT集
**定义**：FIRSTVT(P)是所有在P的句型中作为最左终结符出现的符号集合。

**计算规则**：
1. **规则1**：若有产生式P→a... 或 P→Qa...，则 a ∈ FIRSTVT(P)
2. **规则2**：若有产生式P→Q...，且 a ∈ FIRSTVT(Q)，则 a ∈ FIRSTVT(P)

**算法**：
```
FIRSTVT(P) = ∅
for 每个产生式 P→... do
    if 产生式是 P→a... 或 P→Qa... then
        将 a 加入 FIRSTVT(P)
    end if
end for

repeat
    变化标志 = false
    for 每个产生式 P→Q... do
        for 每个 a ∈ FIRSTVT(Q) do
            if a ∉ FIRSTVT(P) then
                将 a 加入 FIRSTVT(P)
                变化标志 = true
            end if
        end for
    end for
until 变化标志 = false
```

**示例**：
```
文法：
E → E+T | T
T → T*F | F
F → (E) | id

计算FIRSTVT：
FIRSTVT(F) = {(, id}
FIRSTVT(T) = {*, (, id}
FIRSTVT(E) = {+, *, (, id}
```

### 1.2 LASTVT集
**定义**：LASTVT(P)是所有在P的句型中作为最右终结符出现的符号集合。

**计算规则**：
1. **规则1**：若有产生式P→...a 或 P→...aQ，则 a ∈ LASTVT(P)
2. **规则2**：若有产生式P→...Q，且 a ∈ LASTVT(Q)，则 a ∈ LASTVT(P)

**算法**：
```
LASTVT(P) = ∅
for 每个产生式 P→... do
    if 产生式是 P→...a 或 P→...aQ then
        将 a 加入 LASTVT(P)
    end if
end for

repeat
    变化标志 = false
    for 每个产生式 P→...Q do
        for 每个 a ∈ LASTVT(Q) do
            if a ∉ LASTVT(P) then
                将 a 加入 LASTVT(P)
                变化标志 = true
            end if
        end for
    end for
until 变化标志 = false
```

**示例**：
```
文法：
E → E+T | T
T → T*F | F
F → (E) | id

计算LASTVT：
LASTVT(F) = {), id}
LASTVT(T) = {*, ), id}
LASTVT(E) = {+, *, ), id}
```

## 二、优先关系的构造
### 2.1 优先关系的三种类型
1. **≖（等于关系）**：a ≖ b
2. **≺（低于关系）**：a ≺ b
3. **≻（高于关系）**：a ≻ b

### 2.2 优先关系的构造规则
**规则1（≖关系）**：
对于产生式 P → ...aQb... 或 P → ...ab...，则 a ≖ b

**规则2（≺关系）**：
对于产生式 P → ...aQ...，则对任意 b ∈ FIRSTVT(Q)，有 a ≺ b

**规则3（≻关系）**：
对于产生式 P → ...Qb...，则对任意 a ∈ LASTVT(Q)，有 a ≻ b

**规则4（#的关系）**：
1. 对任意 a ∈ FIRSTVT(S)，有 # ≺ a
2. 对任意 a ∈ LASTVT(S)，有 a ≻ #
3. # ≖ #

### 2.3 优先关系构造示例
**文法**：
```
E → E+T | T
T → T*F | F
F → (E) | id
```

**第一步：计算FIRSTVT和LASTVT**
```
FIRSTVT(E) = {+, *, (, id}
FIRSTVT(T) = {*, (, id}
FIRSTVT(F) = {(, id}

LASTVT(E) = {+, *, ), id}
LASTVT(T) = {*, ), id}
LASTVT(F) = {), id}
```

**第二步：应用规则1（≖关系）**
```
从 F→(E) 得：( ≖ )
```

**第三步：应用规则2（≺关系）**
```
从 E→E+T：
  + ≺ * （* ∈ FIRSTVT(T)）
  + ≺ ( （( ∈ FIRSTVT(T)）
  + ≺ id （id ∈ FIRSTVT(T)）

从 T→T*F：
  * ≺ ( （( ∈ FIRSTVT(F)）
  * ≺ id （id ∈ FIRSTVT(F)）

从 F→(E)：
  ( ≺ + （+ ∈ FIRSTVT(E)）
  ( ≺ * （* ∈ FIRSTVT(E)）
  ( ≺ ( （( ∈ FIRSTVT(E)）
  ( ≺ id （id ∈ FIRSTVT(E)）

从 # 作为开始符：
  # ≺ + （+ ∈ FIRSTVT(E)）
  # ≺ * （* ∈ FIRSTVT(E)）
  # ≺ ( （( ∈ FIRSTVT(E)）
  # ≺ id （id ∈ FIRSTVT(E)）
```

**第四步：应用规则3（≻关系）**
```
从 E→E+T：
  + ≻ + （+ ∈ LASTVT(E)）
  + ≻ * （* ∈ LASTVT(E)）
  + ≻ ) （) ∈ LASTVT(E)）
  + ≻ id （id ∈ LASTVT(E)）

从 T→T*F：
  * ≻ * （* ∈ LASTVT(T)）
  * ≻ ) （) ∈ LASTVT(T)）
  * ≻ id （id ∈ LASTVT(T)）

从 F→(E)：
  + ≻ ) （+ ∈ LASTVT(E)）
  * ≻ ) （* ∈ LASTVT(E)）
  ) ≻ ) （) ∈ LASTVT(E)）
  id ≻ ) （id ∈ LASTVT(E)）

从 # 作为结束符：
  + ≻ # （+ ∈ LASTVT(E)）
  * ≻ # （* ∈ LASTVT(E)）
  ) ≻ # （) ∈ LASTVT(E)）
  id ≻ # （id ∈ LASTVT(E)）
```

### 2.4 优先表
|  | + | * | ( | ) | id | # |
|---|---|---|---|---|---|---|
| + | ≻ | ≺ | ≺ | ≻ | ≺ | ≻ |
| * | ≻ | ≻ | ≺ | ≻ | ≺ | ≻ |
| ( | ≺ | ≺ | ≺ | ≖ | ≺ |  |
| ) | ≻ | ≻ |  | ≻ |  | ≻ |
| id | ≻ | ≻ |  | ≻ |  | ≻ |
| # | ≺ | ≺ | ≺ |  | ≺ | ≖ |

## 三、另一个完整示例：简单表达式文法
### 3.1 文法
```
文法G：
E → E + T | T
T → T * F | F
F → id
```

### 3.2 计算FIRSTVT集
**计算FIRSTVT(F)**：
```
产生式 F→id
根据规则1，id ∈ FIRSTVT(F)
FIRSTVT(F) = {id}
```

**计算FIRSTVT(T)**：
```
产生式 T→T*F：点后面有*，但*在T后面，不是第一个
产生式 T→F：根据规则2，FIRSTVT(F) ⊆ FIRSTVT(T)
所以 id ∈ FIRSTVT(T)
产生式 T→T*F：点后面是*，但*不在最左位置（有T在前）
哦，等一下，重新看产生式T→T*F，我们需要的是T的FIRSTVT
找形如 T→a... 或 T→Qa... 的产生式
T→T*F 是 T→Qa... 的形式（Q=T, a=*）
所以 * ∈ FIRSTVT(T)

所以 FIRSTVT(T) = {*, id}
```

**计算FIRSTVT(E)**：
```
产生式 E→E+T：E→Qa... 形式（Q=E, a=+），所以 + ∈ FIRSTVT(E)
产生式 E→T：根据规则2，FIRSTVT(T) ⊆ FIRSTVT(E)
所以 *, id ∈ FIRSTVT(E)

FIRSTVT(E) = {+, *, id}
```

### 3.3 计算LASTVT集
**计算LASTVT(F)**：
```
产生式 F→id
根据规则1，id ∈ LASTVT(F)
LASTVT(F) = {id}
```

**计算LASTVT(T)**：
```
产生式 T→T*F：...aQ 形式（a=*, Q=F），所以 * ∈ LASTVT(T)
产生式 T→F：根据规则2，LASTVT(F) ⊆ LASTVT(T)
所以 id ∈ LASTVT(T)

LASTVT(T) = {*, id}
```

**计算LASTVT(E)**：
```
产生式 E→E+T：...aQ 形式（a=+, Q=T），所以 + ∈ LASTVT(E)
产生式 E→T：根据规则2，LASTVT(T) ⊆ LASTVT(E)
所以 *, id ∈ LASTVT(E)

LASTVT(E) = {+, *, id}
```

### 3.4 构造优先关系
**规则1（≖关系）**：
这个文法没有产生式包含两个相邻终结符，所以没有≖关系。

**规则2（≺关系）**：
```
从 E→E+T：+ ≺ *（* ∈ FIRSTVT(T)）
          + ≺ id（id ∈ FIRSTVT(T)）

从 T→T*F：* ≺ id（id ∈ FIRSTVT(F)）

从 # 作为开始符：# ≺ +（+ ∈ FIRSTVT(E)）
                  # ≺ *（* ∈ FIRSTVT(E)）
                  # ≺ id（id ∈ FIRSTVT(E)）
```

**规则3（≻关系）**：
```
从 E→E+T：+ ≻ +（+ ∈ LASTVT(E)）
          + ≻ *（* ∈ LASTVT(E)）
          + ≻ id（id ∈ LASTVT(E)）

从 T→T*F：* ≻ *（* ∈ LASTVT(T)）
          * ≻ id（id ∈ LASTVT(T)）

从 # 作为结束符：+ ≻ #（+ ∈ LASTVT(E)）
                  * ≻ #（* ∈ LASTVT(E)）
                  id ≻ #（id ∈ LASTVT(E)）
```

### 3.5 优先表
|  | + | * | id | # |
|---|---|---|---|---|
| + | ≻ | ≺ | ≺ | ≻ |
| * | ≻ | ≻ | ≺ | ≻ |
| id | ≻ | ≻ |   | ≻ |
| # | ≺ | ≺ | ≺ | ≖ |

## 四、优先表构造的验证
### 4.1 验证算符优先文法
一个文法是算符优先文法，当且仅当：
1. 它是算符文法（没有两个相邻的非终结符）
2. 任意两个终结符之间至多有≖、≺、≻中的一种关系

### 4.2 验证示例
上面构造的优先表满足：
- 没有冲突（任意两个终结符之间只有一种关系）
- 因此该文法是算符优先文法

## 五、FIRSTVT和LASTVT的另一种计算方法
### 5.1 用关系矩阵计算
可以用布尔矩阵来表示FIRSTVT和LASTVT的关系。

**FIRSTVT关系矩阵M**：
- M[P, a] = true 当且仅当 a ∈ FIRSTVT(P)

**初始化**：
- 对每个产生式 P→a... 或 P→Qa...，置 M[P, a] = true

**迭代**：
- 对每个产生式 P→Q...，如果 M[Q, a] = true，则置 M[P, a] = true
- 重复直到没有变化

### 5.2 示例：用矩阵计算FIRSTVT
**文法**：
```
E → E+T | T
T → T*F | F
F → id
```

**非终结符**：E, T, F
**终结符**：+, *, id

**初始化矩阵M**：
```
   +  *  id
E  F  F  F
T  F  F  F
F  F  F  T  （F→id）
```

**第一轮迭代**：
```
看产生式 T→F：
  因为M[F, id] = T，所以M[T, id] = T

看产生式 E→T：
  因为M[T, id] = T（刚设置），所以M[E, id] = T

看产生式 T→T*F：
  这是T→Qa...形式，a=*，所以M[T, *] = T

看产生式 E→E+T：
  这是E→Qa...形式，a=+，所以M[E, +] = T

现在矩阵：
   +  *  id
E  T  F  T
T  F  T  T
F  F  F  T
```

**第二轮迭代**：
```
看产生式 E→T：
  因为M[T, *] = T，所以M[E, *] = T

现在矩阵：
   +  *  id
E  T  T  T
T  F  T  T
F  F  F  T
```

**第三轮迭代**：
没有变化，结束。

**结果**：
```
FIRSTVT(E) = {+, *, id}
FIRSTVT(T) = {*, id}
FIRSTVT(F) = {id}
```
与之前的计算一致！

---

## 章节：视频5.2.3 算符优先分析算法笔记

# 视频5.2.3 算符优先分析算法笔记

## 一、算符优先分析器的结构
### 1.1 分析器组成
算符优先分析器由以下部分组成：
1. **输入缓冲区**：存放输入串，以#结束
2. **分析栈**：存放文法符号
3. **优先关系表**：存储终结符之间的优先关系
4. **总控程序**：控制分析过程

### 1.2 分析栈的结构
```
栈底 | 符号1 | 符号2 | ... | 符号k | ← 栈顶
     #       S1      S2          Sk
```

## 二、素短语和最左素短语
### 2.1 素短语的定义
**素短语**是指这样的短语：
1. 它至少包含一个终结符
2. 除它自身外，不再包含其他素短语

**注意**：素短语不一定是句柄。

### 2.2 最左素短语
最左素短语是最左边的素短语。

**示例**：
```
文法：E → E+T | T
      T → T*F | F
      F → (E) | id

句型：E+T*id
短语：
  E+T*id
  E+T
  T*id
  T
  id

素短语：
  T*id
  id

最左素短语：T*id
```

### 2.3 算符优先分析的特点
算符优先分析中，我们归约的是**最左素短语**，而不是句柄。

## 三、算符优先分析算法
### 3.1 算法描述
```
输入：输入串w，优先关系表
输出：如果w是句子，输出分析过程；否则报错

初始化：
  k = 1
  S[k] = #  // 栈初始化
  输入指针ip = 0
  a = 下一个输入符号

循环：
  if S[k] 是终结符 then
      j = k
  else
      j = k - 1
  
  // 找最左素短语的左边界
  while S[j] ≺ a 或 S[j] ≖ a do
      j = j - 1
  
  // 此时 S[j+1..k] 是最左素短语
  
  if 存在产生式 P → α，且α是素短语 then
      k = j + 1
      S[k] = P  // 归约
  else if a == # 且 k == 2 then
      返回 分析成功
  else if S[j] ≺ a 或 S[j] ≖ a then
      k = k + 1
      S[k] = a  // 移进
      a = 下一个输入符号
  else
      报错
```

### 3.2 算法详解
**步骤1：初始化**
- 栈初始化为 [#]
- 输入指针指向第一个符号
- a是当前输入符号

**步骤2：找j**
- 从栈顶向下找
- 找到第一个满足 S[j] ≺ a 或 S[j] ≖ a 的j
- 此时 S[j+1..k] 就是最左素短语

**步骤3：归约或移进**
- 如果S[j+1..k]可以归约为某个非终结符，则归约
- 否则，如果S[j] ≺ a 或 S[j] ≖ a，则移进a
- 否则报错

**步骤4：结束**
- 当栈为[#, S]且输入为#时，分析成功

## 四、算符优先分析示例
### 4.1 示例文法和优先表
**文法**：
```
E → E+T | T
T → T*F | F
F → (E) | id
```

**优先表**：
|  | + | * | ( | ) | id | # |
|---|---|---|---|---|---|---|
| + | ≻ | ≺ | ≺ | ≻ | ≺ | ≻ |
| * | ≻ | ≻ | ≺ | ≻ | ≺ | ≻ |
| ( | ≺ | ≺ | ≺ | ≖ | ≺ |  |
| ) | ≻ | ≻ |  | ≻ |  | ≻ |
| id | ≻ | ≻ |  | ≻ |  | ≻ |
| # | ≺ | ≺ | ≺ |  | ≺ | ≖ |

### 4.2 输入串
输入：`id + id * id #`

### 4.3 详细分析过程

| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | # | id + id * id # | 移进id |
| 2 | # id | + id * id # | 归约id→F |
| 3 | # F | + id * id # | 归约F→T |
| 4 | # T | + id * id # | 归约T→E |
| 5 | # E | + id * id # | 移进+ |
| 6 | # E + | id * id # | 移进id |
| 7 | # E + id | * id # | 归约id→F |
| 8 | # E + F | * id # | 归约F→T |
| 9 | # E + T | * id # | 移进* |
| 10 | # E + T * | id # | 移进id |
| 11 | # E + T * id | # | 归约id→F |
| 12 | # E + T * F | # | 归约T*F→T |
| 13 | # E + T | # | 归约E+T→E |
| 14 | # E | # | 接受 |

### 4.4 分析过程详解

**初始状态**：
```
栈：[#]
输入：id + id * id #
```

**步骤1-5：处理第一个id**：
```
移进id → 栈：[#, id]
归约id→F → 栈：[#, F]
归约F→T → 栈：[#, T]
归约T→E → 栈：[#, E]
移进+ → 栈：[#, E, +]
```

**步骤6-9：处理第二个id和***：
```
移进id → 栈：[#, E, +, id]
归约id→F → 栈：[#, E, +, F]
归约F→T → 栈：[#, E, +, T]
移进* → 栈：[#, E, +, T, *]
```

**步骤10-14：处理第三个id和归约**：
```
移进id → 栈：[#, E, +, T, *, id]
归约id→F → 栈：[#, E, +, T, *, F]
归约T*F→T → 栈：[#, E, +, T]
归约E+T→E → 栈：[#, E]
接受！
```

## 五、算符优先分析的优缺点
### 5.1 优点
1. **简单**：算法相对简单
2. **高效**：线性时间复杂度
3. **适合表达式**：特别适合表达式分析
4. **错误检测**：能较早发现错误

### 5.2 缺点
1. **能力有限**：只能分析算符优先文法
2. **不是规范归约**：不归约句柄，归约素短语
3. **可能错误归约**：有时可能接受错误的句子
4. **需要优先表**：需要构造优先关系表

## 七、另一个完整示例：简单表达式
### 7.1 示例文法和优先表
**文法**：
```
E → E + T | T
T → T * F | F
F → id
```

**优先表**：
|  | + | * | id | # |
|---|---|---|---|---|
| + | ≻ | ≺ | ≺ | ≻ |
| * | ≻ | ≻ | ≺ | ≻ |
| id | ≻ | ≻ |   | ≻ |
| # | ≺ | ≺ | ≺ | ≖ |

### 7.2 输入串
输入：`id * id + id #`

### 7.3 详细分析过程

| 步骤 | 栈内容（符号+状态） | 输入 | 优先关系 | 动作 |
|------|-------------------|------|---------|------|
| 1 | # | id * id + id # | # ≺ id | 移进id |
| 2 | # id | * id + id # | id ≻ * | 归约id→F |
| 3 | # F | * id + id # | # ≺ * | 移进* |
| 4 | # F * | id + id # | * ≺ id | 移进id |
| 5 | # F * id | + id # | id ≻ + | 归约id→F |
| 6 | # F * F | + id # | * ≻ + | 归约F*F→T |
| 7 | # T | + id # | # ≺ + | 移进+ |
| 8 | # T + | id # | + ≺ id | 移进id |
| 9 | # T + id | # | id ≻ # | 归约id→F |
| 10| # T + F | # | + ≻ # | 归约T+F→E |
| 11| # E | # | # ≖ # | 接受 |

### 7.4 分析过程详解

**步骤1-2**：
```
栈：#
输入：id * id + id #
# ≺ id → 移进id
栈变为：# id
输入：* id + id #
id ≻ * → 归约id→F
栈变为：# F
```

**步骤3-6**：
```
栈：# F
输入：* id + id #
# ≺ * → 移进*
栈变为：# F *
输入：id + id #
* ≺ id → 移进id
栈变为：# F * id
输入：+ id #
id ≻ + → 归约id→F
栈变为：# F * F
* ≻ + → 归约F*F→T
栈变为：# T
```

**步骤7-11**：
```
栈：# T
输入：+ id #
# ≺ + → 移进+
栈变为：# T +
输入：id #
+ ≺ id → 移进id
栈变为：# T + id
输入：#
id ≻ # → 归约id→F
栈变为：# T + F
+ ≻ # → 归约T+F→E
栈变为：# E
# ≖ # → 接受！
```

## 八、短语、直接短语、句柄、素短语的关系
### 8.1 概念回顾
1. **短语**：分析树中某棵子树的叶结点从左到右的连接
2. **直接短语**：子树高度为2的短语（只有一层子结点）
3. **句柄**：最左直接短语
4. **素短语**：至少包含一个终结符，且不包含其他素短语的短语

### 8.2 关系图
```
所有短语
  ├── 直接短语
  │    └── 句柄（最左直接短语）
  └── 素短语（至少含一个终结符，最小素短语）
```

### 8.3 示例
**文法**：
```
E → E + T | T
T → T * F | F
F → id
```

**句型**：`E + T * id`

**分析树**：
```
        E
       /|\
      E + T
      |  /|\
      T T * F
      |     |
      F    id
      |
      id
```

**短语**：
1. `E + T * id`（整个句型）
2. `E`（左子树）
3. `T * id`（右子树）
4. `T`（E的子树）
5. `id`（T的子树）
6. `id`（最右子树）

**直接短语**：
- `E`
- `T`
- `id`
- `id`

**句柄**：
- `E`（最左直接短语）

**素短语**：
- `id`
- `id`
- `T * id`（包含*和id，不包含其他素短语）

**最左素短语**：
- `id`

### 8.4 算符优先分析与LR分析的区别
| 特性 | 算符优先分析 | LR分析 |
|------|-------------|--------|
| 归约对象 | 最左素短语 | 句柄 |
| 分析能力 | 较弱（仅算符优先文法） | 较强（LR文法） |
| 实现复杂度 | 简单 | 较复杂 |
| 适用场景 | 表达式分析 | 通用语法分析 |

## 九、错误恢复的详细示例
### 9.1 错误输入
输入：`id + * id #`

### 9.2 分析过程和错误检测
```
步骤1：
  栈：#
  输入：id + * id #
  # ≺ id → 移进id

步骤2：
  栈：# id
  输入：+ * id #
  id ≻ + → 归约id→F

步骤3：
  栈：# F
  输入：+ * id #
  # ≺ + → 移进+

步骤4：
  栈：# F +
  输入：* id #
  + ≺ * → 移进*

步骤5：
  栈：# F + *
  输入：id #
  检查*和id的优先关系：* ≺ id → 移进id
  但是这里有问题：+后面直接跟*，缺少操作数！

错误检测：
  栈顶是*，输入是id
  虽然* ≺ id可以移进
  但从语义上看，这是错误的（缺少操作数）
```

### 9.3 错误恢复策略
**恐慌模式**：
```
跳过输入符号，直到找到同步符号
同步符号可以是+、*、#等

在这个例子中：
  可以跳过*，直接处理id
  或者插入一个id
```

**短语级恢复**：
```
在栈顶插入一个F，假装前面有一个操作数
  栈变为：# F + F *
  然后继续分析
```

## 六、错误恢复
### 6.1 错误检测
算符优先分析器在以下情况检测错误：
1. 栈顶和输入符号之间没有优先关系
2. 找不到可以归约的产生式
3. 优先关系表中没有相应的条目

### 6.2 错误恢复策略
1. **恐慌模式**：
   - 跳过输入符号，直到找到同步符号
   - 同步符号通常是运算符、括号、分号等

2. **短语级恢复**：
   - 对栈顶进行局部修改
   - 插入或删除符号

3. **错误产生式**：
   - 预测常见错误
   - 加入错误产生式

---

## 章节：视频5.2.4 优先函数笔记

# 视频5.2.4 优先函数笔记

## 一、优先函数的概念
### 1.1 为什么需要优先函数
优先关系表的问题：
- 占用存储空间大
- 比较速度相对较慢

**优先函数**的优势：
- 用两个函数f和g表示优先关系
- 节省存储空间
- 比较速度快（只需比较数值）

### 1.2 优先函数的定义
对于每个终结符a，定义两个函数f(a)和g(a)，使得：
- 若 a ≺ b，则 f(a) < g(b)
- 若 a ≖ b，则 f(a) = g(b)
- 若 a ≻ b，则 f(a) > g(b)

## 二、优先函数的构造方法
### 2.1 Floyd方法（Bellman-Ford算法）
Floyd方法是构造优先函数的经典方法。

#### 2.1.1 方法步骤
1. **创建结点**：
   - 对每个终结符a，创建两个结点：fₐ 和 gₐ

2. **添加边**：
   - 若 a ≺ b，添加一条从 gᵦ 到 fₐ 的有向边
   - 若 a ≻ b，添加一条从 fₐ 到 gᵦ 的有向边
   - 若 a ≖ b，添加两条边：fₐ→gᵦ 和 gᵦ→fₐ

3. **检查环**：
   - 如果图中有环，则不存在优先函数

4. **计算函数值**：
   - f(a) = 从 fₐ 出发的最长路径长度 + 1
   - g(a) = 从 gₐ 出发的最长路径长度 + 1

#### 2.1.2 方法图示
```
对于 a ≺ b：
  gᵦ → fₐ

对于 a ≻ b：
  fₐ → gᵦ

对于 a ≖ b：
  fₐ ↔ gᵦ
```

### 2.2 优先函数构造示例
**优先表**：
|  | + | * | ( | ) | id | # |
|---|---|---|---|---|---|---|
| + | ≻ | ≺ | ≺ | ≻ | ≺ | ≻ |
| * | ≻ | ≻ | ≺ | ≻ | ≺ | ≻ |
| ( | ≺ | ≺ | ≺ | ≖ | ≺ |  |
| ) | ≻ | ≻ |  | ≻ |  | ≻ |
| id | ≻ | ≻ |  | ≻ |  | ≻ |
| # | ≺ | ≺ | ≺ |  | ≺ | ≖ |

#### 2.2.1 步骤1：创建结点
```
结点：
  f₊, g₊
  f*, g*
  f(, g(
  f), g)
  fid, gid
  f#, g#
```

#### 2.2.2 步骤2：添加边
从优先表中提取关系：

```
+ ≻ +  → f₊ → g₊
+ ≺ *  → g* → f₊
+ ≺ (  → g( → f₊
+ ≻ )  → f₊ → g)
+ ≺ id → gid → f₊
+ ≻ #  → f₊ → g#

* ≻ +  → f* → g₊
* ≻ *  → f* → g*
* ≺ (  → g( → f*
* ≻ )  → f* → g)
* ≺ id → gid → f*
* ≻ #  → f* → g#

( ≺ +  → g₊ → f(
( ≺ *  → g* → f(
( ≺ (  → g( → f(
( ≖ )  → f( ↔ g)
( ≺ id → gid → f(

) ≻ +  → f) → g₊
) ≻ *  → f) → g*
) ≻ )  → f) → g)
) ≻ #  → f) → g#

id ≻ +  → fid → g₊
id ≻ *  → fid → g*
id ≻ )  → fid → g)
id ≻ #  → fid → g#

# ≺ +  → g₊ → f#
# ≺ *  → g* → f#
# ≺ (  → g( → f#
# ≺ id → gid → f#
# ≖ #  → f# ↔ g#
```

#### 2.2.3 步骤3：计算最长路径
计算从每个结点出发的最长路径长度：

```
从f₊出发：f₊→g₊→f(→... → 长度2
从g₊出发：g₊→f(→... → 长度1
从f*出发：f*→g*→... → 长度2
从g*出发：g*→f(→... → 长度1
从f(出发：f(↔g)→... → 长度1
从g(出发：g(→f(→... → 长度0
从f)出发：f)→g)→... → 长度1
从g)出发：g)↔f(→... → 长度1
从fid出发：fid→g)→... → 长度1
从gid出发：gid→f(→... → 长度0
从f#出发：f#↔g#→... → 长度1
从g#出发：g#↔f#→... → 长度1
```

#### 2.2.4 步骤4：得到优先函数
```
f(a) = 最长路径长度 + 1
g(a) = 最长路径长度 + 1

得到：
f(+) = 3, g(+) = 2
f(*) = 3, g(*) = 2
f(() = 2, g(() = 1
f()) = 2, g()) = 2
f(id) = 2, g(id) = 1
f(#) = 2, g(#) = 2
```

### 2.3 优先函数表
| a | f(a) | g(a) |
|---|------|------|
| + | 3 | 2 |
| * | 3 | 2 |
| ( | 2 | 1 |
| ) | 2 | 2 |
| id | 2 | 1 |
| # | 2 | 2 |

### 2.4 验证优先函数
验证构造的优先函数是否正确：

```
验证 + ≺ *：
  f(+) = 3, g(*) = 2
  3 < 2？不成立！

发现问题：需要重新调整。
```

**注意**：Floyd方法得到的是一个可行解，但可能不是唯一的，也可能需要调整。

### 2.5 另一种优先函数
一个可行的优先函数：

| a | f(a) | g(a) |
|---|------|------|
| + | 2 | 3 |
| * | 4 | 5 |
| ( | 1 | 6 |
| ) | 6 | 1 |
| id | 6 | 1 |
| # | 0 | 0 |

验证：
```
+ ≺ *：f(+)=2 < g(*)=5 ✓
+ ≻ +：f(+)=2 > g(+)=3 ✗ 不成立
```

**正确的优先函数示例**：

| a | f(a) | g(a) |
|---|------|------|
| + | 2 | 1 |
| * | 4 | 3 |
| ( | 0 | 5 |
| ) | 5 | 0 |
| id | 5 | 0 |
| # | 0 | 0 |

验证：
```
+ ≺ *：f(+)=2 < g(*)=3 ✓
+ ≻ +：f(+)=2 > g(+)=1 ✓
* ≻ +：f(*)=4 > g(+)=1 ✓
* ≻ *：f(*)=4 > g(*)=3 ✓
( ≺ +：f(()=0 < g(+)=1 ✓
( ≖ )：f(()=0 = g())=0 ✓
) ≻ +：f())=5 > g(+)=1 ✓
id ≻ +：f(id)=5 > g(+)=1 ✓
# ≺ +：f(#)=0 < g(+)=1 ✓
# ≖ #：f(#)=0 = g(#)=0 ✓
```

## 三、优先函数的性质
### 3.1 存在性
不是所有的优先表都有对应的优先函数。

**判断方法**：
- 用Floyd方法构造图
- 如果图中有环，则不存在优先函数

### 3.2 不唯一性
如果存在优先函数，则存在无穷多个优先函数。

**证明**：
- 如果f和g是优先函数
- 则f' = f + c，g' = g + c（c是常数）也是优先函数
- 或者f' = k×f，g' = k×g（k>0）也是优先函数

### 3.3 信息损失
优先函数丢失了一些信息：
- 优先表能精确表示三种关系
- 优先函数只能表示大小关系
- 可能出现 f(a) < g(b) 但实际上 a ≻ b 的情况（但构造时避免）

## 四、优先函数的优缺点
### 4.1 优点
1. **节省空间**：只存储2n个整数（n是终结符数）
   - 优先表需要n²个条目
   - 优先函数只需要2n个值

2. **比较速度快**：
   - 只需比较两个整数
   - 不需要查表

3. **实现简单**：
   - 用数组存储f和g
   - 比较操作简单

### 4.2 缺点
1. **不是所有优先表都有优先函数**
2. **构造相对复杂**
3. **信息损失**：可能掩盖某些错误
4. **调试困难**：出错时不如优先表直观

## 五、优先函数的应用
### 5.1 算符优先分析器
在算符优先分析器中使用优先函数：

```
比较a和b的优先关系：
  if f(a) < g(b):
      a ≺ b
  elif f(a) == g(b):
      a ≖ b
  else:
      a ≻ b
```

### 5.2 实现代码
```c
// 优先函数
int f[] = {2, 4, 0, 5, 5, 0};  // +, *, (, ), id, #
int g[] = {1, 3, 5, 0, 0, 0};

// 获取优先关系
int get_precedence(int a, int b) {
    if (f[a] < g[b]) {
        return LESS_THAN;    // ≺
    } else if (f[a] == g[b]) {
        return EQUAL;        // ≖
    } else {
        return GREATER_THAN; // ≻
    }
}
```

---

## 章节：视频5.3.1 LR分析器笔记

# 视频5.3.1 LR分析器笔记

## 一、LR分析器概述
### 1.1 LR分析器的概念
LR分析器是一种自底向上的语法分析器，L表示从左到右扫描输入，R表示构造最右推导的逆过程。

**LR分析器的特点**：
1. **能力强**：能分析大多数上下文无关文法
2. **高效**：线性时间分析
3. **错误检测早**：能尽早发现语法错误
4. **自动生成**：可以使用工具自动生成（如Yacc/Bison）

### 1.2 LR分析器的类型
1. **LR(0)**：最简单的LR方法，不需要向前看符号
2. **SLR(1)**：简单的LR方法，使用FOLLOW集
3. **LALR(1)**：向前看LR方法，能力强且分析表小
4. **LR(1)**：规范LR方法，能力最强但分析表大

### 1.3 LR分析器的组成
LR分析器由以下部分组成：
1. **输入缓冲区**：存放输入串
2. **分析栈**：存放状态和符号
3. **分析表**：ACTION表和GOTO表
4. **总控程序**：控制分析过程

## 二、LR分析表
### 2.1 分析表的结构
LR分析表分为两部分：
1. **ACTION表**：动作表，规定当前状态和输入符号时的动作
2. **GOTO表**：转移表，规定状态和非终结符时的转移

### 2.2 ACTION表的动作
ACTION表中的动作有四种：
1. **移进（Shift）**：sᵢ，将输入符号移进栈，转到状态i
2. **规约（Reduce）**：rⱼ，用第j个产生式规约
3. **接受（Accept）**：acc，分析成功
4. **报错（Error）**：空白或error，语法错误

### 2.3 分析表示例
**文法**：
```
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**分析表**：

| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   |acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |
| 7 | s5 |   |   | s4 |   |   |   |   |   | 10|
| 8 |    | s6|   |   |s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

## 三、LR分析算法
### 3.1 算法描述
```
输入：输入串w，LR分析表
输出：如果w是句子，输出分析过程；否则报错

初始化：
  将初始状态s0压入栈
  输入指针ip指向w的第一个符号
  a = 输入[ip]

循环：
  s = 栈顶状态
  查ACTION[s, a]
  case ACTION[s, a] of:
    shift s':
      将a和s'压入栈
      ip = ip + 1
      a = 输入[ip]
    reduce A→β:
      弹出2×|β|个符号
      s' = 栈顶状态
      将A和GOTO[s', A]压入栈
      输出产生式A→β
    accept:
      分析成功，返回
    error:
      调用错误恢复程序
```

### 3.2 示例分析
**输入**：id * id + id $

**分析过程**：

| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | 0 | id * id + id $ | s5 |
| 2 | 0 id 5 | * id + id $ | r6 (F→id) |
| 3 | 0 F 3 | * id + id $ | r4 (T→F) |
| 4 | 0 T 2 | * id + id $ | s7 |
| 5 | 0 T 2 * 7 | id + id $ | s5 |
| 6 | 0 T 2 * 7 id 5 | + id $ | r6 (F→id) |
| 7 | 0 T 2 * 7 F 10 | + id $ | r3 (T→T*F) |
| 8 | 0 T 2 | + id $ | r2 (E→T) |
| 9 | 0 E 1 | + id $ | s6 |
| 10 | 0 E 1 + 6 | id $ | s5 |
| 11 | 0 E 1 + 6 id 5 | $ | r6 (F→id) |
| 12 | 0 E 1 + 6 F 3 | $ | r4 (T→F) |
| 13 | 0 E 1 + 6 T 9 | $ | r1 (E→E+T) |
| 14 | 0 E 1 | $ | acc |

**规约产生式序列**：
1. F→id
2. T→F
3. F→id
4. T→T*F
5. E→T
6. F→id
7. T→F
8. E→E+T

## 四、LR(0)项目
### 4.1 LR(0)项目的定义
LR(0)项目是在产生式右部的某个位置加一个点（·），表示分析过程中已经识别了产生式的哪一部分。

**示例**：
- E→·E+T：初始项目，还没有识别任何符号
- E→E·+T：已经识别了E，期望识别+
- E→E+·T：已经识别了E+，期望识别T
- E→E+T·：归约项目，已经识别了完整的产生式

### 4.2 LR(0)项目的分类
1. **移进项目**：点后面是终结符，如A→α·aβ
2. **待约项目**：点后面是非终结符，如A→α·Bβ
3. **归约项目**：点在最后，如A→α·
4. **接受项目**：归约项目且左部是开始符号，如S'→S·

## 五、识别活前缀的DFA
### 5.1 活前缀
活前缀是规范句型的一个前缀，它不包含该句型的句柄右边的任何符号。

### 5.2 构造识别活前缀的DFA
1. **增广文法**：引入新的开始符号S'，添加产生式S'→S
2. **项目集闭包（Closure）**：
   - 初始项目加入闭包
   - 如果有项目A→α·Bβ在闭包中，则将所有B→·γ加入闭包
3. **GO函数**：
   - GO(I, X)是从项目集I出发，经过符号X到达的项目集
4. **构造DFA**：
   - 初始状态是CLOSURE({S'→·S})
   - 对每个状态I和每个符号X，如果GO(I, X)非空，则加入转移

### 5.3 示例
**增广文法**：
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**初始项目集I0**：
```
CLOSURE({E'→·E}) = {
  E'→·E,
  E→·E+T,
  E→·T,
  T→·T*F,
  T→·F,
  F→·(E),
  F→·id
}
```

**GO(I0, E)**：
```
CLOSURE({E'→E·, E→E·+T}) = {
  E'→E·,
  E→E·+T
}
```

**GO(I0, T)**：
```
CLOSURE({E→T·, T→T·*F}) = {
  E→T·,
  T→T·*F
}
```

## 六、LR(0)分析表的构造
### 6.1 构造算法
给定增广文法G'：

1. **构造项目集规范族**：C = {I0, I1, ..., In}
2. **构造ACTION表**：
   - 如果移进项目A→α·aβ∈Ii，且GO(Ii, a)=Ij，则ACTION[i, a] = sʲ
   - 如果归约项目A→α·∈Ii，则对所有a∈FOLLOW(A)，ACTION[i, a] = rⱼ（j是产生式编号）
   - 如果接受项目S'→S·∈Ii，则ACTION[i, $] = acc
3. **构造GOTO表**：
   - 如果GO(Ii, A)=Ij（A是非终结符），则GOTO[i, A] = j
4. **空白表项**：标记为error

### 6.2 LR(0)文法
如果LR(0)分析表中没有冲突（移进-规约冲突或规约-规约冲突），则称该文法为LR(0)文法。

## 七、LR分析器的实现
### 7.1 数据结构
```c
typedef enum { SHIFT, REDUCE, ACCEPT, ERROR } ActionType;

typedef struct {
    ActionType type;
    union {
        int state;    // SHIFT时的下一状态
        int prod;     // REDUCE时的产生式编号
    } val;
} Action;

Action action_table[MAX_STATE][MAX_TERMINAL];
int goto_table[MAX_STATE][MAX_NONTERMINAL];

// 产生式
struct Production {
    int lhs;        // 左部非终结符
    int rhs_len;    // 右部长度
} productions[MAX_PRODUCTION];
```

### 7.2 LR分析程序
```c
void lr_parse() {
    int stack[MAX_STACK];
    int top = 0;
    stack[top++] = 0;  // 初始状态
    
    int a = next_token();
    
    while (1) {
        int s = stack[top - 1];
        Action action = action_table[s][a];
        
        switch (action.type) {
            case SHIFT:
                stack[top++] = a;
                stack[top++] = action.val.state;
                a = next_token();
                break;
                
            case REDUCE:
                int prod_num = action.val.prod;
                int rhs_len = productions[prod_num].rhs_len;
                top -= 2 * rhs_len;  // 弹出2*rhs_len个元素
                
                int s_new = stack[top - 1];
                int lhs = productions[prod_num].lhs;
                int goto_state = goto_table[s_new][lhs];
                
                stack[top++] = lhs;
                stack[top++] = goto_state;
                
                printf("规约: %s\n", production_str(prod_num));
                break;
                
            case ACCEPT:
                printf("分析成功！\n");
                return;
                
            case ERROR:
                printf("语法错误！\n");
                return;
        }
    }
}
```

## 八、LR分析器的优缺点
### 8.1 优点
1. **能力强**：能分析大多数上下文无关文法
2. **高效**：线性时间复杂度
3. **错误检测早**：能尽早发现错误
4. **自动生成**：可以使用工具自动生成

### 8.2 缺点
1. **实现复杂**：手工实现困难
2. **分析表大**：LR(1)分析表可能很大
3. **学习曲线陡峭**：需要学习较多概念

## 九、LR分析器的应用
1. **编译器**：大多数编译器使用LR分析器
2. **Yacc/Bison**：使用LALR(1)方法
3. **编程语言实现**：各种编程语言的语法分析

---

## 章节：视频5.3.2 LR分析过程笔记

# 视频5.3.2 LR分析过程笔记

## 一、LR分析的基本概念回顾
### 1.1 LR分析器的组成
1. **输入缓冲区**：存放输入串，以$结束
2. **分析栈**：存放状态和符号
3. **分析表**：ACTION表和GOTO表
4. **总控程序**：控制分析过程

### 1.2 分析栈的结构
```
栈底 → s0 X1 s1 X2 s2 ... Xm sm ← 栈顶
```
其中：
- s0, s1, ..., sm是状态
- X1, X2, ..., Xm是文法符号（终结符或非终结符）

### 1.3 ACTION表的动作
1. **移进（Shift）**：sᵢ，将输入符号移进栈，转到状态i
2. **规约（Reduce）**：rⱼ，用第j个产生式规约
3. **接受（Accept）**：acc，分析成功
4. **报错（Error）**：空白或error，语法错误

## 二、LR分析算法详解
### 2.1 算法的形式化描述
```
输入：
  - 输入串w = a1a2...an$
  - LR分析表（ACTION表和GOTO表）
  - 产生式集合P

输出：
  - 如果w是句子，输出规约序列
  - 否则报错

初始化：
  1. 栈.push(初始状态s0)
  2. ip = 1  // 输入指针，指向第一个输入符号
  3. a = a_ip  // 当前输入符号

循环：
  1. s = 栈顶状态
  2. action = ACTION[s, a]
  
  3. case action of:
      
      a) action = s_t (移进)：
         i. 将a压入栈
         ii. 将t压入栈
         iii. ip = ip + 1
         iv. a = a_ip
      
      b) action = r_k (规约，用第k个产生式A→β)：
         i. |β| = 第k个产生式右部的长度
         ii. 弹出2 × |β| 个符号（|β|个符号和|β|个状态）
         iii. s' = 栈顶状态
         iv. t = GOTO[s', A]
         v. 将A压入栈
         vi. 将t压入栈
         vii. 输出产生式A→β
      
      c) action = acc (接受)：
         i. 输出"分析成功"
         ii. 返回
      
      d) action = error (报错)：
         i. 输出"语法错误"
         ii. 调用错误恢复程序
```

### 2.2 算法的关键点
1. **栈的变化**：
   - 移进：压入2个元素（符号和状态）
   - 规约：弹出2×|β|个元素，压入2个元素（非终结符和状态）

2. **输入指针**：
   - 移进时指针前移
   - 规约时指针不移动

3. **GOTO表的使用**：
   - 规约后，根据新的栈顶状态和左部非终结符查GOTO表

## 三、LR分析过程示例
### 3.1 示例文法
**文法G**：
```
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**增广文法G'**：
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

### 3.2 LR分析表
| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   |acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |
| 7 | s5 |   |   | s4 |   |   |   |   |   | 10|
| 8 |    | s6|   |   |s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

### 3.3 输入串
输入：`id * id + id $`

### 3.4 详细分析过程

| 步骤 | 栈 | 输入 | ACTION | 动作说明 |
|------|-----|------|--------|----------|
| 1 | 0 | id * id + id $ | s5 | 移进id，状态5 |
| 2 | 0 id 5 | * id + id $ | r6 | 用F→id规约 |
|   |   |   |   | 弹出2个符号：5, id |
|   |   |   |   | 栈顶状态：0 |
|   |   |   |   | GOTO[0, F] = 3 |
| 3 | 0 F 3 | * id + id $ | r4 | 用T→F规约 |
|   |   |   |   | 弹出2个符号：3, F |
|   |   |   |   | 栈顶状态：0 |
|   |   |   |   | GOTO[0, T] = 2 |
| 4 | 0 T 2 | * id + id $ | s7 | 移进*，状态7 |
| 5 | 0 T 2 * 7 | id + id $ | s5 | 移进id，状态5 |
| 6 | 0 T 2 * 7 id 5 | + id $ | r6 | 用F→id规约 |
|   |   |   |   | 弹出2个符号：5, id |
|   |   |   |   | 栈顶状态：7 |
|   |   |   |   | GOTO[7, F] = 10 |
| 7 | 0 T 2 * 7 F 10 | + id $ | r3 | 用T→T*F规约 |
|   |   |   |   | 弹出6个符号：10, F, 7, *, 2, T |
|   |   |   |   | 栈顶状态：0 |
|   |   |   |   | GOTO[0, T] = 2 |
| 8 | 0 T 2 | + id $ | r2 | 用E→T规约 |
|   |   |   |   | 弹出2个符号：2, T |
|   |   |   |   | 栈顶状态：0 |
|   |   |   |   | GOTO[0, E] = 1 |
| 9 | 0 E 1 | + id $ | s6 | 移进+，状态6 |
| 10 | 0 E 1 + 6 | id $ | s5 | 移进id，状态5 |
| 11 | 0 E 1 + 6 id 5 | $ | r6 | 用F→id规约 |
|    |   |   |   | 弹出2个符号：5, id |
|    |   |   |   | 栈顶状态：6 |
|    |   |   |   | GOTO[6, F] = 3 |
| 12 | 0 E 1 + 6 F 3 | $ | r4 | 用T→F规约 |
|    |   |   |   | 弹出2个符号：3, F |
|    |   |   |   | 栈顶状态：6 |
|    |   |   |   | GOTO[6, T] = 9 |
| 13 | 0 E 1 + 6 T 9 | $ | r1 | 用E→E+T规约 |
|    |   |   |   | 弹出6个符号：9, T, 6, +, 1, E |
|    |   |   |   | 栈顶状态：0 |
|    |   |   |   | GOTO[0, E] = 1 |
| 14 | 0 E 1 | $ | acc | 分析成功！ |

### 3.5 规约序列
分析过程中使用的产生式（按规约顺序）：
1. F → id
2. T → F
3. F → id
4. T → T * F
5. E → T
6. F → id
7. T → F
8. E → E + T

### 3.6 最右推导（逆序）
规约序列的逆序就是最右推导：
```
E' ⇒ E
   ⇒ E + T
   ⇒ E + F
   ⇒ E + id
   ⇒ T + id
   ⇒ T * F + id
   ⇒ T * id + id
   ⇒ F * id + id
   ⇒ id * id + id
```

## 四、LR分析的栈变化跟踪
### 4.1 移进操作的栈变化
```
移进前：
栈：[0]
输入：id * id + id $

ACTION[0, id] = s5

移进后：
栈：[0, id, 5]
输入：* id + id $
```

### 4.2 规约操作的栈变化
```
规约前：
栈：[0, id, 5]
输入：* id + id $

ACTION[5, *] = r6 (F→id)

步骤1：弹出2×1=2个符号
弹出：5, id
栈变为：[0]

步骤2：栈顶状态s' = 0

步骤3：查GOTO[0, F] = 3

步骤4：压入F和3
栈变为：[0, F, 3]

规约后：
栈：[0, F, 3]
输入：* id + id $ (输入指针不变)
```

### 4.3 多符号规约的栈变化
```
规约前：
栈：[0, T, 2, *, 7, F, 10]
输入：+ id $

ACTION[10, +] = r3 (T→T*F)

步骤1：弹出2×3=6个符号
弹出：10, F, 7, *, 2, T
栈变为：[0]

步骤2：栈顶状态s' = 0

步骤3：查GOTO[0, T] = 2

步骤4：压入T和2
栈变为：[0, T, 2]

规约后：
栈：[0, T, 2]
输入：+ id $
```

## 五、LR分析的时间和空间复杂度
### 5.1 时间复杂度
LR分析的时间复杂度是O(n)，其中n是输入串的长度。

**原因**：
- 每个输入符号最多被移进一次
- 每个符号最多被规约一次
- 总的操作次数是线性的

### 5.2 空间复杂度
LR分析的空间复杂度是O(n)，其中n是输入串的长度。

**原因**：
- 栈的最大深度是O(n)
- 对于大多数编程语言，实际栈深度远小于n

## 六、LR分析与其他分析方法的比较
| 分析方法 | 时间复杂度 | 空间复杂度 | 文法范围 |
|----------|------------|------------|----------|
| LL(1) | O(n) | O(n) | LL(1) |
| 递归下降 | O(n) | O(n) | LL(1) |
| 算符优先 | O(n) | O(n) | 算符文法 |
| LR(0) | O(n) | O(n) | LR(0) |
| SLR(1) | O(n) | O(n) | SLR(1) |
| LALR(1) | O(n) | O(n) | LALR(1) |
| LR(1) | O(n) | O(n) | LR(1) |

## 七、LR分析的错误检测
### 7.1 错误检测时机
LR分析器在以下情况检测到错误：
1. ACTION表中对应项为空
2. ACTION表中对应项为error

### 7.2 错误检测的优点
1. **尽早检测**：LR分析器能在错误发生时立即检测到
2. **精确位置**：能准确定位错误位置
3. **错误信息**：能提供有用的错误信息

### 7.3 错误恢复策略
详见后续章节。

---

## 章节：视频5.3.3 构造识别活前缀的DFA笔记

# 视频5.3.3 构造识别活前缀的DFA笔记

## 一、活前缀
### 1.1 活前缀的定义
**规范前缀**：规范句型的前缀。

**活前缀（Viable Prefix）**：规范前缀的前缀，它不包含句柄右边的任何符号。

**意义**：
- 活前缀是可以出现在分析栈中的符号串
- LR分析过程就是识别活前缀的过程
- 当栈顶出现句柄时，就可以进行归约

### 1.2 示例
**文法**：
```
S' → S
S → aAcBe
A → b
A → Ab
B → d
```

**规范句型**：abbcde

**活前缀**：
- ε
- a
- ab
- aA
- aAb
- aAc
- aAcd
- aAcBe

**注意**：
- aAcBe 是句柄，所以 aAcBe 是活前缀
- aAcBed 不是活前缀，因为句柄后面还有d

## 二、LR(0)项目
### 2.1 LR(0)项目的定义
LR(0)项目是在产生式右部的某个位置加上一个点（·）。

**形式**：
- A → ·α
- A → α·β
- A → α·

### 2.2 LR(0)项目的分类
1. **移进项目**：点后面是终结符
   - 形式：A → α·aβ
   - 动作：移进a

2. **待约项目**：点后面是非终结符
   - 形式：A → α·Bβ
   - 动作：等待B归约

3. **归约项目**：点在最后
   - 形式：A → α·
   - 动作：用A→α归约

4. **接受项目**：归约项目且左部是开始符号
   - 形式：S' → S·
   - 动作：接受

### 2.3 示例
**文法**：
```
E' → E
E → E + T
E → T
T → T * F
T → F
F → ( E )
F → id
```

**项目示例**：
- 移进项目：E → ·E+T, E → E·+T, F → ·(E)
- 待约项目：E → ·T, T → ·F
- 归约项目：E → E+T·, T → T·
- 接受项目：E' → E·

## 三、项目集的闭包（Closure）
### 3.1 闭包的定义
项目集I的闭包CLOSURE(I)是满足以下条件的最小项目集：

1. I中的所有项目都在CLOSURE(I)中
2. 如果A → α·Bβ在CLOSURE(I)中，则对于任何产生式B → γ，项目B → ·γ也加入CLOSURE(I)
3. 重复步骤2，直到没有新的项目加入

### 3.2 闭包算法
```
函数 CLOSURE(I):
    J = I
    repeat
        变化标志 = false
        for 每个项目 A→α·Bβ ∈ J do
            for 每个产生式 B→γ do
                if B→·γ ∉ J then
                    将 B→·γ 加入 J
                    变化标志 = true
                end if
            end for
        end for
    until 变化标志 = false
    return J
```

### 3.3 闭包示例
**文法**：
```
E' → E
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**计算CLOSURE({E'→·E})**：
```
初始：J = {E'→·E}

第一轮：
  E'→·E 在 J 中
  加入 E→·E+T, E→·T
  J = {E'→·E, E→·E+T, E→·T}

第二轮：
  E→·T 在 J 中
  加入 T→·T*F, T→·F
  J = {E'→·E, E→·E+T, E→·T, T→·T*F, T→·F}

第三轮：
  T→·F 在 J 中
  加入 F→·(E), F→·id
  J = {E'→·E, E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}

第四轮：
  没有新项目加入
结束
```

## 四、GO函数
### 4.1 GO函数的定义
GO(I, X)是从项目集I出发，经过文法符号X转移后得到的项目集。

**定义**：
```
GO(I, X) = CLOSURE({A→αX·β | A→α·Xβ ∈ I})
```

**步骤**：
1. 从I中找出所有形如A→α·Xβ的项目
2. 将点移过X，得到A→αX·β
3. 对这些项目求闭包

### 4.2 GO函数示例
**文法同上**

**计算GO(I0, E)，其中I0 = CLOSURE({E'→·E})**：
```
I0中的项目：
  E'→·E, E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id

找出所有点后面是E的项目：
  E'→·E, E→·E+T

将点移过E：
  E'→E·, E→E·+T

求闭包：
  没有新项目加入（没有点后面是非终结符的项目）

GO(I0, E) = {E'→E·, E→E·+T}
```

**计算GO(I0, T)**：
```
找出I0中点后面是T的项目：
  E→·T, T→·T*F

将点移过T：
  E→T·, T→T·*F

求闭包：
  没有新项目加入

GO(I0, T) = {E→T·, T→T·*F}
```

**计算GO(I0, F)**：
```
找出I0中点后面是F的项目：
  T→·F

将点移过F：
  T→F·

求闭包：
  没有新项目加入

GO(I0, F) = {T→F·}
```

**计算GO(I0, ()**：
```
找出I0中点后面是(的项目：
  F→·(E)

将点移过(：
  F→(·E)

求闭包：
  加入 E→·E+T, E→·T
  加入 T→·T*F, T→·F
  加入 F→·(E), F→·id

GO(I0, () = {F→(·E), E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}
```

## 五、项目集规范族的构造
### 5.1 项目集规范族
项目集规范族是所有可能的项目集的集合。每个项目集代表DFA的一个状态。

### 5.2 构造算法
```
输入：拓广文法G'
输出：项目集规范族C

初始化：
    S0 = CLOSURE({S'→·S})
    C = {S0}
    队列 = [S0]

循环：
    while 队列不为空 do
        从队列中取出项目集I
        for 每个文法符号X do
            J = GO(I, X)
            if J ≠ ∅ 且 J ∉ C then
                将J加入C
                将J加入队列
            end if
        end for
    end while
```

### 5.3 构造示例：完整过程
**拓广文法**：
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**第一步：初始状态S0**
```
S0 = CLOSURE({E'→·E})
   = {E'→·E, E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}
C = {S0}
队列 = [S0]
```

**第二步：处理S0**
```
计算GO(S0, E) = S1:
  从S0中找点后面是E的项目：E'→·E, E→·E+T
  点移过E：E'→E·, E→E·+T
  求闭包：没有新项目加入
  S1 = {E'→E·, E→E·+T}

计算GO(S0, T) = S2:
  从S0中找点后面是T的项目：E→·T, T→·T*F
  点移过T：E→T·, T→T·*F
  求闭包：没有新项目加入
  S2 = {E→T·, T→T·*F}

计算GO(S0, F) = S3:
  从S0中找点后面是F的项目：T→·F
  点移过F：T→F·
  求闭包：没有新项目加入
  S3 = {T→F·}

计算GO(S0, () = S4:
  从S0中找点后面是(的项目：F→·(E)
  点移过(：F→(·E)
  求闭包：
    加入 E→·E+T, E→·T
    加入 T→·T*F, T→·F
    加入 F→·(E), F→·id
  S4 = {F→(·E), E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}

计算GO(S0, id) = S5:
  从S0中找点后面是id的项目：F→·id
  点移过id：F→id·
  求闭包：没有新项目加入
  S5 = {F→id·}

将S1, S2, S3, S4, S5加入C和队列
C = {S0, S1, S2, S3, S4, S5}
队列 = [S1, S2, S3, S4, S5]
```

**第三步：处理S1**
```
S1 = {E'→E·, E→E·+T}

计算GO(S1, +) = S6:
  从S1中找点后面是+的项目：E→E·+T
  点移过+：E→E+·T
  求闭包：
    加入 T→·T*F, T→·F
    加入 F→·(E), F→·id
  S6 = {E→E+·T, T→·T*F, T→·F, F→·(E), F→·id}

其他文法符号（E, T, F, (, id, )）的GO结果为空

将S6加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6}
队列 = [S2, S3, S4, S5, S6]
```

**第四步：处理S2**
```
S2 = {E→T·, T→T·*F}

计算GO(S2, *) = S7:
  从S2中找点后面是*的项目：T→T·*F
  点移过*：T→T*·F
  求闭包：
    加入 F→·(E), F→·id
  S7 = {T→T*·F, F→·(E), F→·id}

其他文法符号的GO结果为空

将S7加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7}
队列 = [S3, S4, S5, S6, S7]
```

**第五步：处理S3**
```
S3 = {T→F·}
所有文法符号的GO结果都为空
不加入新项目集
队列 = [S4, S5, S6, S7]
```

**第六步：处理S4**
```
S4 = {F→(·E), E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}

计算GO(S4, E) = S8:
  从S4中找点后面是E的项目：F→(·E), E→·E+T
  点移过E：F→(E·), E→E·+T
  求闭包：没有新项目加入
  S8 = {F→(E·), E→E·+T}

计算GO(S4, T) = S2 (已存在)
  同GO(S0, T)

计算GO(S4, F) = S3 (已存在)
  同GO(S0, F)

计算GO(S4, () = S4 (已存在)
  同GO(S0, ()

计算GO(S4, id) = S5 (已存在)
  同GO(S0, id)

将S8加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8}
队列 = [S5, S6, S7, S8]
```

**第七步：处理S5**
```
S5 = {F→id·}
所有文法符号的GO结果都为空
不加入新项目集
队列 = [S6, S7, S8]
```

**第八步：处理S6**
```
S6 = {E→E+·T, T→·T*F, T→·F, F→·(E), F→·id}

计算GO(S6, T) = S9:
  从S6中找点后面是T的项目：E→E+·T, T→·T*F
  点移过T：E→E+T·, T→T·*F
  求闭包：没有新项目加入
  S9 = {E→E+T·, T→T·*F}

计算GO(S6, F) = S3 (已存在)
计算GO(S6, () = S4 (已存在)
计算GO(S6, id) = S5 (已存在)

将S9加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9}
队列 = [S7, S8, S9]
```

**第九步：处理S7**
```
S7 = {T→T*·F, F→·(E), F→·id}

计算GO(S7, F) = S10:
  从S7中找点后面是F的项目：T→T*·F
  点移过F：T→T*F·
  求闭包：没有新项目加入
  S10 = {T→T*F·}

计算GO(S7, () = S4 (已存在)
计算GO(S7, id) = S5 (已存在)

将S10加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10}
队列 = [S8, S9, S10]
```

**第十步：处理S8**
```
S8 = {F→(E·), E→E·+T}

计算GO(S8, )) = S11:
  从S8中找点后面是)的项目：F→(E·)
  点移过)：F→(E)·
  求闭包：没有新项目加入
  S11 = {F→(E)·}

计算GO(S8, +) = S6 (已存在)
  同GO(S1, +)

将S11加入C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11}
队列 = [S9, S10, S11]
```

**第十一步：处理S9, S10, S11**
```
S9 = {E→E+T·, T→T·*F}
  计算GO(S9, *) = S7 (已存在)

S10 = {T→T*F·}
  所有GO结果为空

S11 = {F→(E)·}
  所有GO结果为空

队列为空，结束！
```

**最终得到的完整项目集规范族**：
```
S0: {E'→·E, E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}
S1: {E'→E·, E→E·+T}
S2: {E→T·, T→T·*F}
S3: {T→F·}
S4: {F→(·E), E→·E+T, E→·T, T→·T*F, T→·F, F→·(E), F→·id}
S5: {F→id·}
S6: {E→E+·T, T→·T*F, T→·F, F→·(E), F→·id}
S7: {T→T*·F, F→·(E), F→·id}
S8: {F→(E·), E→E·+T}
S9: {E→E+T·, T→T·*F}
S10: {T→T*F·}
S11: {F→(E)·}
```

## 六、识别活前缀的DFA
### 6.1 DFA的构造
项目集规范族中的每个项目集对应DFA的一个状态。

**DFA的状态**：S0, S1, S2, ..., S11

**DFA的转移**：
- 从Si经过X转移到Sj，当且仅当GO(Si, X) = Sj

### 6.2 DFA的状态图
```
S0 --E--> S1
S0 --T--> S2
S0 --F--> S3
S0 --(--> S4
S0 --id--> S5

S1 --+--> S6

S2 --*--> S7

S4 --E--> S8
S4 --T--> S2
S4 --F--> S3
S4 --(--> S4
S4 --id--> S5

S6 --T--> S9
S6 --F--> S3
S6 --(--> S4
S6 --id--> S5

S7 --F--> S10
S7 --(--> S4
S7 --id--> S5

S8 --)--> S11
S8 --+--> S6

S9 --*--> S7

S11 无出边（归约项目）
```

### 6.3 DFA的意义
- 每个状态对应一个活前缀
- 路径上的符号串就是活前缀
- 当到达包含归约项目的状态时，可以进行归约
- 当到达包含接受项目的状态时，分析成功

## 七、项目集的冲突
### 7.1 冲突的类型
1. **移进-归约冲突**：
   - 同一个项目集中有移进项目和归约项目
   - 例如：{A→α·aβ, B→γ·}

2. **归约-归约冲突**：
   - 同一个项目集中有多个归约项目
   - 例如：{A→α·, B→β·}

### 7.2 LR(0)文法
如果项目集规范族中没有冲突（移进-归约冲突或归约-归约冲突），则称该文法为LR(0)文法。

### 7.3 冲突示例
**二义文法**：
```
E → E + E
E → E * E
E → id
```

**项目集示例**：
```
{ E→E·+E, E→E·*E, E→E· }
```
这个项目集有移进-归约冲突（可以移进+或*，也可以归约E→E·）

**解决方法**：
- 使用SLR(1)
- 使用LALR(1)
- 使用LR(1)
- 规定优先级和结合性

---

## 章节：视频5.3.4 LR(0)项目集规范族构造笔记

# 视频5.3.4 LR(0)项目集规范族构造笔记

## 一、LR(0)项目集规范族概述
### 1.1 项目集规范族的定义
项目集规范族是所有可能的LR(0)项目集的集合，它构成了识别活前缀的DFA的状态集合。

### 1.2 构造项目集规范族的目的
- 构造LR(0)分析表
- 识别活前缀
- 确定分析动作

## 二、构造前的准备
### 2.1 拓广文法
为了构造LR分析器，需要对原文法进行拓广。

**拓广方法**：
1. 引入新的开始符号S'
2. 添加产生式S' → S（S是原文法的开始符号）

**为什么需要拓广**：
- 确保接受项目只有一个（S'→S·）
- 方便构造DFA的初态

**示例**：
```
原文法：
E → E + T | T
T → T * F | F
F → ( E ) | id

拓广文法：
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

### 2.2 产生式编号
为了方便，给每个产生式一个编号，如上例中的(0)-(6)。

## 三、项目集规范族构造算法
### 3.1 算法回顾
```
输入：拓广文法G'
输出：项目集规范族C

1. 初始化：
   S0 = CLOSURE({S'→·S})
   C = {S0}
   队列 = [S0]

2. 迭代：
   while 队列不为空：
       取出I ∈ 队列
       for 每个文法符号X：
           J = GO(I, X)
           if J ≠ ∅ 且 J ∉ C：
               C = C ∪ {J}
               队列.append(J)

3. 返回C
```

### 3.2 关键函数
#### 3.2.1 CLOSURE函数
```
CLOSURE(I)：
   J = I
   repeat:
       changed = false
       for 每个项目 A→α·Bβ ∈ J：
           for 每个产生式 B→γ：
               if B→·γ ∉ J：
                   J = J ∪ {B→·γ}
                   changed = true
   until not changed
   return J
```

#### 3.2.2 GO函数
```
GO(I, X)：
   J = { A→αX·β | A→α·Xβ ∈ I }
   return CLOSURE(J)
```

## 四、完整构造示例
### 4.1 文法
使用前面的表达式文法。

### 4.2 详细构造过程

#### 步骤1：初始状态S0
```
计算S0 = CLOSURE({E'→·E})

初始：{E'→·E}

加入E→·E+T, E→·T
加入T→·T*F, T→·F
加入F→·(E), F→·id

S0 = {
    E'→·E,
    E→·E+T,
    E→·T,
    T→·T*F,
    T→·F,
    F→·(E),
    F→·id
}

C = {S0}
队列 = [S0]
```

#### 步骤2：处理S0
```
计算GO(S0, E):
    找出点后是E的项目：E'→·E, E→·E+T
    移点：E'→E·, E→E·+T
    闭包：无新项目
    S1 = {E'→E·, E→E·+T}

计算GO(S0, T):
    找出点后是T的项目：E→·T, T→·T*F
    移点：E→T·, T→T·*F
    闭包：无新项目
    S2 = {E→T·, T→T·*F}

计算GO(S0, F):
    找出点后是F的项目：T→·F
    移点：T→F·
    闭包：无新项目
    S3 = {T→F·}

计算GO(S0, ():
    找出点后是(的项目：F→·(E)
    移点：F→(·E)
    闭包：
        加入E→·E+T, E→·T
        加入T→·T*F, T→·F
        加入F→·(E), F→·id
    S4 = {
        F→(·E),
        E→·E+T,
        E→·T,
        T→·T*F,
        T→·F,
        F→·(E),
        F→·id
    }

计算GO(S0, id):
    找出点后是id的项目：F→·id
    移点：F→id·
    闭包：无新项目
    S5 = {F→id·}

加入S1, S2, S3, S4, S5到C和队列
C = {S0, S1, S2, S3, S4, S5}
队列 = [S1, S2, S3, S4, S5]
```

#### 步骤3：处理S1
```
计算GO(S1, +):
    找出点后是+的项目：E→E·+T
    移点：E→E+·T
    闭包：
        加入T→·T*F, T→·F
        加入F→·(E), F→·id
    S6 = {
        E→E+·T,
        T→·T*F,
        T→·F,
        F→·(E),
        F→·id
    }

其他转移无新项目
加入S6到C和队列
C = {S0, S1, S2, S3, S4, S5, S6}
队列 = [S2, S3, S4, S5, S6]
```

#### 步骤4：处理S2
```
计算GO(S2, *):
    找出点后是*的项目：T→T·*F
    移点：T→T*·F
    闭包：
        加入F→·(E), F→·id
    S7 = {
        T→T*·F,
        F→·(E),
        F→·id
    }

其他转移无新项目
加入S7到C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7}
队列 = [S3, S4, S5, S6, S7]
```

#### 步骤5：处理S3
```
S3 = {T→F·}，只有归约项目，无移进项目
GO(S3, X) = ∅ 对所有X
不加入新状态
队列 = [S4, S5, S6, S7]
```

#### 步骤6：处理S4
```
计算GO(S4, E):
    找出点后是E的项目：F→(·E), E→·E+T
    移点：F→(E·), E→E·+T
    闭包：无新项目
    S8 = {F→(E·), E→E·+T}

计算GO(S4, T):
    同S0→S2，得到S2（已存在）

计算GO(S4, F):
    同S0→S3，得到S3（已存在）

计算GO(S4, ():
    同S0→S4，得到S4（已存在）

计算GO(S4, id):
    同S0→S5，得到S5（已存在）

加入S8到C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8}
队列 = [S5, S6, S7, S8]
```

#### 步骤7：处理S5
```
S5 = {F→id·}，只有归约项目
无新状态
队列 = [S6, S7, S8]
```

#### 步骤8：处理S6
```
计算GO(S6, T):
    找出点后是T的项目：E→E+·T, T→·T*F
    移点：E→E+T·, T→T·*F
    闭包：无新项目
    S9 = {E→E+T·, T→T·*F}

计算GO(S6, F):
    同S0→S3，得到S3（已存在）

计算GO(S6, ():
    同S0→S4，得到S4（已存在）

计算GO(S6, id):
    同S0→S5，得到S5（已存在）

加入S9到C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9}
队列 = [S7, S8, S9]
```

#### 步骤9：处理S7
```
计算GO(S7, F):
    找出点后是F的项目：T→T*·F
    移点：T→T*F·
    闭包：无新项目
    S10 = {T→T*F·}

计算GO(S7, ():
    同S0→S4，得到S4（已存在）

计算GO(S7, id):
    同S0→S5，得到S5（已存在）

加入S10到C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10}
队列 = [S8, S9, S10]
```

#### 步骤10：处理S8
```
计算GO(S8, )):
    找出点后是)的项目：F→(E·)
    移点：F→(E)·
    闭包：无新项目
    S11 = {F→(E)·}

计算GO(S8, +):
    同S1→S6，得到S6（已存在）

加入S11到C和队列
C = {S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11}
队列 = [S9, S10, S11]
```

#### 步骤11：处理S9
```
计算GO(S9, *):
    同S2→S7，得到S7（已存在）

无新状态
队列 = [S10, S11]
```

#### 步骤12：处理S10和S11
```
都是归约项目，无新状态
队列为空，结束
```

### 4.3 最终的项目集规范族
```
S0 = {
    E'→·E,
    E→·E+T,
    E→·T,
    T→·T*F,
    T→·F,
    F→·(E),
    F→·id
}

S1 = {
    E'→E·,
    E→E·+T
}

S2 = {
    E→T·,
    T→T·*F
}

S3 = {
    T→F·
}

S4 = {
    F→(·E),
    E→·E+T,
    E→·T,
    T→·T*F,
    T→·F,
    F→·(E),
    F→·id
}

S5 = {
    F→id·
}

S6 = {
    E→E+·T,
    T→·T*F,
    T→·F,
    F→·(E),
    F→·id
}

S7 = {
    T→T*·F,
    F→·(E),
    F→·id
}

S8 = {
    F→(E·),
    E→E·+T
}

S9 = {
    E→E+T·,
    T→T·*F
}

S10 = {
    T→T*F·
}

S11 = {
    F→(E)·
}
```

## 五、检查LR(0)冲突
### 5.1 检查每个项目集
检查每个项目集中是否有移进-归约冲突或归约-归约冲突。

**S0**：只有移进和待约项目，无冲突
**S1**：有移进项目E→E·+T和接受项目E'→E·，冲突！
**S2**：有归约项目E→T·和移进项目T→T·*F，冲突！
**S3**：只有归约项目，无冲突
**S4**：只有移进和待约项目，无冲突
**S5**：只有归约项目，无冲突
**S6**：只有移进和待约项目，无冲突
**S7**：只有移进和待约项目，无冲突
**S8**：有移进项目E→E·+T和归约项目F→(E·)，冲突！
**S9**：有归约项目E→E+T·和移进项目T→T·*F，冲突！
**S10**：只有归约项目，无冲突
**S11**：只有归约项目，无冲突

### 5.2 结论
这个文法不是LR(0)文法，因为有多个冲突。需要使用SLR(1)、LALR(1)或LR(1)方法。

---

## 章节：视频5.3.5 由DFA构造LR(0)分析表笔记

# 视频5.3.5 由DFA构造LR(0)分析表笔记

## 一、LR(0)分析表的结构
### 1.1 分析表的组成
LR(0)分析表由两部分组成：
1. **ACTION表**：动作表
   - 行：状态
   - 列：终结符（包括$）
   - 内容：动作（移进、规约、接受、报错）

2. **GOTO表**：转移表
   - 行：状态
   - 列：非终结符
   - 内容：下一状态

### 1.2 ACTION表的动作类型
1. **移进（Shift）**：sⱼ
   - 将输入符号移进栈
   - 转到状态j

2. **规约（Reduce）**：rⱼ
   - 用第j个产生式规约

3. **接受（Accept）**：acc
   - 分析成功

4. **报错（Error）**：空白或error
   - 语法错误

## 二、LR(0)分析表构造算法
### 2.1 算法描述
给定项目集规范族C = {I0, I1, ..., In}：

1. **构造ACTION表**：
   a. 若移进项目A→α·aβ ∈ Ii，且GO(Ii, a) = Ij，则ACTION[i, a] = sⱼ
   b. 若归约项目A→α· ∈ Ii，则对任何终结符a（包括$），ACTION[i, a] = rⱼ（j是产生式编号）
   c. 若接受项目S'→S· ∈ Ii，则ACTION[i, $] = acc

2. **构造GOTO表**：
   a. 若GO(Ii, A) = Ij（A是非终结符），则GOTO[i, A] = j

3. **空白表项**：标为error

### 2.2 算法详解
**步骤1：编号状态和产生式**
- 状态编号：I0, I1, I2, ..., In
- 产生式编号：(0), (1), (2), ...

**步骤2：处理每个状态Ii**
- 遍历Ii中的所有项目
- 根据项目类型填写ACTION表

**步骤3：填写GOTO表**
- 对每个状态Ii和非终结符A
- 查GO(Ii, A)得到Ij
- 填写GOTO[i, A] = j

## 三、LR(0)分析表构造示例
### 3.1 项目集规范族
使用前一章构造的项目集规范族：
- I0, I1, I2, ..., I11

### 3.2 产生式编号
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

### 3.3 逐个状态处理
**处理I0**：
```
项目：
  E'→·E        待约
  E→·E+T       待约
  E→·T         待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I0, E) = I1
GO(I0, T) = I2
GO(I0, F) = I3
GO(I0, () = I4
GO(I0, id) = I5

ACTION[0, (] = s4
ACTION[0, id] = s5
GOTO[0, E] = 1
GOTO[0, T] = 2
GOTO[0, F] = 3
```

**处理I1**：
```
项目：
  E'→E·        接受
  E→E·+T       移进

GO(I1, +) = I6

ACTION[1, +] = s6
ACTION[1, $] = acc
注意：有冲突！归约项目E'→E·应该对所有a规约，但同时有移进项目
```

**处理I2**：
```
项目：
  E→T·         归约 (2)
  T→T·*F       移进

GO(I2, *) = I7

ACTION[2, *] = s7
ACTION[2, +] = r2
ACTION[2, )] = r2
ACTION[2, $] = r2
注意：有冲突！
```

**处理I3**：
```
项目：
  T→F·         归约 (4)

ACTION[3, +] = r4
ACTION[3, *] = r4
ACTION[3, )] = r4
ACTION[3, $] = r4
```

**处理I4**：
```
项目：
  F→(·E)       待约
  E→·E+T       待约
  E→·T         待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I4, E) = I8
GO(I4, T) = I2
GO(I4, F) = I3
GO(I4, () = I4
GO(I4, id) = I5

ACTION[4, (] = s4
ACTION[4, id] = s5
GOTO[4, E] = 8
GOTO[4, T] = 2
GOTO[4, F] = 3
```

**处理I5**：
```
项目：
  F→id·        归约 (6)

ACTION[5, +] = r6
ACTION[5, *] = r6
ACTION[5, )] = r6
ACTION[5, $] = r6
```

**处理I6**：
```
项目：
  E→E+·T       待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I6, T) = I9
GO(I6, F) = I3
GO(I6, () = I4
GO(I6, id) = I5

ACTION[6, (] = s4
ACTION[6, id] = s5
GOTO[6, T] = 9
GOTO[6, F] = 3
```

**处理I7**：
```
项目：
  T→T*·F       待约
  F→·(E)       移进
  F→·id        移进

GO(I7, F) = I10
GO(I7, () = I4
GO(I7, id) = I5

ACTION[7, (] = s4
ACTION[7, id] = s5
GOTO[7, F] = 10
```

**处理I8**：
```
项目：
  F→(E·)       移进
  E→E·+T       移进

GO(I8, )) = I11
GO(I8, +) = I6

ACTION[8, )] = s11
ACTION[8, +] = s6
注意：有冲突！F→(E·)是归约项目吗？不，是F→(E·)，点在E后面，还需要)
```

**处理I9**：
```
项目：
  E→E+T·       归约 (1)
  T→T·*F       移进

GO(I9, *) = I7

ACTION[9, *] = s7
ACTION[9, +] = r1
ACTION[9, )] = r1
ACTION[9, $] = r1
注意：有冲突！
```

**处理I10**：
```
项目：
  T→T*F·       归约 (3)

ACTION[10, +] = r3
ACTION[10, *] = r3
ACTION[10, )] = r3
ACTION[10, $] = r3
```

**处理I11**：
```
项目：
  F→(E)·       归约 (5)

ACTION[11, +] = r5
ACTION[11, *] = r5
ACTION[11, )] = r5
ACTION[11, $] = r5
```

### 3.4 LR(0)分析表（有冲突）
| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   |acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |
| 7 | s5 |   |   | s4 |   |   |   |   | 10|
| 8 |    | s6|   |   |s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

**冲突位置**：
- 状态1：ACTION[1, +] = s6，但E'→E·应该对所有a规约
- 状态2：ACTION[2, +] = r2和ACTION[2, *] = s7（移进-归约冲突）
- 状态9：ACTION[9, +] = r1和ACTION[9, *] = s7（移进-归约冲突）

## 四、LR(0)文法
### 4.1 LR(0)文法的定义
如果构造的LR(0)分析表没有多重定义（即没有冲突），则称该文法为LR(0)文法。

### 4.2 冲突的类型
1. **移进-归约冲突**：
   - 同一状态中有移进项目和归约项目
   - 例如：{A→α·aβ, B→γ·}

2. **归约-归约冲突**：
   - 同一状态中有多个归约项目
   - 例如：{A→α·, B→β·}

### 4.3 示例：LR(0)文法
```
文法：
S' → S
S → a A
A → b

项目集规范族：
I0 = {S'→·S, S→·aA}
I1 = {S'→S·}
I2 = {S→a·A, A→·b}
I3 = {S→aA·}
I4 = {A→b·}

分析表无冲突，这是LR(0)文法
```

## 五、LR(0)分析的局限
### 5.1 问题
大多数编程语言的文法都不是LR(0)文法，因为：
- 运算符优先级会引起冲突
- 不同的上下文需要不同的处理

### 5.2 解决方法
1. **SLR(1)**：使用FOLLOW集解决冲突
2. **LALR(1)**：向前看LR，能力强且表小
3. **LR(1)**：规范LR，能力最强但表大

下一章介绍SLR(1)方法。

---

## 章节：视频5.3.6 SLR(1)分析法的思想笔记

# 视频5.3.6 SLR(1)分析法的思想笔记

## 一、LR(0)的问题
### 1.1 冲突回顾
LR(0)分析表经常出现冲突：
1. **移进-归约冲突**：同一状态有移进和归约项目
2. **归约-归约冲突**：同一状态有多个归约项目

### 1.2 冲突示例
**状态2**：
```
{ E→T·, T→T·*F }
```
- E→T· 是归约项目，应该对所有a规约
- T→T·*F 是移进项目，对*应该移进
- 冲突：当a=*时，是移进还是规约？

**直觉**：
- 当a=*时，应该移进（因为*的优先级高）
- 当a=+、)、$时，应该规约

## 二、SLR(1)的基本思想
### 2.1 核心思想
SLR(1)（Simple LR）利用FOLLOW集来解决冲突。

**基本思想**：
对于归约项目A→α·，只对a ∈ FOLLOW(A)进行规约，而不是对所有a都规约。

### 2.2 为什么有效
**原因**：
- A→α·只有在后继符号是FOLLOW(A)中的符号时，规约才有意义
- 其他符号时，规约不可能是正确分析的一部分

**示例**：
```
归约项目E→T·
FOLLOW(E) = {$, )}

只对a ∈ {$, )}规约
其他符号（如+、*）时，不移进也不归约（或移进）
```

## 三、SLR(1)分析表构造算法
### 3.1 算法描述
给定项目集规范族C = {I0, I1, ..., In}：

1. **构造ACTION表**：
   a. 若移进项目A→α·aβ ∈ Ii，且GO(Ii, a) = Ij，则ACTION[i, a] = sⱼ
   b. 若归约项目A→α· ∈ Ii，则对任何a ∈ FOLLOW(A)，ACTION[i, a] = rⱼ（j是产生式编号）
   c. 若接受项目S'→S· ∈ Ii，则ACTION[i, $] = acc

2. **构造GOTO表**：
   a. 若GO(Ii, A) = Ij（A是非终结符），则GOTO[i, A] = j

3. **空白表项**：标为error

**关键区别**：
- LR(0)：对所有a都规约
- SLR(1)：只对a ∈ FOLLOW(A)规约

### 3.2 算法对比
| 特性 | LR(0) | SLR(1) |
|------|-------|--------|
| 归约条件 | 所有终结符 | a ∈ FOLLOW(A) |
| 冲突概率 | 高 | 低 |
| 文法范围 | 小 | 大 |

## 四、SLR(1)分析表构造示例
### 4.1 计算FOLLOW集
**文法**：
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

**FOLLOW集**：
```
FOLLOW(E') = {$}
FOLLOW(E) = {$, )}
FOLLOW(T) = {+, $, )}
FOLLOW(F) = {*, +, $, )}
```

### 4.2 逐个状态处理（SLR(1)方式）
**处理I1**：
```
项目：
  E'→E·        接受
  E→E·+T       移进

FOLLOW(E') = {$}

ACTION[1, +] = s6
ACTION[1, $] = acc
（无冲突！因为E'→E·只对$规约，而对+不移进也不归约，只处理移进）
```

**处理I2**：
```
项目：
  E→T·         归约 (2)
  T→T·*F       移进

FOLLOW(E) = {$, )}

ACTION[2, *] = s7
ACTION[2, +] = r2
ACTION[2, )] = r2
ACTION[2, $] = r2
（无冲突！因为E→T·只对+、)、$规约，对*移进）
```

**处理I9**：
```
项目：
  E→E+T·       归约 (1)
  T→T·*F       移进

FOLLOW(E) = {$, )}

ACTION[9, *] = s7
ACTION[9, +] = r1
ACTION[9, )] = r1
ACTION[9, $] = r1
（无冲突！因为E→E+T·只对+、)、$规约，对*移进）
```

### 4.3 SLR(1)分析表（无冲突！）
| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   |acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |
| 7 | s5 |   |   | s4 |   |   |   |   | 10|
| 8 |    | s6|   |   |s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

**完美！没有冲突了！**

## 五、SLR(1)分析过程示例
### 5.1 输入串
输入：`id * id + id $`

### 5.2 分析过程
| 步骤 | 栈 | 输入 | 动作 |
|------|-----|------|------|
| 1 | 0 | id * id + id $ | s5 |
| 2 | 0 id 5 | * id + id $ | r6 (F→id) |
| 3 | 0 F 3 | * id + id $ | r4 (T→F) |
| 4 | 0 T 2 | * id + id $ | s7 |
| 5 | 0 T 2 * 7 | id + id $ | s5 |
| 6 | 0 T 2 * 7 id 5 | + id $ | r6 (F→id) |
| 7 | 0 T 2 * 7 F 10 | + id $ | r3 (T→T*F) |
| 8 | 0 T 2 | + id $ | r2 (E→T) |
| 9 | 0 E 1 | + id $ | s6 |
| 10 | 0 E 1 + 6 | id $ | s5 |
| 11 | 0 E 1 + 6 id 5 | $ | r6 (F→id) |
| 12 | 0 E 1 + 6 F 3 | $ | r4 (T→F) |
| 13 | 0 E 1 + 6 T 9 | $ | r1 (E→E+T) |
| 14 | 0 E 1 | $ | acc |

**分析成功！**

## 六、SLR(1)文法
### 6.1 SLR(1)文法的定义
如果构造的SLR(1)分析表没有多重定义（即没有冲突），则称该文法为SLR(1)文法。

### 6.2 文法范围
LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1)

### 6.3 SLR(1)的优点
1. 分析表大小与LR(0)相同
2. 比LR(0)文法范围广
3. 实现相对简单
4. 效率高

### 6.4 SLR(1)的局限
有时SLR(1)也会有冲突，因为：
- FOLLOW集是全局的，没有考虑上下文
- 有时需要更精确的向前看符号

这时候需要使用LALR(1)或LR(1)。

## 七、SLR(1)总结
### 7.1 关键要点
1. **利用FOLLOW集**：只对FOLLOW(A)中的符号规约
2. **解决冲突**：有效解决LR(0)的冲突
3. **文法范围**：比LR(0)更广
4. **分析表大小**：与LR(0)相同

### 7.2 适用场景
SLR(1)适用于大多数编程语言的文法，是实际编译器中常用的方法。

Yacc/Bison就是基于SLR(1)或LALR(1)的。

---

## 章节：视频5.3.7 SLR(1)分析表的构造笔记

# 视频5.3.7 SLR(1)分析表的构造笔记

## 一、SLR(1)分析表构造的完整步骤
### 1.1 步骤总结
构造SLR(1)分析表需要以下步骤：
1. 拓广文法
2. 构造LR(0)项目集规范族
3. 计算每个非终结符的FOLLOW集
4. 根据项目集和FOLLOW集构造SLR(1)分析表

## 二、完整示例：表达式文法
### 2.1 步骤1：拓广文法
**原文法**：
```
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**拓广文法**：
```
(0) E' → E
(1) E → E + T
(2) E → T
(3) T → T * F
(4) T → F
(5) F → ( E )
(6) F → id
```

### 2.2 步骤2：构造LR(0)项目集规范族
已经在前面章节完成，得到12个状态：I0-I11

### 2.3 步骤3：计算FOLLOW集
计算FOLLOW集的规则：
1. 对于开始符号S，$ ∈ FOLLOW(S)
2. 若有产生式A→αBβ，则FIRST(β)-{ε} ⊆ FOLLOW(B)
3. 若有产生式A→αB或A→αBβ且β ⇒* ε，则FOLLOW(A) ⊆ FOLLOW(B)

**计算FOLLOW(E')**：
```
FOLLOW(E') = {$}
```

**计算FOLLOW(E)**：
```
从F→(E)，FIRST()) = {)}
  ) ∈ FOLLOW(E)
从E'→E，FOLLOW(E') ⊆ FOLLOW(E)
  $ ∈ FOLLOW(E)
FOLLOW(E) = {$, )}
```

**计算FOLLOW(T)**：
```
从E→E+T，FIRST(ε) = ∅
  FOLLOW(E) ⊆ FOLLOW(T)
  $, ) ∈ FOLLOW(T)
从E→E+T，FIRST(ε) = ∅
  + ∈ FOLLOW(T)（因为E→E+T，T后面可能有+）
FOLLOW(T) = {+, $, )}
```

**计算FOLLOW(F)**：
```
从T→T*F，FIRST(ε) = ∅
  FOLLOW(T) ⊆ FOLLOW(F)
  +, $, ) ∈ FOLLOW(F)
从T→T*F，* ∈ FOLLOW(F)
FOLLOW(F) = {*, +, $, )}
```

**最终FOLLOW集**：
```
FOLLOW(E') = {$}
FOLLOW(E) = {$, )}
FOLLOW(T) = {+, $, )}
FOLLOW(F) = {*, +, $, )}
```

### 2.4 步骤4：构造SLR(1)分析表
逐个状态处理：

**状态I0**：
```
项目：
  E'→·E        待约
  E→·E+T       待约
  E→·T         待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I0, E) = I1
GO(I0, T) = I2
GO(I0, F) = I3
GO(I0, () = I4
GO(I0, id) = I5

ACTION[0, (] = s4
ACTION[0, id] = s5
GOTO[0, E] = 1
GOTO[0, T] = 2
GOTO[0, F] = 3
```

**状态I1**：
```
项目：
  E'→E·        接受（FOLLOW(E')={$}）
  E→E·+T       移进

GO(I1, +) = I6

ACTION[1, +] = s6
ACTION[1, $] = acc
```

**状态I2**：
```
项目：
  E→T·         归约 (2)（FOLLOW(E)={$, )}）
  T→T·*F       移进

GO(I2, *) = I7

ACTION[2, *] = s7
ACTION[2, +] = r2
ACTION[2, )] = r2
ACTION[2, $] = r2
```

**状态I3**：
```
项目：
  T→F·         归约 (4)（FOLLOW(T)={+, $, )}）

ACTION[3, +] = r4
ACTION[3, *] = r4
ACTION[3, )] = r4
ACTION[3, $] = r4
```

**状态I4**：
```
项目：
  F→(·E)       待约
  E→·E+T       待约
  E→·T         待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I4, E) = I8
GO(I4, T) = I2
GO(I4, F) = I3
GO(I4, () = I4
GO(I4, id) = I5

ACTION[4, (] = s4
ACTION[4, id] = s5
GOTO[4, E] = 8
GOTO[4, T] = 2
GOTO[4, F] = 3
```

**状态I5**：
```
项目：
  F→id·        归约 (6)（FOLLOW(F)={*, +, $, )}）

ACTION[5, +] = r6
ACTION[5, *] = r6
ACTION[5, )] = r6
ACTION[5, $] = r6
```

**状态I6**：
```
项目：
  E→E+·T       待约
  T→·T*F       待约
  T→·F         待约
  F→·(E)       移进
  F→·id        移进

GO(I6, T) = I9
GO(I6, F) = I3
GO(I6, () = I4
GO(I6, id) = I5

ACTION[6, (] = s4
ACTION[6, id] = s5
GOTO[6, T] = 9
GOTO[6, F] = 3
```

**状态I7**：
```
项目：
  T→T*·F       待约
  F→·(E)       移进
  F→·id        移进

GO(I7, F) = I10
GO(I7, () = I4
GO(I7, id) = I5

ACTION[7, (] = s4
ACTION[7, id] = s5
GOTO[7, F] = 10
```

**状态I8**：
```
项目：
  F→(E·)       移进
  E→E·+T       移进

GO(I8, )) = I11
GO(I8, +) = I6

ACTION[8, )] = s11
ACTION[8, +] = s6
```

**状态I9**：
```
项目：
  E→E+T·       归约 (1)（FOLLOW(E)={$, )}）
  T→T·*F       移进

GO(I9, *) = I7

ACTION[9, *] = s7
ACTION[9, +] = r1
ACTION[9, )] = r1
ACTION[9, $] = r1
```

**状态I10**：
```
项目：
  T→T*F·       归约 (3)（FOLLOW(T)={+, $, )}）

ACTION[10, +] = r3
ACTION[10, *] = r3
ACTION[10, )] = r3
ACTION[10, $] = r3
```

**状态I11**：
```
项目：
  F→(E)·       归约 (5)（FOLLOW(F)={*, +, $, )}）

ACTION[11, +] = r5
ACTION[11, *] = r5
ACTION[11, )] = r5
ACTION[11, $] = r5
```

### 2.5 完整的SLR(1)分析表
| 状态 | id | + | * | ( | ) | $ | E | T | F |
|------|----|---|---|---|---|---|---|---|---|
| 0 | s5 |   |   | s4 |   |   | 1 | 2 | 3 |
| 1 |    | s6|   |   |   |acc|   |   |   |
| 2 |    | r2| s7|   | r2| r2|   |   |   |
| 3 |    | r4| r4|   | r4| r4|   |   |   |
| 4 | s5 |   |   | s4 |   |   | 8 | 2 | 3 |
| 5 |    | r6| r6|   | r6| r6|   |   |   |
| 6 | s5 |   |   | s4 |   |   |   | 9 | 3 |
| 7 | s5 |   |   | s4 |   |   |   |   | 10|
| 8 |    | s6|   |   |s11|   |   |   |   |
| 9 |    | r1| s7|   | r1| r1|   |   |   |
| 10|    | r3| r3|   | r3| r3|   |   |   |
| 11|    | r5| r5|   | r5| r5|   |   |   |

## 三、验证SLR(1)分析表
### 3.1 检查冲突
检查每个表项是否只有一个动作：
- 没有移进-归约冲突
- 没有归约-归约冲突
- **结论**：这是一个SLR(1)文法

### 3.2 测试分析过程
**输入**：`id * id + id $`

**分析过程**（参见上一章），成功！

## 四、另一个示例：简单文法
### 4.1 文法
```
S' → S
S → L = R | R
L → * R | id
R → L
```

### 4.2 计算FOLLOW集
```
FOLLOW(S') = {$}
FOLLOW(S) = {$}
FOLLOW(L) = {=, $}
FOLLOW(R) = {$, =}
```

### 4.3 构造SLR(1)分析表
省略详细步骤，最终分析表无冲突。

## 五、SLR(1)分析表构造的注意事项
### 5.1 常见错误
1. **忘记拓广文法**：必须添加S'→S
2. **FOLLOW集计算错误**：仔细应用规则
3. **状态编号错误**：确保GO函数计算正确
4. **动作类型错误**：区分移进、规约、接受

### 5.2 调试技巧
1. **先构造项目集规范族**：确保DFA正确
2. **验证FOLLOW集**：用另一种方法验证
3. **逐个状态检查**：确保每个状态处理正确
4. **测试简单输入**：用简单串验证分析过程

## 六、SLR(1)与其他方法的比较
| 方法 | 冲突解决 | 向前看 | 表大小 | 文法范围 |
|------|---------|--------|--------|---------|
| LR(0) | 无 | 无 | 小 | 小 |
| SLR(1) | FOLLOW集 | 1 | 小 | 中 |
| LALR(1) | 搜索符 | 1 | 中 | 大 |
| LR(1) | 搜索符 | 1 | 大 | 最大 |

---

## 章节：视频5.3.8 二义文法的使用笔记

# 视频5.3.8 二义文法的使用笔记

## 一、二义文法的问题
### 1.1 二义文法的定义
如果一个文法存在某个句子有两棵不同的语法树，则称该文法是二义的。

### 1.2 二义文法示例
**表达式文法**：
```
E → E + E
E → E * E
E → ( E )
E → id
```

**二义性**：
句子 `id + id * id` 有两棵语法树：
```
树1（先+后*）：
    E
   /|\
  E + E
 /|   |\
E * E  id
|   |
id  id

树2（先*后+）：
    E
   /|\
  E + E
 /|   |\
id  E * E
    |   |
    id  id
```

### 1.3 二义文法为什么有问题
1. **语法分析不确定**：同一个句子可能有多种分析方式
2. **语义不唯一**：不同的语法树可能对应不同的语义
3. **LR分析表有冲突**：项目集中有移进-归约冲突或归约-归约冲突

## 二、二义文法的项目集规范族
### 2.1 拓广文法
```
(0) E' → E
(1) E → E + E
(2) E → E * E
(3) E → ( E )
(4) E → id
```

### 2.2 构造项目集规范族
**I0**：
```
E'→·E
E→·E+E
E→·E*E
E→·(E)
E→·id
```

**I1 = GO(I0, E)**：
```
E'→E·
E→E·+E
E→E·*E
```
**冲突**：移进-归约冲突（E'→E· vs E→E·+E, E→E·*E）

**I2 = GO(I0, ()**：
```
E→(·E)
E→·E+E
E→·E*E
E→·(E)
E→·id
```

**I3 = GO(I0, id)**：
```
E→id·
```

**I4 = GO(I1, +)**：
```
E→E+·E
E→·E+E
E→·E*E
E→·(E)
E→·id
```

**I5 = GO(I1, *)**：
```
E→E*·E
E→·E+E
E→·E*E
E→·(E)
E→·id
```

**I6 = GO(I2, E)**：
```
E→(E·)
E→E·+E
E→E·*E
```
**冲突**：移进-归约冲突

继续构造...

## 三、解决二义性的方法
### 3.1 方法1：改写文法
将二义文法改写为非二义文法。

**示例**：
```
原文法（二义）：
E → E + E
E → E * E
E → ( E )
E → id

改写后（非二义）：
E → E + T | T
T → T * F | F
F → ( E ) | id
```

**优点**：
- 文法清晰
- 不需要额外处理

**缺点**：
- 改写可能复杂
- 可能增加产生式数量

### 3.2 方法2：使用二义文法+优先级和结合性
使用二义文法，但规定优先级和结合性。

**优点**：
- 文法简单
- 灵活

**缺点**：
- 需要额外规则
- 分析器需要特殊处理

### 3.3 优先级和结合性
**优先级**：
- * 高于 +
- 括号最高

**结合性**：
- + 左结合
- * 左结合

## 四、在LR分析中使用二义文法
### 4.1 基本思想
使用二义文法构造LR分析表，遇到冲突时用优先级和结合性规则解决。

### 4.2 解决冲突的规则
**移进-归约冲突**：
比较当前输入符号a和归约产生式的运算符：
1. **优先级**：
   - 如果a优先级 > 产生式运算符优先级：移进
   - 如果a优先级 < 产生式运算符优先级：规约
2. **结合性**：
   - 如果优先级相等：
     - 左结合：规约
     - 右结合：移进

**归约-归约冲突**：
通常选择靠前的产生式（或按其他规则）

## 五、示例：用二义文法构造分析表
### 5.1 文法
```
(0) E' → E
(1) E → E + E
(2) E → E * E
(3) E → ( E )
(4) E → id
```

### 5.2 优先级和结合性
```
优先级：* > +
结合性：+ 左结合，* 左结合
```

### 5.3 处理冲突状态I1
```
I1: {E'→E·, E→E·+E, E→E·*E}
冲突：
  - E'→E· 是接受项目（只对$）
  - E→E·+E 是移进项目（对+）
  - E→E·*E 是移进项目（对*）

解决：
  ACTION[1, +] = s4
  ACTION[1, *] = s5
  ACTION[1, $] = acc
```

### 5.4 处理冲突状态（遇到+时）
```
假设有状态：
  {E→E+E·, E→E·+E, E→E·*E}
输入符号：+

比较：
  归约产生式(1)的运算符是+
  输入符号是+
  优先级相等
  左结合：规约

所以：ACTION[i, +] = r1
```

### 5.5 处理冲突状态（遇到*时）
```
假设有状态：
  {E→E+E·, E→E·+E, E→E·*E}
输入符号：*

比较：
  归约产生式(1)的运算符是+
  输入符号是*
  *优先级 > +优先级：移进

所以：ACTION[i, *] = s5
```

## 六、完整的分析表（二义文法+优先级）
| 状态 | id | + | * | ( | ) | $ | E |
|------|----|---|---|---|---|---|---|
| 0 | s3 |   |   | s2 |   |   | 1 |
| 1 |    | s4| s5|   |   |acc|   |
| 2 | s3 |   |   | s2 |   |   | 6 |
| 3 |    | r4| r4|   | r4| r4|   |
| 4 | s3 |   |   | s2 |   |   | 7 |
| 5 | s3 |   |   | s2 |   |   | 8 |
| 6 |    | s4| s5|   | s9|   |   |
| 7 |    | r1| s5|   | r1| r1|   |
| 8 |    | r2| r2|   | r2| r2|   |
| 9 |    | r3| r3|   | r3| r3|   |

## 七、Yacc/Bison中的二义文法处理
### 7.1 Yacc声明优先级
```yacc
%token id
%left '+'
%left '*'

%%

E : E '+' E
  | E '*' E
  | '(' E ')'
  | id
  ;

%%
```

### 7.2 优先级声明
```
%left '+' '-'      // 左结合，优先级低
%left '*' '/'      // 左结合，优先级高
%right '^'         // 右结合
%nonassoc '<' '>'  // 无结合性
```

## 八、二义文法的优缺点
### 8.1 优点
1. **文法简洁**：产生式少，易读
2. **灵活**：可以通过优先级和结合性控制
3. **效率高**：分析表可能更小

### 8.2 缺点
1. **需要额外规则**：必须规定优先级和结合性
2. **可能出错**：规则设置不当会导致错误
3. **不通用**：不是所有二义文法都能用这种方法处理

## 九、总结
### 9.1 关键要点
1. **二义文法**：有句子对应多棵语法树
2. **解决方法**：
   - 改写为非二义文法
   - 使用二义文法+优先级和结合性
3. **LR分析中**：用优先级和结合性解决冲突
4. **实际应用**：Yacc/Bison常用这种方法

### 9.2 适用场景
- 表达式分析
- 有明确优先级和结合性的语言结构
- 需要简洁文法的场合