let paginaAtual = 1;
        let totalPaginas = 3;

        function gerarQRCode(texto) {
            return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(texto)}`;
        }

        // Função para gerar números aleatórios determinísticos com base em uma semente
        function gerarAleatorioComSemente(seed) {
            const x = Math.sin(seed++) * 10000;
            return Math.floor((x - Math.floor(x)) * 10000).toString().padStart(4, '0');
        }

        // // Função para obter a data atual formatada
        // function obterDataAtual() {
        //     const data = new Date();
        //     const dia = String(data.getDate()).padStart(2, '0');
        //     const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        //     const ano = data.getFullYear();
        //     return `${dia}/${mes}/${ano}`;
        // }

        function gerarPaginas() {
            const milhar = document.getElementById('milhar').value.padStart(4, '0'); // Garante 4 dígitos com zeros à esquerda
            const output = document.getElementById('output');
            output.innerHTML = ''; // Limpa conteúdo anterior
            paginaAtual = 1; // Reinicia a paginação
        
            if (!milhar || milhar.length !== 4) {
                alert('Por favor, digite uma milhar de 4 dígitos.');
                return;
            }
        
            let numeroBase = parseInt(milhar); // Número base para cálculos
        
            for (let pagina = 1; pagina <= 3; pagina++) {
                const pageDiv = document.createElement('div');
                pageDiv.classList.add('page');
                if (pagina === 1) pageDiv.classList.add('active'); // Página inicial ativa
                pageDiv.setAttribute('data-pagina', pagina);
                pageDiv.innerHTML = `<h2>Página ${pagina}</h2>`;
        
                const caixinhasDiv = document.createElement('div');
                caixinhasDiv.classList.add('caixinhas');
        
                for (let i = 0; i < 20; i++) { // 20 caixinhas por página
                    const caixinha = document.createElement('div');
                    caixinha.classList.add('caixinha');
                    
                    let combinacoes = [];
                    let numeroPrincipal = String(numeroBase + i + (pagina - 1) * 20).padStart(4, '0');
                    combinacoes.push(numeroPrincipal);
                    
                    // Adiciona 3 números aleatórios baseados na semente
                    for (let j = 0; j < 3; j++) {
                        const seed = parseInt(numeroPrincipal) + j; // Gera uma semente única para cada combinação
                        combinacoes.push(gerarAleatorioComSemente(seed));
                    }
                    
                    const numerosTexto = combinacoes.join('\n');
                    const numerosDiv = document.createElement('div');
                    numerosDiv.classList.add('numeros');
                    numerosDiv.innerText = numerosTexto; // Exibe os números verticalmente
                    caixinha.appendChild(numerosDiv);
        
                    // Adiciona subtítulo
                    const subtitulo = document.createElement('div');
                    subtitulo.classList.add('subtitulo');
                    subtitulo.innerText = "Não serão Aceitas Bilhetes que estejam Rasurados ou Rasgados\nSorteio Eletrônico Aberto ao Publico";
                    caixinha.appendChild(subtitulo);
        
                    // Adiciona QR Code
                    const qrCodeImg = document.createElement('img');
                    qrCodeImg.classList.add('qr-code');
                    qrCodeImg.src = gerarQRCode(numerosTexto);
                    qrCodeImg.alt = "QR Code";
                    caixinha.appendChild(qrCodeImg);
        
                    caixinhasDiv.appendChild(caixinha);
                }
        
                pageDiv.appendChild(caixinhasDiv);
                output.appendChild(pageDiv);
            }
        
            document.getElementById('pagination').style.display = 'block';
            atualizarPagina();
        }
        

        function mudarPagina(direcao) {
            paginaAtual += direcao;
            if (paginaAtual < 1) paginaAtual = 1;
            if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
            atualizarPagina();
        }

        function atualizarPagina() {
            const paginas = document.querySelectorAll('.page');
            paginas.forEach(pagina => {
                pagina.classList.remove('active');
                if (parseInt(pagina.getAttribute('data-pagina')) === paginaAtual) {
                    pagina.classList.add('active');
                }
            });
            document.getElementById('pagina-atual').innerText = `Página ${paginaAtual}`;
        }

        function imprimirPaginas() {
            const paginas = document.querySelectorAll('.page');
            if (paginas.length === 0) {
                alert('Por favor, gere as páginas antes de imprimir.');
                return;
            }
        
            // Temporariamente exibe todas as páginas para impressão
            paginas.forEach(pagina => {
                pagina.style.display = 'block';
            });
        
            // Inicia o comando de impressão
            window.print();
        
            // Restaura a visibilidade das páginas
            paginas.forEach((pagina, index) => {
                if (index + 1 !== paginaAtual) {
                    pagina.style.display = 'none';
                }
            });
        }
        