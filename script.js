// Função para validar o telefone
function validarTelefone(telefone) {
    const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
}

// Função para validar o valor (aceita números, ponto ou vírgula para decimais)
function validarValor(valor) {
    const regex = /^[0-9]+([,\.][0-9]{1,2})?$/; // Aceita números com até 2 casas decimais
    return regex.test(valor);
}

// Função para carregar as configurações da empresa
function carregarConfiguracoes() {
    const configEmpresa = JSON.parse(localStorage.getItem("configEmpresa")) || {
        nomeEmpresa: "Nome da Empresa",
        cnpj: "00.000.000/0000-00",
        logo: ""
    };

    // Atualizar os dados da empresa no recibo
    document.getElementById("recibo").innerHTML = `
        <div class="recibo-header">
            <h3>Recibo</h3>
            ${configEmpresa.logo ? `<img src="${configEmpresa.logo}" alt="Logo da Empresa" style="width:100px; max-width: 100px; margin-bottom: 10px;">` : ""}
            <p><strong>Empresa:</strong> ${configEmpresa.nomeEmpresa}</p>
            <p><strong>CNPJ:</strong> ${configEmpresa.cnpj}</p>
        </div>
        <div class="recibo-body">
            <p><strong>Cliente:</strong> <span id="reciboCliente"></span></p>
            <p><strong>Telefone:</strong> <span id="reciboTelefone"></span></p>
            <p><strong>Descrição:</strong> <span id="reciboDescricao"></span></p>
            <p><strong>Valor:</strong> <span id="reciboValor"></span></p>
            <p><strong>Data:</strong> <span id="reciboData"></span></p>
        </div>
        <div class="recibo-footer">
            <p>Obrigado pela preferência!</p>
        </div>
        <button id="btnImprimir" onclick="imprimirRecibo()" aria-label="Imprimir Recibo">Imprimir Recibo</button>
        <button id="btnWhatsApp" onclick="enviarWhatsApp()" aria-label="Enviar via WhatsApp">Enviar via WhatsApp</button>
        <button id="btnPDF" onclick="salvarPDF()" aria-label="Salvar como PDF">Salvar como PDF</button>
    `;
}

// Função para gerar o recibo
function gerarRecibo() {
    let cliente = document.getElementById("cliente").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let valor = document.getElementById("valor").value.trim();
    let data = new Date().toLocaleDateString('pt-BR');

    if (cliente && telefone && descricao && valor) {
        if (!validarTelefone(telefone)) {
            alert("Telefone inválido! Insira um número válido.");
            return;
        }

        // Valida o campo "Valor"
        if (!validarValor(valor)) {
            alert("Valor inválido! Insira apenas números e use ponto ou vírgula para decimais.");
            return;
        }

        document.getElementById("reciboCliente").innerText = cliente;
        document.getElementById("reciboTelefone").innerText = telefone;
        document.getElementById("reciboDescricao").innerText = descricao;
        document.getElementById("reciboValor").innerText = valor;
        document.getElementById("reciboData").innerText = data;

        document.getElementById("recibo").style.display = "block";
        salvarReciboNoHistorico();
        alert("Recibo gerado com sucesso!");
    } else {
        alert("Preencha todos os campos!");
    }
}

// Função para salvar o recibo no histórico
function salvarReciboNoHistorico() {
    const recibo = {
        cliente: document.getElementById("reciboCliente").innerText,
        telefone: document.getElementById("reciboTelefone").innerText,
        descricao: document.getElementById("reciboDescricao").innerText,
        valor: document.getElementById("reciboValor").innerText,
        data: document.getElementById("reciboData").innerText
    };

    let historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    historico.push(recibo);
    localStorage.setItem("historicoRecibos", JSON.stringify(historico));

    carregarHistorico();
}

