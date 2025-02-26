export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.',
        patternMismatch: 'O nome deve conter apenas letras.'
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.',
        customError: 'O preço deve ser um valor válido.'
    },
    descricao: {
        valueMissing: 'O campo de descrição não pode estar vazio.'
    },
    quantidade: {
        valueMissing: 'O campo de quantidade não pode estar vazio.',
        customError: 'A quantidade deve ser maior que 0.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é válido.' 
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },
    telefone: {
        valueMissing: 'O campo de telefone não pode estar vazio.',
        customError: 'O telefone digitado não é válido.'
    },
    instagram: {
        valueMissing: 'O campo Instagram não pode estar vazio.',
        customError: 'O nome de usuário do Instagram deve começar com @.'
    }
}

const validadores = {
    nome: input => validaNome(input),
    preco: input => validaPreco(input),
    descricao: input => validaDescricao(input),
    quantidade: input => validaQuantidade(input),
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCPF(input),
    cep: input => recuperarCEP(input),
    telefone: input => validaTelefone(input),
    instagram: input => validaInstagram(input)
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
    
    return mensagem
}

function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if(!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    }

    input.setCustomValidity(mensagem)
}

function maiorQue18(data) {
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false
        }
    })

    return cpfValido
}

function checaEstruturaCPF(cpf) {
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}

function validaTelefone(input) {
    const telefone = input.value.replace(/\D/g, '')
    let mensagem = ''
    
    if (telefone.length < 11 || telefone.length > 11) {
        mensagem = 'O número de telefone não é válido.'
    } 
    else if (!['83'].includes(telefone.substring(0, 2))) {
        mensagem = 'O DDD informado não é válido.'
    } 
    else if (telefone.charAt(2) !== '9') {
        mensagem = 'O número de telefone deve começar com 9 após o DDD.'
    }
    
    input.setCustomValidity(mensagem)
}

function validaInstagram(input) {
    const instagram = input.value.trim()
    let mensagem = ''

    if (!instagram) {
        mensagem = 'O Instagram não pode estar vazio.'
    } else if (!instagram.startsWith('@')) {
        mensagem = 'O nome de usuário do Instagram deve começar com @.'
    }

    input.setCustomValidity(mensagem)
}


function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP.')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }
}

function preencheCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}

function validaDescricao(input) {
    let mensagem = ''

    if (!input.value.trim()) {
        mensagem = 'A descrição não pode estar vazia.'
    }

    input.setCustomValidity(mensagem)
}

function validaQuantidade(input) {
    const quantidade = input.value.trim();
    let mensagem = ''

    if (!quantidade || quantidade <= 0) {
        mensagem = 'A quantidade deve ser maior que 0.'
    }

    input.setCustomValidity(mensagem)
}
function validaPreco(input) {
    const preco = input.value.replace(/[^\d,]/g, '').replace(',', '.')

    if (!preco || parseFloat(preco) <= 0) {
        mensagem = 'O preço deve ser um valor válido.'
    }

    input.setCustomValidity(mensagem)
}