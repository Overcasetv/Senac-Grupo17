// Dados de usuários e obras (simulando um banco de dados)
const USUARIOS = {
    // Usuário Engenheiro
    "joao@construtora.com": {
        role: "engenheiro",
        password: "password123",
        nome: "João Silva",
        telefone: "11987654321"
    },
    // Usuário Cliente
    "carla@cliente.com": {
        role: "cliente",
        password: "password456",
        nome: "Carla Menezes",
        telefone: "11912345678"
    },
    // Novo Usuário Dev
    "dev@gerencia.com": {
        role: "dev",
        password: "devpassword",
        nome: "Desenvolvedor",
        telefone: "11998877665"
    }
};

let projetos = [
    {
        id: "proj-001",
        nome: "Residência Família Menezes",
        engenheiro: { nome: "João Silva", email: "joao@construtora.com" },
        cliente: { nome: "Carla Menezes", email: "carla@cliente.com" },
        status: "Em andamento",
        progresso: 50,
        etapas: [
            {
                nome: "Fundação Concluída",
                comentario: "As sapatas e baldrames foram finalizados.",
                data: "2024-04-10",
                fotos: [
                    "https://placehold.co/150x110/0000FF/FFFFFF?text=Fundação+1",
                    "https://placehold.co/150x110/0000FF/FFFFFF?text=Fundação+2"
                ]
            },
            {
                nome: "Alvenaria do Térreo",
                comentario: "Levantamento das paredes do pavimento inferior.",
                data: "2024-05-20",
                fotos: [
                    "https://placehold.co/150x110/FF0000/FFFFFF?text=Alvenaria+1",
                    "https://placehold.co/150x110/FF0000/FFFFFF?text=Alvenaria+2"
                ]
            }
        ],
        avisos: [],
        documentos: [], // Nova propriedade para gestão de documentos
        tarefas: [
            { id: 1, descricao: "Verificar a entrega do cimento", concluida: false },
            { id: 2, descricao: "Reunião com o cliente", concluida: true }
        ],
        custos: []
    },
    {
        id: "proj-002",
        nome: "Edifício Alpha",
        engenheiro: { nome: "João Silva", email: "joao@construtora.com" },
        cliente: { nome: "Empresa ABC", email: "empresa@abc.com" },
        status: "Em andamento",
        progresso: 10,
        etapas: [],
        avisos: [],
        documentos: [],
        tarefas: [],
        custos: []
    }
];