// Função para carregar o histórico de recibos
function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    const listaRecibos = document.getElementById("listaRecibos");
    listaRecibos.innerHTML = "";

    historico.forEach((recibo, index) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>Cliente:</strong> ${recibo.cliente}<br>
            <strong>Telefone:</strong> ${recibo.telefone}<br>
            <strong>Descrição:</strong> ${recibo.descricao}<br>
            <strong>Valor:</strong> ${recibo.valor}<br>
            <strong>Data:</strong> ${recibo.data}<br>
            <button onclick="visualizarRecibo(${index})">Visualizar</button>
            <button class="btnExcluir" onclick="excluirRecibo(${index})">Excluir</button>
        `;
        listaRecibos.appendChild(item);
    });
}

// Função para visualizar um recibo do histórico
function visualizarRecibo(index) {
    const historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    const recibo = historico[index];

    document.getElementById("reciboCliente").innerText = recibo.cliente;
    document.getElementById("reciboTelefone").innerText = recibo.telefone;
    document.getElementById("reciboDescricao").innerText = recibo.descricao;
    document.getElementById("reciboValor").innerText = recibo.valor;
    document.getElementById("reciboData").innerText = recibo.data;

    document.getElementById("recibo").style.display = "block";
}

// Função para excluir um recibo do histórico
function excluirRecibo(index) {
    let historico = JSON.parse(localStorage.getItem("historicoRecibos")) || [];
    historico.splice(index, 1);
    localStorage.setItem("historicoRecibos", JSON.stringify(historico));
    carregarHistorico();
}

// Função para imprimir o recibo
function imprimirRecibo() {
    let recibo = document.getElementById("recibo").cloneNode(true);
    recibo.querySelector("#btnImprimir").remove();
    recibo.querySelector("#btnWhatsApp").remove();
    recibo.querySelector("#btnPDF").remove();

    let printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Recibo</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(recibo.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Função para enviar o recibo via WhatsApp
function enviarWhatsApp() {
    let telefone = document.getElementById("reciboTelefone").innerText;
    let telefoneNumerico = telefone.replace(/\D/g, '');

    if (telefoneNumerico.length < 10) {
        alert("Número de telefone inválido!");
        return;
    }

    let cliente = document.getElementById("reciboCliente").innerText;
    let descricao = document.getElementById("reciboDescricao").innerText;
    let valor = document.getElementById("reciboValor").innerText;
    let data = document.getElementById("reciboData").innerText;

    let mensagem = `Recibo%0A--------------------%0A📌 Empresa: ${configEmpresa.nomeEmpresa}%0A📌 CNPJ: ${configEmpresa.cnpj}%0A👤 Cliente: ${cliente}%0A📞 Telefone: ${telefone}%0A📝 Descrição: ${descricao}%0A💰 Valor: ${valor}%0A📅 Data: ${data}`;

    let link = `https://wa.me/55${telefoneNumerico}?text=${mensagem}`;
    window.open(link, '_blank');
}

// Função para salvar o recibo como PDF
function salvarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Carregar configurações da empresa
    const configEmpresa = JSON.parse(localStorage.getItem("configEmpresa")) || {
        nomeEmpresa: "Nome da Empresa",
        cnpj: "00.000.000/0000-00",
        logo: ""
    };

    // Configurações gerais
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Margens e espaçamento
    const margin = 10;
    let y = margin;

    // Cabeçalho do recibo
    doc.setFontSize(18);
    doc.setTextColor(0, 123, 255); // Azul
    doc.text("Recibo", 105, y + 10, { align: "center" }); // Título centralizado
    y += 20;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    doc.text(configEmpresa.nomeEmpresa, 105, y + 10, { align: "center" }); // Nome da empresa
    doc.text(`CNPJ: ${configEmpresa.cnpj}`, 105, y + 16, { align: "center" }); // CNPJ
    y += 30;

    // Linha divisória
    doc.setDrawColor(0, 123, 255); // Azul
    doc.setLineWidth(0.5);
    doc.line(margin, y, 200 - margin, y); // Linha horizontal
    y += 10;

    // Seção "Dados do Cliente"
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51); // Cinza escuro
    doc.text("Dados do Cliente", margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Cliente: ${document.getElementById("reciboCliente").innerText}`, margin, y);
    y += 10;
    doc.text(`Telefone: ${document.getElementById("reciboTelefone").innerText}`, margin, y);
    y += 10;
    doc.text(`Descrição: ${document.getElementById("reciboDescricao").innerText}`, margin, y);
    y += 10;
    doc.text(`Valor: R$ ${document.getElementById("reciboValor").innerText}`, margin, y);
    y += 10;
    doc.text(`Data: ${document.getElementById("reciboData").innerText}`, margin, y);
    y += 20;

    // Linha divisória
    doc.setDrawColor(0, 123, 255); // Azul
    doc.setLineWidth(0.5);
    doc.line(margin, y, 200 - margin, y); // Linha horizontal
    y += 10;

    // Seção "Informações Adicionais"
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51); // Cinza escuro
    doc.text("Informações Adicionais", margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Formas de Pagamento: Dinheiro, Cartão, PIX", margin, y);
    y += 10;
    doc.text("Endereço: Rua Exemplo, 123 - Bairro, Cidade/UF", margin, y);
    y += 10;
    doc.text("Contato: (11) 1234-5678 | contato@empresa.com", margin, y);
    y += 20;

    // Rodapé do recibo
    doc.setFontSize(10);
    doc.setTextColor(119, 119, 119); // Cinza
    doc.text("Obrigado pela preferência!", 105, y, { align: "center" }); // Mensagem de agradecimento

    // Salvar o PDF
    doc.save("recibo.pdf");
}

// Carregar configurações e histórico ao abrir a página
window.onload = function () {
    carregarConfiguracoes();
    carregarHistorico();
};