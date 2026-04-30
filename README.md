# 🧮 Calculadora

Uma calculadora web desenvolvida com HTML e JavaScript puro, sem dependências externas. O diferencial do projeto está na implementação manual do algoritmo **Shunting Yard** para avaliação de expressões matemáticas com respeito à precedência de operadores — sem uso de `eval()`.

---

## 📁 Estrutura do projeto

```
calculadora/
├── index.html
├── app.js
└── README.md
```

---

## ⚙️ Funcionalidades

- Operações de adição, subtração, multiplicação e divisão
- Respeito à precedência de operadores (`x` e `÷` antes de `+` e `-`)
- Entrada via botões na interface
- Limpeza do campo com o botão **AC**

---

## 🧠 Técnicas utilizadas

### 1. Manipulação do DOM

A interface é controlada diretamente via JavaScript puro, sem frameworks. O campo de entrada é selecionado com `document.getElementById` e seu valor é lido e atualizado dinamicamente conforme o usuário interage com os botões.

```js
let campo = document.getElementById('campo')

function display(informacaoDisplay) {
    campo.value += informacaoDisplay
}
```

Os botões utilizam o atributo `onclick` diretamente no HTML para acionar as funções `display()`, `calculadora()` e `limpar()`.

---

### 2. Tokenização da expressão

Antes de calcular, a expressão digitada pelo usuário (ex: `"8+3x2"`) é transformada em uma lista de **tokens** — unidades mínimas de significado, que podem ser números ou operadores.

O processo percorre caractere por caractere:
- Dígitos são acumulados em uma string `numero` para formar números completos
- Ao encontrar um operador, o número acumulado e o operador são empurrados para o array `tokens`

```js
for (let i = 0; i < expressao.length; i++) {
    let caractere = expressao[i]

    if (/\d/.test(caractere)) {
        numero += caractere
    } else if (caractere.match(/[+÷x\-\/]/g)) {
        tokens.push(numero)
        tokens.push(caractere)
        numero = ''
    }
}
```

Resultado para `"8+3x2"`: `["8", "+", "3", "x", "2"]`

---

### 3. Algoritmo Shunting Yard

O núcleo da calculadora é o **algoritmo Shunting Yard**, criado por Edsger Dijkstra. Ele converte uma expressão em **notação infixa** (a forma que humanos usam, ex: `3 + 5 x 2`) para **notação pós-fixa** (também chamada de RPN — *Reverse Polish Notation*), onde os operadores aparecem após seus operandos (ex: `3 5 2 x +`).

Essa conversão é necessária porque a notação infixa depende de precedência e parênteses para ser interpretada corretamente, enquanto a notação pós-fixa pode ser avaliada de forma linear com uma pilha, sem ambiguidades.

A precedência de cada operador é definida em um objeto:

```js
const precedencias = {
    '÷': 2,
    'x': 2,
    '+': 1,
    '-': 1
}
```

O algoritmo utiliza duas estruturas:
- **`saida`** — array que acumula os tokens em ordem pós-fixa
- **`pilhaOperadores`** — pilha auxiliar que segura os operadores enquanto sua precedência é resolvida

A lógica central: ao encontrar um operador, todos os operadores no topo da pilha com **precedência maior ou igual** são desempilhados para a saída antes de empilhar o operador atual.

```js
for (const token of tokens) {
    if (/\d/.test(token)) {
        saida.push(token)
    } else if (token.match(/[+÷x\-\/]/g)) {
        while (precedencias[pilhaOperadores[pilhaOperadores.length - 1]] >= precedencias[token]) {
            saida.push(pilhaOperadores.pop())
        }
        pilhaOperadores.push(token)
    }
}

while (pilhaOperadores.length !== 0) {
    saida.push(pilhaOperadores.pop())
}
```

Exemplo para `"8+3x2"` → tokens `["8", "+", "3", "x", "2"]`:

| Token | Saída       | Pilha de operadores |
|-------|-------------|----------------------|
| `8`   | `[8]`       | `[]`                 |
| `+`   | `[8]`       | `[+]`                |
| `3`   | `[8, 3]`    | `[+]`                |
| `x`   | `[8, 3]`    | `[+, x]`             |
| `2`   | `[8, 3, 2]` | `[+, x]`             |
| fim   | `[8, 3, 2, x, +]` | `[]`           |

Resultado RPN: `8 3 2 x +`

---

### 4. Avaliação da expressão em RPN com pilha

Com a expressão em notação pós-fixa, a avaliação é direta usando uma única **pilha**:

- Números são empilhados
- Ao encontrar um operador, os **dois últimos números** são desempilhados, a operação é aplicada e o resultado é empilhado de volta

```js
for (const token of saida) {
    if (/\d/.test(token)) {
        pilha.push(token)
    } else if (token.match(/[+÷x\-\/]/g)) {
        const ultimoDaPilha = Number(pilha.pop())
        const anteriorDaPilha = Number(pilha.pop())

        if (token === '+') pilha.push(anteriorDaPilha + ultimoDaPilha)
        else if (token === '-') pilha.push(anteriorDaPilha - ultimoDaPilha)
        else if (token === 'x') pilha.push(anteriorDaPilha * ultimoDaPilha)
        else if (token === '÷') pilha.push(anteriorDaPilha / ultimoDaPilha)
    }
}
```

Continuando o exemplo `8 3 2 x +`:

| Token | Pilha          |
|-------|----------------|
| `8`   | `[8]`          |
| `3`   | `[8, 3]`       |
| `2`   | `[8, 3, 2]`    |
| `x`   | `[8, 6]`       |
| `+`   | `[14]`         |

Resultado: `14` ✅

---

## 🚧 Em desenvolvimento

- [ ] Estilização com CSS
- [ ] Tratamento de erros (expressões inválidas, divisão por zero, campos vazios)

---

## 🚀 Como executar

Nenhuma instalação necessária. Basta abrir o arquivo `index.html` no navegador.

```bash
# Ou, com Live Server no VS Code:
# clique com o botão direito em index.html → "Open with Live Server"
```

---

## 🛠️ Tecnologias

- HTML5
- JavaScript (ES6+) — vanilla, sem bibliotecas externas
