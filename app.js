let campo = document.getElementById('campo')

function display(informacaoDisplay) {
    campo.value += informacaoDisplay
}

function calculadora() {
    let expressao = campo.value
    let numero = ''
    const tokens = []

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
            const ultimoDaPilha = Number(pilha.pop())
            const anteriorDaPilha = Number(pilha.pop())

            if (token === '+') {
                pilha.push(anteriorDaPilha + ultimoDaPilha)
            } else if (token === '-') {
                pilha.push(anteriorDaPilha - ultimoDaPilha)
            } else if (token === 'x') {
                pilha.push(anteriorDaPilha * ultimoDaPilha)
            } else if (token === '÷') {
                pilha.push(anteriorDaPilha / ultimoDaPilha)
            }
        }
    }
    campo.value = pilha
}

function limpar() {
    campo.value = ''
    operador = ''
    primeiroNumero = 0
    segundoNumero = 0
}