// Funções para renderizar os painéis
function renderClientDashboard(projeto) {
    // Preenche as informações gerais da obra
    document.getElementById('obra-nome').textContent = projeto.nome;
    document.getElementById('cliente-nome').textContent = projeto.cliente.nome;
    document.getElementById('obra-status').textContent = projeto.status;

    // Atualiza a barra de progresso
    const progressBar = document.getElementById('client-progress-bar');
    const progressText = document.getElementById('client-progress-text');
    progressBar.style.width = `${projeto.progresso}%`;
    progressText.textContent = `${projeto.progresso}%`;

    // Preenche a linha do tempo das etapas
    const timelineList = document.getElementById('timeline-list');
    timelineList.innerHTML = ''; // Limpa o conteúdo anterior
    if (projeto.etapas.length === 0) {
        timelineList.innerHTML = '<p class="no-etapas">Nenhuma etapa cadastrada ainda.</p>';
    } else {
        projeto.etapas.forEach(etapa => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const formattedDate = new Date(etapa.data).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            const formattedTime = new Date(etapa.data).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
            });

            let galleryHtml = '';
            if (etapa.fotos.length > 0) {
                galleryHtml = `<div class="gallery">
                    ${etapa.fotos.map(url => `<img src="${url}" alt="Foto da etapa ${etapa.nome}">`).join('')}
                </div>`;
            }

            item.innerHTML = `
                <div class="timeline-date">${formattedDate} - ${formattedTime}</div>
                <div class="timeline-content">
                    <h4>${etapa.nome}</h4>
                    <p>${etapa.comentario}</p>
                    ${galleryHtml}
                </div>
            `;
            timelineList.appendChild(item);
        });
    }

    // Preenche a lista de avisos
    const avisosList = document.getElementById('avisos-list');
    avisosList.innerHTML = '';
    if (projeto.avisos.length === 0) {
        avisosList.innerHTML = '<p class="no-avisos">Nenhum aviso no momento.</p>';
    } else {
        projeto.avisos.forEach(aviso => {
            const avisoItem = document.createElement('li');
            avisoItem.innerHTML = `
                <div class="aviso-header">
                    <span>${aviso.data}</span>
                </div>
                <p>${aviso.mensagem}</p>
            `;
            avisosList.appendChild(avisoItem);
        });
    }

    // Nova funcionalidade: Preencher a galeria de fotos completa
    const photoGallery = document.getElementById('photo-gallery');
    photoGallery.innerHTML = '';
    const allPhotos = projeto.etapas.flatMap(etapa => etapa.fotos);
    if (allPhotos.length > 0) {
        allPhotos.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Foto da obra';
            photoGallery.appendChild(img);
        });
    } else {
        photoGallery.innerHTML = '<p class="no-etapas">Nenhuma foto disponível.</p>';
    }

    // Nova funcionalidade: Preencher relatórios de progresso
    const reportDetails = document.getElementById('report-details');
    reportDetails.innerHTML = `
        <p>Progresso Geral: <strong>${projeto.progresso}%</strong></p>
        <p>Número de Etapas Concluídas: <strong>${projeto.etapas.length}</strong></p>
    `;
}

function renderEngineerDashboard() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';
    
    projetos.forEach(projeto => {
        const item = document.createElement('div');
        item.className = 'project-card';
        item.innerHTML = `
            <h3>${projeto.nome}</h3>
            <p>Cliente: ${projeto.cliente.nome}</p>
            <p>Status: <span class="status">${projeto.status}</span></p>
            <button class="view-project-btn cta-button" data-id="${projeto.id}">Gerenciar</button>
        `;
        projectList.appendChild(item);
    });
}

// Nova função: Renderizar a lista de documentos
function renderProjectDocuments(projeto) {
    const documentList = document.getElementById('document-list');
    documentList.innerHTML = '';
    if (projeto.documentos.length === 0) {
        documentList.innerHTML = '<p>Nenhum documento adicionado.</p>';
    } else {
        projeto.documentos.forEach(doc => {
            const docItem = document.createElement('div');
            docItem.innerHTML = `<p><a href="${doc.url}" target="_blank">${doc.nome}</a></p>`;
            documentList.appendChild(docItem);
        });
    }
}

function renderProjectHistory(projeto) {
    const historyContainer = document.getElementById('project-history');
    historyContainer.innerHTML = '';

    const historyItems = [...projeto.etapas, ...projeto.avisos];
    historyItems.sort((a, b) => new Date(b.data) - new Date(a.data));

    if (historyItems.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">Nenhum histórico disponível para esta obra.</p>';
    } else {
        historyItems.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const formattedDate = new Date(item.data).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            const formattedTime = new Date(item.data).toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
            });

            if (item.nome) { // É uma etapa
                let galleryHtml = '';
                if (item.fotos && item.fotos.length > 0) {
                    galleryHtml = `<div class="history-gallery">
                        ${item.fotos.map(foto => `<img src="${foto}" alt="Foto da etapa ${item.nome}">`).join('')}
                    </div>`;
                }
                historyItem.innerHTML = `
                    <h4>Etapa: ${item.nome}</h4>
                    <p>${item.comentario}</p>
                    <p class="history-date">Data: ${formattedDate} - ${formattedTime}</p>
                    ${galleryHtml}
                `;
            } else { // É um aviso
                historyItem.innerHTML = `
                    <h4>Aviso</h4>
                    <p>${item.mensagem}</p>
                    <p class="history-date">Data: ${formattedDate} - ${formattedTime}</p>
                `;
            }
            historyContainer.appendChild(historyItem);
        });
    }
}

