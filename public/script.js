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
            <p><strong>Hora:</strong> <span id="reciboHora"></span></p>
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
    const cliente = document.getElementById("cliente").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const data = new Date().toLocaleDateString('pt-BR');
    const hora = new Date().toLocaleTimeString('pt-BR');

    if (cliente && telefone && descricao && valor) {
        document.getElementById("reciboCliente").textContent = cliente;
        document.getElementById("reciboTelefone").textContent = telefone;
        document.getElementById("reciboDescricao").textContent = descricao;
        document.getElementById("reciboValor").textContent = valor;
        document.getElementById("reciboData").textContent = data;
        document.getElementById("reciboHora").textContent = hora;

        const recibo = {
            cliente: cliente,
            telefone: telefone,
            descricao: descricao,
            valor: valor,
            data: data,
            hora: hora
        };

        const recibos = JSON.parse(localStorage.getItem("recibos")) || [];
        recibos.push(recibo);
        localStorage.setItem("recibos", JSON.stringify(recibos));
        carregarHistoricoRecibos();
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

// Função para carregar o histórico de recibos
function carregarHistoricoRecibos() {
    const recibos = JSON.parse(localStorage.getItem("recibos")) || [];
    const listaRecibos = document.getElementById("listaRecibos");
    listaRecibos.innerHTML = "";

    recibos.forEach((recibo, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>Cliente:</strong> ${recibo.cliente}</span>
            <span><strong>Telefone:</strong> ${recibo.telefone}</span>
            <span><strong>Descrição:</strong> ${recibo.descricao}</span>
            <span><strong>Valor:</strong> ${recibo.valor}</span>
            <span><strong>Data:</strong> ${recibo.data}</span>
            <span><strong>Hora:</strong> ${recibo.hora}</span>
            <button class="btnVisualizar" onclick="visualizarRecibo(${index})">Visualizar</button>
            <button class="btnExcluir" onclick="excluirRecibo(${index})">Excluir</button>
        `;
        listaRecibos.appendChild(li);
    });
}

// Função para visualizar um recibo do histórico
function visualizarRecibo(index) {
    const recibos = JSON.parse(localStorage.getItem("recibos")) || [];
    const recibo = recibos[index];

    document.getElementById("reciboCliente").textContent = recibo.cliente;
    document.getElementById("reciboTelefone").textContent = recibo.telefone;
    document.getElementById("reciboDescricao").textContent = recibo.descricao;
    document.getElementById("reciboValor").textContent = recibo.valor;
    document.getElementById("reciboData").textContent = recibo.data;
    document.getElementById("reciboHora").textContent = recibo.hora;

    document.getElementById("recibo").style.display = "block";
}

// Função para excluir um recibo do histórico
function excluirRecibo(index) {
    const recibos = JSON.parse(localStorage.getItem("recibos")) || [];
    recibos.splice(index, 1);
    localStorage.setItem("recibos", JSON.stringify(recibos));
    carregarHistoricoRecibos();
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

    let mensagem = `Recibo%0A--------------------%0A📌 Empresa: Nome da Empresa%0A📌 CNPJ: 00.000.000/0000-00%0A👤 Cliente: ${cliente}%0A📞 Telefone: ${telefone}%0A📝 Descrição: ${descricao}%0A💰 Valor: ${valor}%0A📅 Data: ${data}`;

    let link = `https://wa.me/55${telefoneNumerico}?text=${mensagem}`;
    window.open(link, '_blank');
}

// Função para salvar o recibo como PDF
function salvarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Recibo", 20, 20);
    doc.text(`Empresa: Nome da Empresa`, 20, 30);
    doc.text(`CNPJ: 00.000.000/0000-00`, 20, 40);
    doc.text(`Cliente: ${document.getElementById("reciboCliente").textContent}`, 20, 50);
    doc.text(`Telefone: ${document.getElementById("reciboTelefone").textContent}`, 20, 60);
    doc.text(`Descrição: ${document.getElementById("reciboDescricao").textContent}`, 20, 70);
    doc.text(`Valor: ${document.getElementById("reciboValor").textContent}`, 20, 80);
    doc.text(`Data: ${document.getElementById("reciboData").textContent}`, 20, 90);
    doc.text(`Hora: ${document.getElementById("reciboHora").textContent}`, 20, 100);
    doc.text("Obrigado pela preferência!", 20, 110);

    doc.save("recibo.pdf");
}

// Carregar configurações e histórico ao abrir a página
window.onload = function () {
    carregarConfiguracoes();
    carregarHistoricoRecibos();
};