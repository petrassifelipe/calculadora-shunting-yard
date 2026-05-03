let campo = document.getElementById('campo')
campo.value = 0

function display(informacaoDisplay) {
    if (campo.value === '0' && /\d/.test(informacaoDisplay)) {
        campo.value = informacaoDisplay
    } else {
        campo.value += informacaoDisplay
    }
}

function calculadora() {
    let expressao = campo.value
    let numero = ''
    const tokens = []

    for (let i = 0; i < expressao.length; i++) {
        let caractere = expressao[i]

        if (/\d/.test(caractere) || caractere === ',' || caractere === '.') {
            numero += caractere
        } else if (caractere.match(/[+÷x\-\/]/g)) {
            tokens.push(numero)
            tokens.push(caractere)
            numero = ''
        }
    }

    if (numero !== '') {
        tokens.push(numero)
    }

    const precedencias = {
        '÷': 2,
        'x': 2,
        '+': 1,
        '-': 1
    }

    const saida = []
    const pilhaOperadores = []
    
    for (const token of tokens) {
        if (/\d/.test(token)) {
            saida.push(token)
        } else if (token.match(/[+÷x\-\/]/g)) {
            while (precedencias[pilhaOperadores[pilhaOperadores.length - 1]] >= precedencias[token]) {
                let operadorRemovido = pilhaOperadores.pop()
                saida.push(operadorRemovido)
            }
            pilhaOperadores.push(token)
        }
    }

    while (pilhaOperadores.length !== 0) {
        saida.push(pilhaOperadores.pop())
    }

    const pilha = []

    for (const token of saida) {
        if (/\d/.test(token)) {
            pilha.push(token)
        } else if (token.match(/[+÷x\-\/]/g)) {
            const ultimoDaPilha = Number(pilha.pop().replace(',', '.'))
            const anteriorDaPilha = Number(pilha.pop().replace(',', '.'))

            if (token === '+') {
                pilha.push(String(anteriorDaPilha + ultimoDaPilha))
            } else if (token === '-') {
                pilha.push(String(anteriorDaPilha - ultimoDaPilha))
            } else if (token === 'x') {
                pilha.push(String(anteriorDaPilha * ultimoDaPilha))
            } else if (token === '÷') {
                pilha.push(String(anteriorDaPilha / ultimoDaPilha))
            }
        }
    }
    campo.value = String(pilha).replace('.', ',')
}

function virgula() {
    let numero = campo.value.split(/[+÷x\-\/]/g)
    numero = numero[numero.length - 1]

    if (!numero.includes(',')) {
        display(',')
    }
}

function limpar() {
    campo.value = 0
}

function operadores(operador) {
    let digito = campo.value
    digito = digito[digito.length - 1]

    if (campo.value === '' || !digito.match(/[+÷x\-\/]/g)) {
        display(operador)
    }
}