// Nova funcionalidade: Renderizar lista de tarefas
function renderTaskList(projeto) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (projeto.tarefas.length === 0) {
        taskList.innerHTML = '<p>Nenhuma tarefa cadastrada.</p>';
    } else {
        projeto.tarefas.forEach(tarefa => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${tarefa.concluida ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" data-task-id="${tarefa.id}" ${tarefa.concluida ? 'checked' : ''}>
                <span>${tarefa.descricao}</span>
            `;
            taskList.appendChild(taskItem);
        });
    }
}


// Renderiza a lista de projetos na página do Dev
function renderDevProjects() {
    const projectList = document.getElementById('dev-project-list');
    projectList.innerHTML = '';
    
    projetos.forEach(projeto => {
        const item = document.createElement('div');
        item.className = 'project-card';
        item.innerHTML = `
            <h3>${projeto.nome}</h3>
            <p>Engenheiro: ${projeto.engenheiro.nome}</p>
            <p>Cliente: ${projeto.cliente.nome}</p>
            <p>Status: <span class="status">${projeto.status}</span></p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${projeto.progresso}%;"></div>
                <div class="progress-text">${projeto.progresso}%</div>
            </div>
            <button class="edit-project-btn cta-button" data-id="${projeto.id}">Gerenciar</button>
        `;
        projectList.appendChild(item);
    });
}

// Nova função: Renderizar a lista de usuários para o Dev
function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    for (const email in USUARIOS) {
        const user = USUARIOS[email];
        const userItem = document.createElement('div');
        userItem.innerHTML = `<p><strong>${user.nome}</strong> (${user.role}) - ${email} <button data-email="${email}" class="edit-user-btn">Editar</button></p>`;
        userList.appendChild(userItem);
    }
}

// Nova função: Renderizar estatísticas do sistema
function renderSystemStats() {
    const statsContainer = document.getElementById('system-stats');
    const totalProjects = projetos.length;
    const ongoingProjects = projetos.filter(p => p.status === 'Em andamento').length;
    const completedProjects = projetos.filter(p => p.status === 'Concluído').length;
    const totalUsers = Object.keys(USUARIOS).length;

    statsContainer.innerHTML = `
        <div class="stat-box">Total de Projetos: <strong>${totalProjects}</strong></div>
        <div class="stat-box">Projetos em Andamento: <strong>${ongoingProjects}</strong></div>
        <div class="stat-box">Projetos Concluídos: <strong>${completedProjects}</strong></div>
        <div class="stat-box">Total de Usuários: <strong>${totalUsers}</strong></div>
    `;

    // Renderiza o gráfico de status do projeto
    const projectsByStatus = {
        'Em andamento': ongoingProjects,
        'Concluído': completedProjects,
        'Aguardando': projetos.filter(p => p.status === 'Aguardando').length
    };
    
    const chartContainer = document.querySelector('.chart-container');
    const labels = Object.keys(projectsByStatus);
    const data = Object.values(projectsByStatus);
    
    // Simulação de renderização de gráfico com canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    chartContainer.innerHTML = ''; // Limpa o contêiner
    chartContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const barWidth = 50;
    const barSpacing = 20;
    const maxVal = Math.max(...data) * 1.2;
    const colors = ['#3b82f6', '#22c55e', '#6b7280'];
    
    ctx.font = '12px Inter';
    
    // Desenha as barras
    for (let i = 0; i < data.length; i++) {
        const x = 50 + i * (barWidth + barSpacing);
        const barHeight = (data[i] / maxVal) * (canvas.height - 80);
        ctx.fillStyle = colors[i];
        ctx.fillRect(x, canvas.height - 40 - barHeight, barWidth, barHeight);
        
        // Desenha os rótulos
        ctx.fillStyle = '#1f2937';
        ctx.fillText(labels[i], x + barWidth / 2, canvas.height - 25);
        ctx.fillText(data[i], x + barWidth / 2, canvas.height - 45 - barHeight);
    }
}

function showDashboard(role, email) {
    document.getElementById('login-container').classList.add('hidden');
    
    if (role === 'engenheiro') {
        document.getElementById('engineer-dashboard').classList.remove('hidden');
        renderEngineerDashboard();
    } else if (role === 'cliente') {
        const projetoCliente = projetos.find(p => p.cliente.email === email);
        if (projetoCliente) {
            document.getElementById('client-dashboard').classList.remove('hidden');
            renderClientDashboard(projetoCliente);
        } else {
            document.getElementById('login-container').classList.remove('hidden');
            document.getElementById('message').textContent = 'Você não está associado a nenhuma obra.';
            document.getElementById('message').style.color = '#ef4444';
        }
    } else if (role === 'dev') {
        document.getElementById('dev-dashboard').classList.remove('hidden');
        renderDevProjects();
        renderUserList();
        renderSystemStats();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const engineerDashboard = document.getElementById('engineer-dashboard');
    const clientDashboard = document.getElementById('client-dashboard');
    const devDashboard = document.getElementById('dev-dashboard');
    const messageDisplay = document.getElementById('message');
    const logoutBtnEngineer = document.getElementById('logout-btn-engineer');
    const logoutBtnClient = document.getElementById('logout-btn-client');
    const logoutBtnDev = document.getElementById('logout-btn-dev');
    const addProjectForm = document.getElementById('new-project-form');
    const addStageForm = document.getElementById('add-stage-form');
    const sendNoticeForm = document.getElementById('send-notice-form');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addProjectModal = document.getElementById('add-project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const assignUserModal = document.getElementById('assign-user-modal');
    const closeAssignModalBtn = document.getElementById('close-assign-modal-btn');
    const addEngineerForm = document.getElementById('add-engineer-form');
    const addClientForm = document.getElementById('add-client-form');
    const devAddProjectBtn = document.getElementById('dev-add-project-btn');
    const devAddProjectModal = document.getElementById('dev-add-project-modal');
    const closeDevModalBtn = document.getElementById('close-dev-modal-btn');
    const devAddProjectForm = document.getElementById('dev-add-project-form');

    // Novas referências para o modal de edição do dev
    const devEditProjectModal = document.getElementById('dev-edit-project-modal');
    const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
    const devEditProjectForm = document.getElementById('dev-edit-project-form');

    const addDocumentForm = document.getElementById('add-document-form');
    
    // Novas referências para o modal de edição de usuário
    const editUserModal = document.getElementById('edit-user-modal');
    const closeUserEditModalBtn = document.getElementById('close-user-edit-modal-btn');
    const editUserForm = document.getElementById('edit-user-form');

    // Nova referência para formulário de tarefas e custos
    const addTaskForm = document.getElementById('add-task-form');
    const addCostForm = document.getElementById('add-cost-form');
    const clientChatForm = document.getElementById('client-chat-form');
    
    let currentProjectId = null;
    let currentUserEmail = null;

    function showLogin() {
        loginContainer.classList.remove('hidden');
        engineerDashboard.classList.add('hidden');
        clientDashboard.classList.add('hidden');
        devDashboard.classList.add('hidden');
        messageDisplay.textContent = '';
    }

    function populateUserSelects() {
        const engineerSelect = document.getElementById('dev-new-project-engineer');
        const clientSelect = document.getElementById('dev-new-project-client');
        
        engineerSelect.innerHTML = '<option value="">Selecione um engenheiro...</option>';
        clientSelect.innerHTML = '<option value="">Selecione um cliente...</option>';

        for (const email in USUARIOS) {
            const user = USUARIOS[email];
            if (user.role === 'engenheiro') {
                const option = document.createElement('option');
                option.value = email;
                option.textContent = user.nome;
                engineerSelect.appendChild(option);
            } else if (user.role === 'cliente') {
                const option = document.createElement('option');
                option.value = email;
                option.textContent = user.nome;
                clientSelect.appendChild(option);
            }
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = USUARIOS[email];

        if (user && user.password === password) {
            messageDisplay.textContent = 'Login bem-sucedido!';
            messageDisplay.style.color = '#22c55e';
            setTimeout(() => {
                showDashboard(user.role, email);
            }, 1000);
        } else {
            messageDisplay.textContent = 'Email ou senha incorretos.';
            messageDisplay.style.color = '#ef4444';
        }
    });

    logoutBtnEngineer.addEventListener('click', showLogin);
    logoutBtnClient.addEventListener('click', showLogin);
    logoutBtnDev.addEventListener('click', showLogin);

    addProjectBtn.addEventListener('click', () => {
        addProjectModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        addProjectModal.classList.add('hidden');
        addProjectForm.reset();
    });

    closeAssignModalBtn.addEventListener('click', () => {
        assignUserModal.classList.add('hidden');
    });

    devAddProjectBtn.addEventListener('click', () => {
        populateUserSelects();
        devAddProjectModal.classList.remove('hidden');
    });

    closeDevModalBtn.addEventListener('click', () => {
        devAddProjectModal.classList.add('hidden');
        devAddProjectForm.reset();
    });

    // Eventos do novo modal de edição do dev
    closeEditModalBtn.addEventListener('click', () => {
        devEditProjectModal.classList.add('hidden');
        devEditProjectForm.reset();
    });

    devEditProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('edit-project-status').value;
        const progress = parseInt(document.getElementById('edit-project-progress').value);

        const projectToUpdate = projetos.find(p => p.id === currentProjectId);
        if (projectToUpdate) {
            projectToUpdate.status = status;
            projectToUpdate.progresso = progress;
            renderDevProjects(); // Atualiza a lista na tela do dev
            devEditProjectModal.classList.add('hidden');
            alert('Projeto atualizado com sucesso!');
        }
    });

    devAddProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('dev-new-project-name').value;
        const engineerEmail = document.getElementById('dev-new-project-engineer').value;
        const clientEmail = document.getElementById('dev-new-project-client').value;
        const status = document.getElementById('dev-new-project-status').value;
        const progress = document.getElementById('dev-new-project-progress').value;

        const engineer = USUARIOS[engineerEmail];
        const client = USUARIOS[clientEmail];

        const newProjectId = `proj-${Date.now()}`;
        const newProject = {
            id: newProjectId,
            nome,
            engenheiro: { nome: engineer.nome, email: engineerEmail },
            cliente: { nome: client.nome, email: clientEmail },
            status,
            progresso: parseInt(progress),
            etapas: [],
            avisos: [],
            documentos: [],
            tarefas: [],
            custos: []
        };

        projetos.push(newProject);
        renderDevProjects();
        devAddProjectModal.classList.add('hidden');
        devAddProjectForm.reset();
        alert('Projeto cadastrado com sucesso!');
    });

    // Lógica do Dashboard do Engenheiro
    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('new-project-name').value;
        const clienteNome = document.getElementById('new-project-client-name').value;
        const clienteEmail = document.getElementById('new-project-client-email').value;

        const newProjectId = `proj-${Date.now()}`;
        const newProject = {
            id: newProjectId,
            nome,
            cliente: { nome: clienteNome, email: clienteEmail },
            status: "Em andamento",
            progresso: 0,
            etapas: [],
            avisos: [],
            tarefas: [],
            custos: []
        };

        projetos.push(newProject);
        renderEngineerDashboard();
        addProjectModal.classList.add('hidden');
        addProjectForm.reset();
        alert('Obra cadastrada com sucesso!');
    });

    document.getElementById('project-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('view-project-btn')) {
            currentProjectId = e.target.dataset.id;
            const project = projetos.find(p => p.id === currentProjectId);
            
            // Renderiza o painel de gerenciamento de etapas para o projeto selecionado
            document.getElementById('manage-project-title').textContent = project.nome;
            document.getElementById('manage-project-section').classList.remove('hidden');
            document.getElementById('engineer-dashboard-list').classList.add('hidden');
            
            // Renderiza o histórico da obra, documentos e tarefas
            renderProjectHistory(project);
            renderProjectDocuments(project);
            renderTaskList(project);
        }
    });

    addStageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('stage-name').value;
        const comentario = document.getElementById('stage-comment').value;
        const fotosInput = document.getElementById('stage-photos');
        const fotos = [];
        
        // Simulação de upload de foto
        if (fotosInput.files && fotosInput.files.length > 0) {
            for (let i = 0; i < fotosInput.files.length; i++) {
                const file = fotosInput.files[i];
                const reader = new FileReader();
                reader.onload = (event) => {
                    fotos.push(event.target.result);
                    if (fotos.length === fotosInput.files.length) {
                        finalizeAddStage(nome, comentario, fotos);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            finalizeAddStage(nome, comentario, fotos);
        }
    });
    
    function finalizeAddStage(nome, comentario, fotos) {
        const projeto = projetos.find(p => p.id === currentProjectId);

        if (projeto) {
            const novaEtapa = {
                nome,
                comentario,
                fotos,
                data: new Date().toISOString()
            };
            projeto.etapas.push(novaEtapa);
            renderProjectHistory(projeto);
            document.getElementById('add-stage-form').reset();
            alert('Etapa adicionada com sucesso! Um e-mail de notificação foi enviado ao cliente.'); // Simulação de e-mail
        }
    }
    
    sendNoticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const avisoMensagem = document.getElementById('notice-message').value;
        const projeto = projetos.find(p => p.id === currentProjectId);
        
        if (projeto) {
            projeto.avisos.push({
                mensagem: avisoMensagem,
                data: new Date().toISOString() // Atualiza para usar a data e hora atual
            });
            alert('Aviso enviado com sucesso!');
            renderProjectHistory(projeto);
            sendNoticeForm.reset();
        }
    });

    // Nova funcionalidade: Adicionar documento
    addDocumentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('document-name').value;
        const file = document.getElementById('document-file').files[0];

        const projeto = projetos.find(p => p.id === currentProjectId);
        if (projeto && file) {
            // Simulação de URL do documento
            const documentUrl = URL.createObjectURL(file);
            projeto.documentos.push({ nome, url: documentUrl });
            renderProjectDocuments(projeto);
            addDocumentForm.reset();
            alert('Documento adicionado com sucesso!');
        }
    });

    // Nova funcionalidade: Adicionar tarefa
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = document.getElementById('task-description').value;
        const projeto = projetos.find(p => p.id === currentProjectId);
        if (projeto) {
            const novaTarefa = {
                id: projeto.tarefas.length + 1,
                descricao,
                concluida: false
            };
            projeto.tarefas.push(novaTarefa);
            renderTaskList(projeto);
            addTaskForm.reset();
        }
    });

    document.getElementById('task-list').addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const taskId = parseInt(e.target.dataset.taskId);
            const projeto = projetos.find(p => p.id === currentProjectId);
            const tarefa = projeto.tarefas.find(t => t.id === taskId);
            if (tarefa) {
                tarefa.concluida = e.target.checked;
                renderTaskList(projeto);
            }
        }
    });

    document.getElementById('back-to-list-btn').addEventListener('click', () => {
        document.getElementById('manage-project-section').classList.add('hidden');
        document.getElementById('engineer-dashboard-list').classList.remove('hidden');
    });

    // Lógica do Dashboard do Dev
    addEngineerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('new-engineer-name').value;
        const telefone = document.getElementById('new-engineer-phone').value;
        const email = document.getElementById('new-engineer-email').value;
        const password = document.getElementById('new-engineer-password').value;

        if (USUARIOS[email]) {
            alert('Erro: Já existe um usuário com este e-mail.');
        } else {
            USUARIOS[email] = {
                role: 'engenheiro',
                password: password,
                nome,
                telefone
            };
            addEngineerForm.reset();
            renderUserList();
            alert(`Engenheiro ${nome} cadastrado com sucesso!`);
        }
    });

    addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('new-client-name').value;
        const telefone = document.getElementById('new-client-phone').value;
        const email = document.getElementById('new-client-email').value;
        const password = document.getElementById('new-client-password').value;

        if (USUARIOS[email]) {
            alert('Erro: Já existe um usuário com este e-mail.');
        } else {
            USUARIOS[email] = {
                role: 'cliente',
                password: password,
                nome,
                telefone
            };
            addClientForm.reset();
            renderUserList();
            alert(`Cliente ${nome} cadastrado com sucesso!`);
        }
    });
    
    // Altera o evento para abrir o novo modal de edição
    document.getElementById('dev-project-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-project-btn')) {
            currentProjectId = e.target.dataset.id;
            const project = projetos.find(p => p.id === currentProjectId);
            
            // Preenche o modal com os dados atuais do projeto
            document.getElementById('edit-project-status').value = project.status;
            document.getElementById('edit-project-progress').value = project.progresso;
            
            // Exibe o modal de edição
            devEditProjectModal.classList.remove('hidden');
        }
    });

    // Evento para abrir o modal de edição de usuário
    document.getElementById('user-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-user-btn')) {
            currentUserEmail = e.target.dataset.email;
            const user = USUARIOS[currentUserEmail];
            
            document.getElementById('edit-user-original-email').value = currentUserEmail;
            document.getElementById('edit-user-name').value = user.nome;
            document.getElementById('edit-user-email').value = currentUserEmail;
            document.getElementById('edit-user-phone').value = user.telefone;
            document.getElementById('edit-user-password').value = ''; // Limpa o campo de senha
            
            editUserModal.classList.remove('hidden');
        }
    });
    
    // Evento para fechar o modal de edição de usuário
    closeUserEditModalBtn.addEventListener('click', () => {
        editUserModal.classList.add('hidden');
        editUserForm.reset();
    });

    // Evento para salvar as alterações do usuário
    editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalEmail = document.getElementById('edit-user-original-email').value;
        const newName = document.getElementById('edit-user-name').value;
        const newEmail = document.getElementById('edit-user-email').value;
        const newPhone = document.getElementById('edit-user-phone').value;
        const newPassword = document.getElementById('edit-user-password').value;
        
        const userToUpdate = USUARIOS[originalEmail];

        // Atualiza os dados do usuário
        userToUpdate.nome = newName;
        userToUpdate.telefone = newPhone;
        if (newPassword) {
            userToUpdate.password = newPassword;
        }

        // Se o e-mail foi alterado, cria um novo objeto e remove o antigo
        if (originalEmail !== newEmail) {
            if (USUARIOS[newEmail]) {
                alert('Erro: Já existe um usuário com este novo e-mail.');
                return;
            }
            USUARIOS[newEmail] = userToUpdate;
            delete USUARIOS[originalEmail];
        }

        renderUserList(); // Atualiza a lista de usuários
        editUserModal.classList.add('hidden');
        alert('Usuário atualizado com sucesso!');
    });

    // Nova funcionalidade: Adicionar custo ao projeto (Dev)
    addCostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const costType = document.getElementById('cost-type').value;
        const costDescription = document.getElementById('cost-description').value;
        const costValue = parseFloat(document.getElementById('cost-value').value);

        const project = projetos.find(p => p.id === currentProjectId);
        if (project) {
            project.custos.push({
                tipo: costType,
                descricao: costDescription,
                valor: costValue,
                data: new Date().toISOString()
            });
            alert('Custo registrado com sucesso!');
            addCostForm.reset();
        }
    });

    // Nova funcionalidade: Simular chat do cliente
    clientChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('chat-message').value;
        if (message) {
            alert('Mensagem enviada com sucesso! O engenheiro responsável será notificado.');
            document.getElementById('chat-message').value = '';
        }
    });

    document.getElementById('back-to-dev-list-btn').addEventListener('click', () => {
        document.getElementById('manage-project-section').classList.add('hidden');
        document.getElementById('dev-dashboard').classList.remove('hidden');
        renderDevProjects();
    });
});